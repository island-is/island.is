import { z } from 'zod'

const dummySchema = z.object({
  dummyTextField: z.string(),
})

export const dataSchema = z.object({
  dummy: dummySchema,
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
