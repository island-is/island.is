import { z } from 'zod'
import { error } from './error'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  passportNumber: z.string(),
  passportName: z.string(),
  info: z.object({
    name: z.string(),
    passportNumber: z.string(),
  }),
  status: z.string(),
  comment: z.string(),
  passport: z
    .object({
      userPassport: z.string(),
      childPassport: z.string(),
    })
    .partial()
    .refine(
      ({ userPassport, childPassport }) => userPassport || childPassport,
      {
        message: error.invalidValue.defaultMessage,
        path: ['userPassport'],
      },
    ),
})

export type PassportSchema = z.TypeOf<typeof dataSchema>
