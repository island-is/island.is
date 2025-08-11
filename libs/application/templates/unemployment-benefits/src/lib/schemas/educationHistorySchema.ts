import { z } from 'zod'

export const currentStudiesSchema = z
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
  studyNotCompleted: z.array(z.string()).optional(),
})

export const educationHistorySchema = z.object({
  currentStudies: currentStudiesSchema,
  educationHistory: z.array(previousEducationSchema),
})
