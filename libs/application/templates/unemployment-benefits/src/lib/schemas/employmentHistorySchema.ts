import { YesOrNoEnum } from '@island.is/application/core'
import { z } from 'zod'

export const employmentHistorySchema = z
  .object({
    isIndependent: z
      .nativeEnum(YesOrNoEnum)
      .refine((v) => Object.values(YesOrNoEnum).includes(v)),
    lastJob: z.object({
      title: z.string().optional(),
      percentage: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      employer: z.object({
        nationalId: z.string().optional(),
        name: z.string().optional(),
      }),
    }),
    ownSSNJob: z
      .object({
        title: z.string().optional(),
        percentage: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
      .optional(),
    previousJobs: z.array(
      z.object({
        employer: z.object({
          nationalId: z.string().optional(),
          name: z.string().optional(),
        }),
        nationalIdWithName: z.string().optional(),
        title: z.string().optional(),
        percentage: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }),
    ),
    hasWorkedEes: z.nativeEnum(YesOrNoEnum).optional(),
  })
  .refine(
    ({ hasWorkedEes, lastJob, previousJobs }) => {
      const lastJobPercentage = parseFloat(lastJob.percentage || '')
      const previousJobsPercentage = previousJobs.reduce((acc, job) => {
        return acc + (job.percentage ? parseFloat(job.percentage) : 0)
      }, 0)

      return (
        (hasWorkedEes && Object.values(YesOrNoEnum).includes(hasWorkedEes)) ||
        lastJobPercentage + previousJobsPercentage >= 100
      )
    },
    {
      path: ['hasWorkedEes'],
    },
  )
