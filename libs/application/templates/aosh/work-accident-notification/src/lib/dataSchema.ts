import { z } from 'zod'
import * as kennitala from 'kennitala'

const companySchema = z.object({
  nationalId: z
    .string()
    .refine(
      (nationalId) =>
        nationalId && nationalId.length !== 0 && kennitala.isValid(nationalId),
    ),
})

const projectPurchaseSchema = z.object({
  nationalId: z
    .string()
    .optional()
    .refine(
      (nationalId) =>
        !nationalId || (nationalId.length > 0 && kennitala.isValid(nationalId)),
      {
        message: 'Invalid nationalId',
      },
    ),
})

export const WorkAccidentNotificationAnswersSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v), // TODO ?
  companyInformation: companySchema,
  projectPurchase: projectPurchaseSchema,
})

export type WorkAccidentNotification = z.TypeOf<
  typeof WorkAccidentNotificationAnswersSchema
>
