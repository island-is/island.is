import { YES } from '@island.is/application/core'
import { z } from 'zod'
import { FileSchema } from './fileSchema'

export const requiredStudies = z
  .object({
    sameAsAboveEducation: z.preprocess((val) => {
      if (!val) {
        return []
      }
      return val
    }, z.array(z.enum([YES])).optional()),
    levelOfStudy: z
      .preprocess((val) => {
        if (!val) {
          return ''
        }
        return val
      }, z.string())
      .optional(),
    courseOfStudy: z.string().optional(),
    degree: z.string().optional(),
    units: z.string().min(1),
    endDate: z.string().nullish(),
    degreeFile: z.array(FileSchema).nullish(),
  })
  .optional()

export const previousEducationSchema = z.object({
  levelOfStudy: z.string(),
  degree: z.string(),
  courseOfStudy: z.string().optional(),
  endDate: z.string().nullish(),
  unfinishedStudy: z.array(z.enum([YES])).optional(),
})

export const educationHistorySchema = z.object({
  currentStudies: requiredStudies,
  lastSemester: requiredStudies,
  finishedEducation: requiredStudies.refine((x) => x?.endDate),
  educationHistory: z.array(previousEducationSchema),
})
