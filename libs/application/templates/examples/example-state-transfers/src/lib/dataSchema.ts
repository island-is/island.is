import { z } from 'zod'

const validationSchema = z.object({
  validationTextField: z.string(),
})

export const exampleSchema = z.object({
  validation: validationSchema,
})

export type ExampleAnswers = z.TypeOf<typeof exampleSchema>
