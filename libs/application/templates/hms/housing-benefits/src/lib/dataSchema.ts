import { YES } from '@island.is/application/core'
import { z } from 'zod'

const confirmReadSchema = z.object({
  privacyPolicy: z.array(z.literal(YES)).length(1),
  housingBenefitsInfo: z.array(z.literal(YES)).length(1),
})

export const dataSchema = z.object({
  confirmRead: confirmReadSchema,
  confirmMunicipality: z.array(z.literal(YES)).length(1),
  approveExternalData: z.boolean().refine((v) => v),
  rentalAgreement: z.object({
    answer: z.string().min(1),
  }),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
