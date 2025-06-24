import { z } from 'zod'

export const educationHistorySchema = z
  .object({
    currentStudies: z
      .object({
        schoolName: z.string(),
        units: z.string(),
        degree: z.string(),
        expectedEndOfStudy: z.string(),
      })
      .optional(),
    educationHistory: z.array(
      z.object({
        levelOfStudy: z.string(),
        degree: z.string(),
        courseOfStudy: z.string(),
        studyNotCompleted: z.array(z.string()).optional(),
      }),
    ),
  })
  .optional()
