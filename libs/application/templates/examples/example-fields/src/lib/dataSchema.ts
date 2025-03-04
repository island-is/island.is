import { z } from 'zod'

const validationSchema = z.object({
  validationTextField: z.string(),
})

export const dataSchema = z.object({
  validation: validationSchema,
})

export type ExampleFieldsAnswers = z.TypeOf<typeof dataSchema>
