import { z } from 'zod'
import { messages } from './messages'


export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((value) => value === true, {
    params: messages.prerequisites.errors.approveExternalData,
  }),
})

export type ApplicationAnswers = z.TypeOf<typeof dataSchema>
