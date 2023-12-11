import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary()
    table.text('email').unique()
    table.text('name').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable() // utilizamos uma função do knex para não termos códigos específicos para o banco de dados SQLite ou qualquer outro que utilizarmos.
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}
