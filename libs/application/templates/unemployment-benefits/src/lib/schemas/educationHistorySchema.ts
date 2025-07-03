import { z } from 'zod'

export const educationHistorySchema = z
  .object({
    currentStudies: z
      .object({
        programName: z.string().optional(),
        programUnits: z.string().optional(),
        programDegree: z.string().optional(),
        programEnd: z.string().optional(),
      })
      .optional(),
    educationHistory: z.array(
      z.object({
        levelOfStudy: z.string(),
        degree: z.string(),
        courseOfStudy: z.string().optional(),
        studyNotCompleted: z.array(z.string()).optional(),
      }),
    ),
  })
  .optional()
