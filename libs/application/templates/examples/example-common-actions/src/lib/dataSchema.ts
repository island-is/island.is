import { z } from 'zod'
import { RadioValidationExampleEnum } from '../utils/types'
import { m } from './messages'

const validationSchema = z.object({
  validationTextField: z.string().refine((val) => val.length >= 3, {
    params: m.customValidationMessage,
  }),
  validationRadioField: z.nativeEnum(RadioValidationExampleEnum),
  validationSelectField: z
    .preprocess((val) => {
      if (!val) {
        return ''
      }
      return val
    }, z.string())
    .optional(),
})

export const exampleSchema = z.object({
  validation: validationSchema,
})

export type ExampleAnswers = z.TypeOf<typeof exampleSchema>
