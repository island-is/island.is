import * as z from 'zod'

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  studentMentorability: z.object({
    studentMentorability: z.string().refine((v) => v === 'isMentorable'),
    studentName: z.string().min(1),
    studentNationalId: z.string().length(10),
  }),
  requirementsMet: z.boolean().refine((v) => v),
})
