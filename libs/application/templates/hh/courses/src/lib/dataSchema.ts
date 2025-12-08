import { z } from 'zod'
import * as kennitala from 'kennitala'
import { isValidPhoneNumber } from '../utils/isValidPhoneNumber'

const nationalIdWithNameSchema = z.object({
  nationalId: z
    .string()
    .refine(
      (nationalId) =>
        nationalId && nationalId.length !== 0 && kennitala.isValid(nationalId),
    ),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z
    .string()
    .min(1)
    .refine((v) => isValidPhoneNumber(v)),
})

export const dataSchema = z.object({
  participantNationalIdAndName: nationalIdWithNameSchema,
  payerNationalId: z
    .string()
    .refine(
      (nationalId) =>
        nationalId && nationalId.length !== 0 && kennitala.isValid(nationalId),
    ),
  payerName: z.string().min(1),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
