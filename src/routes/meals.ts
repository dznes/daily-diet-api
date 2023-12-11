import { knex } from '@/database'
import { checkSessionIdExists } from '@/middlewares/check-session-id-exists'
import { longestInDietStreak } from '@/utils/streak-counter'
import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'

export async function mealRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    console.log(`[${request.method}] ${request.url}`)
  })

  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      in_diet: z.number(),
      meal_date: z.string(),
    })

    const { name, description, in_diet, meal_date } =
      createUserBodySchema.parse(request.body)

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    const meal = await knex('meals')
      .insert({
        id: randomUUID(),
        name,
        description,
        session_id: sessionId,
        in_diet,
        meal_date,
      })
      .returning('*')

    return { meal }
  })

  app.get('/all', async () => {
    const meals = await knex('meals').select('*')

    return { meals }
  })

  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies
      const meals = await knex('meals')
        .orderBy('meal_date')
        .where('session_id', sessionId)
        .select('*')
      const counterAll = await knex('meals')
        .where('session_id', sessionId)
        .count('id', { as: 'counter' })
        .first()
      const counterDiet = await knex('meals')
        .where({
          session_id: sessionId,
          in_diet: 1,
        })
        .count('id', { as: 'counter' })
        .first()
      const counterCheat = await knex('meals')
        .where('session_id', sessionId)
        .where('in_diet', 0)
        .count('id', { as: 'counter' })
        .first()

      const longestStreak = longestInDietStreak(meals)
      const summary = {
        all_meals: counterAll?.counter,
        diet_meals: counterDiet?.counter,
        cheat_meals: counterCheat?.counter,
        longest_diet_streak: longestStreak,
      }

      return { summary, meals }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies
      const getUserParamsSchema = z.object({
        id: z.string(),
      })
      const { id } = getUserParamsSchema.parse(request.params)
      const meal = await knex('meals')
        .where({
          session_id: sessionId,
          id,
        })
        .first()

      return { meal }
    },
  )

  app.delete(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies
      const deleteMealParamsSchema = z.object({
        id: z.string(),
      })
      const { id } = deleteMealParamsSchema.parse(request.params)
      const meal = await knex('meals')
        .where({
          session_id: sessionId,
          id,
        })
        .delete()

      if (meal === 1) {
        return reply.status(200)
      }

      return reply.status(400).send({
        error: 'User not authorized.',
      })
    },
  )

  app.put(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies
      const updateMealParamsSchema = z.object({
        id: z.string(),
      })
      const updateMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        in_diet: z.number(),
        meal_date: z.string(),
      })
      const { id } = updateMealParamsSchema.parse(request.params)
      const { name, description, in_diet } = updateMealBodySchema.parse(
        request.body,
      )
      const meal = await knex('meals')
        .where({
          session_id: sessionId,
          id,
        })
        .update({
          name,
          description,
          in_diet,
          updated_at: knex.fn.now(),
        })

      if (meal === 0) {
        return reply.status(400).send({
          error: 'User not authorized.',
        })
      }
      return { name, description, in_diet }
    },
  )
}
