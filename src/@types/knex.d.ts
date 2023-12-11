// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      email: string
      name: string
      created_at: string
    }
    meals: {
      id: string
      session_id: string
      name: string
      description: string
      created_at: string
      updated_at?: string
      in_diet: number
      meal_date: string
    }
  }
}
