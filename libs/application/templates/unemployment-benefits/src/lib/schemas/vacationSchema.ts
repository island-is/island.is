import { YesOrNoEnum } from '@island.is/application/core'
import { z } from 'zod'

export const vacationSchema = z
  .object({
    doYouHaveVacationDays: z
      .nativeEnum(YesOrNoEnum)
      .refine((v) => Object.values(YesOrNoEnum).includes(v)),
    amount: z.string().optional(),
    vacationDays: z
      .array(
        z.object({
          startDate: z.string().optional(),
          endDate: z.string().optional(),
        }),
      )
      .optional(),
  })
  .refine(
    ({ doYouHaveVacationDays, amount }) => {
      if (doYouHaveVacationDays === YesOrNoEnum.YES) {
        return !!amount
      }
      return true
    },
    {
      path: ['amount'],
    },
  )
  .refine(
    ({ doYouHaveVacationDays, vacationDays }) => {
      if (doYouHaveVacationDays === YesOrNoEnum.YES) {
        return (
          vacationDays &&
          vacationDays.length > 0 &&
          vacationDays.every((day) => day.startDate)
        )
      }
      return true
    },
    {
      path: ['vacationDays', 'startDate'],
    },
  )
  .refine(
    ({ doYouHaveVacationDays, vacationDays }) => {
      if (doYouHaveVacationDays === YesOrNoEnum.YES) {
        return (
          vacationDays &&
          vacationDays.length > 0 &&
          vacationDays.every((day) => day.endDate)
        )
      }
      return true
    },
    {
      path: ['vacationDays', 'endDate'],
    },
  )
