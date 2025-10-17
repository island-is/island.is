import { YesOrNoEnum } from '@island.is/application/core'
import { z } from 'zod'

export const lastJobSchema = z.object({
  employer: z
    .object({
      nationalId: z.string().optional(),
      name: z.string().optional(),
    })
    .optional(),
  nationalIdWithName: z.string().optional(),
  hiddenNationalIdWithName: z.string().optional(),
  title: z.string().optional(),
  percentage: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  predictedEndDate: z.string().optional(),
})

export const employmentHistorySchema = z
  .object({
    isIndependent: z
      .nativeEnum(YesOrNoEnum)
      .refine((v) => Object.values(YesOrNoEnum).includes(v)),
    independentOwnSsn: z.nativeEnum(YesOrNoEnum).optional(),
    ownSSNJob: z
      .object({
        title: z.string().optional(),
        percentage: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
      .optional(),
    lastJobs: z.array(lastJobSchema),
    hasWorkedEes: z.nativeEnum(YesOrNoEnum).optional(),
  })
  .superRefine((data, ctx) => {
    data.lastJobs.forEach((job, index) => {
      //So nationalId is not a valid job choice
      if (!job.nationalIdWithName && !job.hiddenNationalIdWithName) {
        ctx.addIssue({
          path: ['lastJobs', index, 'nationalIdWithName'],
          code: z.ZodIssueCode.custom,
        })
      }
      if (job.nationalIdWithName === '-' && !job.employer?.nationalId) {
        ctx.addIssue({
          path: ['lastJobs', index, 'employer'],
          code: z.ZodIssueCode.custom,
        })
      }
    })
  })
