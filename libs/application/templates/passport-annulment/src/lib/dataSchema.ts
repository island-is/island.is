import { z } from 'zod'
import { error } from './error'
import { PassportStatus } from './constants'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  passportNumber: z.string().min(1),
  passportName: z.string().min(1),
  productionRequestID: z.string().min(1),
  status: z.enum([PassportStatus.LOST, PassportStatus.STOLEN]),
  comment: z.string().min(1),
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

export type PassportAnnulmentSchema = z.TypeOf<typeof dataSchema>
