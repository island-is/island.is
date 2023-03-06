import * as z from 'zod'
import { m } from './messages'

// todo: set message strings for the error messages
export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  studentMentorability: z.object({
    studentIsMentorable: z.string().refine((v) => v === 'isMentorable'),
    studentName: z.string().min(1),
    studentNationalId: z.string().length(10),
  }),
  requirementsMet: z.boolean().refine((v) => v),
})
