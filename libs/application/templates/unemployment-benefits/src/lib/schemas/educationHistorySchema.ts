import { z } from 'zod'

export const educationHistorySchema = z
  .object({
    currentStudies: z
      .object({
        programName: z.string(),
        programUnits: z.string(),
        programDegree: z.string(),
        programEnd: z.string(),
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
