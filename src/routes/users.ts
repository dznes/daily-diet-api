import { knex } from '@/database'
import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'

// Todo plugin do fastify precisa ser uma FUNÇÃO ASSÍNCRONA
export async function userRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const users = await knex('users').select('*')

    return { users }
  })

  app.get('/:id', async (request) => {
    const getUserParamsSchema = z.object({
      id: z.string(),
    })
    const { id } = getUserParamsSchema.parse(request.params)
    const user = await knex('users').where('id', id).first()

    return { user }
  })

  app.post('/', async (request) => {
    const createUserBodySchema = z.object({
      email: z.string(),
      name: z.string(),
    })
    const { email, name } = createUserBodySchema.parse(request.body)
    const user = await knex('users')
      .insert({
        id: randomUUID(),
        email,
        name,
      })
      .returning('*')

    return { user }
  })

  // app.delete('/:id', async (request) => {
  //   const findByIdParamsSchema = z.object({
  //     id: z.string(),
  //   })
  //   const { id } = findByIdParamsSchema.parse(request.params)
  //   await knex('users').where('id', id).delete()

  //   return { id }
  // })
}
