import { z } from 'zod'
import * as kennitala from 'kennitala'
import { isValidEmail } from '../utils'
import { isValidPhoneNumber } from '../utils/validation'

const informationSchema = z.object({
  name: z.string().min(1).max(256),
  nationalId: z
    .string()
    .refine(
      (nationalId) =>
        nationalId && nationalId.length !== 0 && kennitala.isValid(nationalId),
    ),
})

const examineeSchema = z.array(
  z.object({
    nationalId: z.object({
      nationalId: z.string().refine((nationalId) => {
        return (
          nationalId && nationalId.length !== 0 && kennitala.isValid(nationalId)
        )
      }),
      name: z.string().min(1).max(256),
    }),
    email: z.string().refine((email) => isValidEmail(email)),
    phone: z.string().refine((phone) => isValidPhoneNumber(phone)),
    licenseNumber: z.string().optional(), // TODO(balli) Need validation rules from VER
    countryIssuer: z.string().min(1).max(256),
  }),
)

export const PracticalExamAnswersSchema = z.object({
  information: informationSchema,
  examinees: examineeSchema,
})

export type PracticalExamAnswers = z.TypeOf<typeof PracticalExamAnswersSchema>
