interface Meal {
  id: string
  session_id: string
  name: string
  description: string
  created_at: string
  updated_at?: string
  in_diet: number
  meal_date: string
}

export function longestInDietStreak(meals: Meal[]): number {
  let currentStreak = 0
  let longestStreak = 0

  for (const meal of meals) {
    if (meal.in_diet === 1) {
      // Increment current streak
      currentStreak++
      // Update longest streak if current streak is longer
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak
      }
    } else {
      // Reset current streak if in_diet is not 1
      currentStreak = 0
    }
  }

  return longestStreak
}
