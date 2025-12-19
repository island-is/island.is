import { z } from 'zod'

const dummySchema = z.object({
  dummyTextField: z.string(),
})

export const dataSchema = z.object({
  dummy: dummySchema,
})

export type MileCar = z.TypeOf<typeof dataSchema>
