/**
 * Migration: create_tasks_table
 *
 * Creates the `tasks` table with:
 *  - UUID primary key
 *  - user_id FK → users.id (CASCADE DELETE)
 *  - title, optional description
 *  - status enum : 'pending' | 'in_progress' | 'completed' | 'archived'
 *  - priority enum: 'low' | 'medium' | 'high'
 *  - optional due_date (date only, no time)
 *  - soft-delete via deleted_at
 *  - created_at / updated_at timestamps
 *  - indexes on user_id, status, deleted_at
 */

const TABLE = 'tasks';

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

    // ── Core Fields ──────────────────────────────────────────────────────────
    table.string('title', 200).notNullable();
    table.text('description').nullable();

    // ── Status Enum ──────────────────────────────────────────────────────────
    table
      .enu('status', ['pending', 'in_progress', 'completed', 'archived'], {
        useNative: true,
        enumName: 'task_status',
      })
      .notNullable()
      .defaultTo('pending');

    // ── Priority Enum ────────────────────────────────────────────────────────
    table
      .enu('priority', ['low', 'medium', 'high'], {
        useNative: true,
        enumName: 'task_priority',
      })
      .notNullable()
      .defaultTo('medium');

    // ── Optional Date Fields ──────────────────────────────────────────────────
    table.date('due_date').nullable();

    // ── Soft Delete ───────────────────────────────────────────────────────────
    table.timestamp('deleted_at').nullable();

    // ── Timestamps ────────────────────────────────────────────────────────────
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });

  // ── Explicit Indexes ────────────────────────────────────────────────────────
  await knex.schema.table(TABLE, (table) => {
    table.index(['user_id'],    'idx_tasks_user_id');
    table.index(['status'],     'idx_tasks_status');
    table.index(['deleted_at'], 'idx_tasks_deleted_at');
    table.index(['due_date'],   'idx_tasks_due_date');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
export const down = async (knex) => {
  await knex.schema.dropTableIfExists(TABLE);

  // Drop native enum types created above
  await knex.raw('DROP TYPE IF EXISTS task_status');
  await knex.raw('DROP TYPE IF EXISTS task_priority');
};
