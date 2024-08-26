import { z } from 'zod'

const aboutAccidentSchema = z.object({
  about: z.object({
    amountInjured: z.number().min(1).max(30),
  }),
})

export const WorkAccidentNotificationAnswersSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  aboutAccidentSchema: aboutAccidentSchema,
})

export type WorkAccidentNotification = z.TypeOf<
  typeof WorkAccidentNotificationAnswersSchema
>
