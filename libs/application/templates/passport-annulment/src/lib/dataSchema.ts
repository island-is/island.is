import { z } from 'zod'
import { error } from './error'
import { PassportStatus } from './constants'
import { YES } from '@island.is/application/core'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  passportNumber: z.string().min(1),
  passportName: z.string().min(1),
  productionRequestID: z.string().min(1),
  confirmAnnulment: z.array(z.enum([YES])).length(1),
  passportStatus: z.enum([PassportStatus.LOST, PassportStatus.STOLEN]),
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
