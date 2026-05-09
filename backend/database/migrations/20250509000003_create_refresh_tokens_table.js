/**
 * Migration: create_refresh_tokens_table
 *
 * Creates the `refresh_tokens` table with:
 *  - UUID primary key
 *  - user_id FK → users.id (CASCADE DELETE)
 *  - token_hash  — stores the bcrypt/sha256 hash of the raw token
 *  - expires_at  — hard expiry timestamp enforced at DB level
 *  - revoked     — soft-revoke flag (allows token blacklisting without deletion)
 *  - created_at / updated_at timestamps
 *  - indexes on user_id, token_hash, expires_at + revoked
 */

const TABLE = 'refresh_tokens';

/**
 * @param {import('knex').Knex} knex
 */
export const up = async (knex) => {
  await knex.schema.createTable(TABLE, (table) => {
    // ── Primary Key ──────────────────────────────────────────────────────────
    table.uuid('id').primary().defaultTo(knex.fn.uuid());

    // ── Foreign Key ──────────────────────────────────────────────────────────
    table
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    // ── Token Fields ─────────────────────────────────────────────────────────
    table.string('token_hash', 512).notNullable();
    table.timestamp('expires_at').notNullable();

    // ── Revocation Flag ───────────────────────────────────────────────────────
    table.boolean('revoked').notNullable().defaultTo(false);

    // ── Timestamps ────────────────────────────────────────────────────────────
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });

  // ── Explicit Indexes ────────────────────────────────────────────────────────
  await knex.schema.table(TABLE, (table) => {
    // Look up tokens by owner
    table.index(['user_id'], 'idx_refresh_tokens_user_id');

    // Token lookup during refresh flow (unique hash per token family)
    table.index(['token_hash'], 'idx_refresh_tokens_token_hash');

    // Efficient cleanup of expired / revoked tokens
    table.index(['expires_at', 'revoked'], 'idx_refresh_tokens_expires_revoked');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
export const down = async (knex) => {
  await knex.schema.dropTableIfExists(TABLE);
};
