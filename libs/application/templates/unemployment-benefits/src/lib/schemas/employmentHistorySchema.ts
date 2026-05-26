import { EmploymentStatus } from '../../shared/constants'
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
  jobCodeId: z.string().optional(),
  percentage: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

const isJobPartiallyFilled = (job: z.infer<typeof lastJobSchema>) =>
  job.nationalIdWithName ||
  job.employer?.nationalId ||
  job.employer?.name ||
  job.jobCodeId ||
  job.percentage ||
  job.startDate ||
  job.endDate

const validateJob = (
  job: z.infer<typeof lastJobSchema>,
  index: number,
  prefix: string,
  ctx: z.RefinementCtx,
) => {
  if (!job.nationalIdWithName) {
    ctx.addIssue({
      path: [prefix, index, 'nationalIdWithName'],
      code: z.ZodIssueCode.custom,
    })
  }
  if (!job.percentage || Number(job.percentage) < 1) {
    ctx.addIssue({
      path: [prefix, index, 'percentage'],
      code: z.ZodIssueCode.custom,
    })
  }
  if (!job.startDate) {
    ctx.addIssue({
      path: [prefix, index, 'startDate'],
      code: z.ZodIssueCode.custom,
    })
  }
  if (!job.endDate) {
    ctx.addIssue({
      path: [prefix, index, 'endDate'],
      code: z.ZodIssueCode.custom,
    })
  }
  if (job.nationalIdWithName === '-' && !job.employer?.nationalId) {
    ctx.addIssue({
      path: [prefix, index, 'employer'],
      code: z.ZodIssueCode.custom,
    })
  }
}

export const employmentHistorySchema = z
  .object({
    isIndependent: z.nativeEnum(YesOrNoEnum).optional(),
    independentOwnSsn: z.nativeEnum(YesOrNoEnum).optional(),
    lastJobs: z.array(lastJobSchema).optional(),
    currentJobs: z.array(lastJobSchema).optional(),
    hasWorkedEes: z.nativeEnum(YesOrNoEnum).optional(),
    status: z.nativeEnum(EmploymentStatus).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === EmploymentStatus.UNEMPLOYED) {
      if (!data.isIndependent) {
        ctx.addIssue({
          path: ['isIndependent'],
          code: z.ZodIssueCode.custom,
        })
      }
      data.lastJobs?.forEach((job, index) => {
        validateJob(job, index, 'lastJobs', ctx)
      })
      return
    }
    // For non-unemployed: all fields are optional, but guard against
    // half-filled job entries — if a job has any data, validate it fully.
    data.lastJobs?.forEach((job, index) => {
      if (isJobPartiallyFilled(job)) {
        validateJob(job, index, 'lastJobs', ctx)
      }
    })
  })
