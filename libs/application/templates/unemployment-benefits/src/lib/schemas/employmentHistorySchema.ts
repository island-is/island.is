import { YesOrNoEnum } from '@island.is/application/core'
import { z } from 'zod'

export const employmentHistorySchema = z.object({
  isIndependent: z
    .nativeEnum(YesOrNoEnum)
    .refine((v) => Object.values(YesOrNoEnum).includes(v)),
  lastJob: z.object({
    title: z.string().optional(),
    percentage: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
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
      company: z.object({
        nationalId: z.string().optional(),
        name: z.string().optional(),
      }),
      title: z.string().optional(),
      percentage: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }),
  ),
  hasWorkedEes: z
    .nativeEnum(YesOrNoEnum)
    .refine((v) => Object.values(YesOrNoEnum).includes(v)),
})
