import { z } from 'zod'

const currentStudiesSchema = z
  .object({
    levelOfStudy: z.string().optional(),
    courseOfStudy: z.string().optional(),
    degree: z.string().optional(),
    endDate: z.string().optional(),
    units: z.string().optional(),
  })
  .optional()

export const previousEducationSchema = z.object({
  levelOfStudy: z.string(),
  degree: z.string(),
  courseOfStudy: z.string().optional(),
  endOfStudy: z.string().optional(),
})

export const educationHistorySchema = z.object({
  currentStudies: currentStudiesSchema,
  educationHistory: z.array(previousEducationSchema),
})
