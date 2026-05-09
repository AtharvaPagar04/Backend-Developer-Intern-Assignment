/**
 * Migration: create_users_table
 *
 * Creates the `users` table with:
 *  - UUID primary key
 *  - name, email (unique), hashed password
 *  - role enum  : 'user' | 'admin'
 *  - is_active boolean flag
 *  - soft-delete via deleted_at
 *  - created_at / updated_at timestamps
 *  - indexes on email, role
 */

const TABLE = 'users';

/**
 * @param {import('knex').Knex} knex
 */
export const up = async (knex) => {
  await knex.schema.createTable(TABLE, (table) => {
    // ── Primary Key ──────────────────────────────────────────────────────────
    table.uuid('id').primary().defaultTo(knex.fn.uuid());

    // ── Core Fields ──────────────────────────────────────────────────────────
    table.string('name', 100).notNullable();
    table.string('email', 255).notNullable();
    table.string('password', 255).notNullable();

    // ── Role Enum ────────────────────────────────────────────────────────────
    table
      .enu('role', ['user', 'admin'], {
        useNative: true,
        enumName: 'user_role',
      })
      .notNullable()
      .defaultTo('user');

    // ── Status & Soft Delete ─────────────────────────────────────────────────
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamp('deleted_at').nullable();

    // ── Timestamps ───────────────────────────────────────────────────────────
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    // ── Constraints ──────────────────────────────────────────────────────────
    table.unique(['email'], { indexName: 'users_email_unique' });
  });

  // ── Explicit Indexes ───────────────────────────────────────────────────────
  await knex.schema.table(TABLE, (table) => {
    table.index(['email'],       'idx_users_email');
    table.index(['role'],        'idx_users_role');
    table.index(['deleted_at'],  'idx_users_deleted_at');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
export const down = async (knex) => {
  await knex.schema.dropTableIfExists(TABLE);

  // Drop the native enum type created above
  await knex.raw('DROP TYPE IF EXISTS user_role');
};
