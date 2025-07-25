import { z } from 'zod'
import { EmploymentStatus } from '../../shared'

export const currentJobSchema = z.object({
  employer: z
    .object({
      nationalId: z.string().optional(),
      name: z.string().optional(),
    })
    .optional(),
  nationalIdWithName: z.string().optional(),
  percentage: z.string().optional(),
  startDate: z.string().optional(),
  workHours: z.string().optional(),
  salary: z.string().optional(),
  estimatedSalary: z.string().optional(),
  predictedEndDate: z.string().optional(),
  title: z.string().optional(),
})

export const currentSituationSchema = z
  .object({
    status: z.string().min(1),
    currentSituationRepeater: z.array(currentJobSchema).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === EmploymentStatus.EMPLOYED) {
      if (
        data.currentSituationRepeater &&
        !data.currentSituationRepeater[0]?.predictedEndDate
      ) {
        ctx.addIssue({
          path: ['currentSituationRepeater', 0, 'predictedEndDate'],
          code: z.ZodIssueCode.custom,
        })
      }
      return
    }
    return true
  })
  .superRefine((data, ctx) => {
    if (data.status !== EmploymentStatus.UNEMPLOYED) {
      data.currentSituationRepeater &&
        data.currentSituationRepeater.forEach((job, index) => {
          //So nationalId is not a valid job choice
          if (!job.nationalIdWithName) {
            ctx.addIssue({
              path: ['currentSituationRepeater', index, 'nationalIdWithName'],
              code: z.ZodIssueCode.custom,
            })
          }
          if (job.nationalIdWithName === '-' && !job.employer?.nationalId) {
            ctx.addIssue({
              path: ['currentSituationRepeater', index, 'employer'],
              code: z.ZodIssueCode.custom,
            })
          }
        })
    }
  })
  .superRefine((data, ctx) => {
    if (data.status === EmploymentStatus.PARTJOB) {
      data.currentSituationRepeater &&
        data.currentSituationRepeater.forEach((job, index) => {
          if (!job.workHours) {
            ctx.addIssue({
              path: ['currentSituationRepeater', index, 'workHours'],
              code: z.ZodIssueCode.custom,
            })
          }
        })
    }
  })
  .superRefine((data, ctx) => {
    if (
      data.status === EmploymentStatus.PARTJOB ||
      data.status === EmploymentStatus.EMPLOYED
    ) {
      data.currentSituationRepeater &&
        data.currentSituationRepeater.forEach((job, index) => {
          if (!job.percentage) {
            ctx.addIssue({
              path: ['currentSituationRepeater', index, 'percentage'],
              code: z.ZodIssueCode.custom,
            })
          }
        })
    }
  })
  .superRefine((data, ctx) => {
    if (data.status === EmploymentStatus.PARTJOB) {
      data.currentSituationRepeater &&
        data.currentSituationRepeater.forEach((job, index) => {
          if (!job.startDate) {
            ctx.addIssue({
              path: ['currentSituationRepeater', index, 'startDate'],
              code: z.ZodIssueCode.custom,
            })
          }
        })
    }
  })
  .superRefine((data, ctx) => {
    if (data.status === EmploymentStatus.PARTJOB) {
      data.currentSituationRepeater &&
        data.currentSituationRepeater.forEach((job, index) => {
          if (!job.salary) {
            ctx.addIssue({
              path: ['currentSituationRepeater', index, 'salary'],
              code: z.ZodIssueCode.custom,
            })
          }
        })
    }
  })
  .superRefine((data, ctx) => {
    if (
      data.status === EmploymentStatus.PARTJOB ||
      data.status === EmploymentStatus.OCCASIONAL ||
      data.status === EmploymentStatus.EMPLOYED
    ) {
      data.currentSituationRepeater &&
        data.currentSituationRepeater.forEach((job, index) => {
          if (!job.title) {
            ctx.addIssue({
              path: ['currentSituationRepeater', index, 'title'],
              code: z.ZodIssueCode.custom,
            })
          }
        })
    }
  })
