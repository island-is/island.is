import { z } from 'zod'
import { YesOrNoEnum } from '@island.is/application/core'
import * as m from '../messages'

export const rentalPeriodSchema = z
  .object({
    startDate: z
      .string()
      .optional()
      .refine((x) => !!x && x.trim().length > 0, {
        params: m.rentalPeriod.errorAgreementStartDateNotFilled,
      }),
    endDate: z.string().optional(),
    isDefinite: z.string().array().optional(),
  })
  .superRefine((data, ctx) => {
    const { startDate, endDate, isDefinite } = data
    const start = startDate ? new Date(startDate) : ''
    const end = endDate ? new Date(endDate) : ''
    const isDefiniteChecked = isDefinite?.includes(YesOrNoEnum.YES)

    if (start) {
      const oneYearFromNow = new Date()
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)

      if (
        start instanceof Date &&
        !isNaN(start.getTime()) &&
        start.getTime() > oneYearFromNow.getTime()
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['startDate'],
          params: m.rentalPeriod.errorStartDateTooFarInFuture,
        })
      }
    }

    if (!isDefiniteChecked) {
      return
    }

    if (!endDate || !endDate.trim().length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        params: m.rentalPeriod.errorAgreementEndDateNotFilled,
      })
      return
    }

    if (
      start &&
      end &&
      isFinite(start.getTime()) &&
      isFinite(end.getTime()) &&
      start.getTime() >= end.getTime()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        params: m.rentalPeriod.errorEndDateBeforeStart,
      })
    }
  })
