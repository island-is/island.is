import { YesOrNoEnum } from '@island.is/application/core'
import { z } from 'zod'

export const vacationSchema = z
  .object({
    doYouHaveVacationDays: z
      .nativeEnum(YesOrNoEnum)
      .refine((v) => Object.values(YesOrNoEnum).includes(v)),
    vacationDays: z
      .array(
        z.object({
          amount: z.string().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
        }),
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.doYouHaveVacationDays === YesOrNoEnum.YES) {
      data.vacationDays?.forEach((day, index) => {
        if (!day.amount) {
          ctx.addIssue({
            path: ['vacationDays', index, 'amount'],
            code: z.ZodIssueCode.custom,
          })
        }
      })
      return
    }
    return true
  })
  .superRefine((data, ctx) => {
    if (data.doYouHaveVacationDays === YesOrNoEnum.YES) {
      data.vacationDays?.forEach((day, index) => {
        if (!day.startDate) {
          ctx.addIssue({
            path: ['vacationDays', index, 'startDate'],
            code: z.ZodIssueCode.custom,
          })
        }
      })
      return
    }
    return true
  })
  .superRefine((data, ctx) => {
    if (data.doYouHaveVacationDays === YesOrNoEnum.YES) {
      data.vacationDays?.forEach((day, index) => {
        if (!day.endDate) {
          ctx.addIssue({
            path: ['vacationDays', index, 'endDate'],
            code: z.ZodIssueCode.custom,
          })
        }
      })
      return
    }
    return true
  })
