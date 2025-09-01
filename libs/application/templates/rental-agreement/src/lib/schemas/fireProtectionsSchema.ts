import { z } from 'zod'
import { getRentalPropertySize } from '../../utils/utils'
import { PropertyUnit } from '../../shared/types'
import * as m from '../../lib/messages'

export const fireProtections = z
  .object({
    smokeDetectors: z.string().min(1),
    fireExtinguisher: z.string().refine((val) => Number(val) >= 1, {
      params: m.housingFireProtections.fireExtinguisherNullError,
    }),
    emergencyExits: z.string().optional(),
    fireBlanket: z.string().optional(),
    propertySize: z
      .array(
        z.object({
          size: z.number().optional(),
          changedSize: z.number().optional(),
        }),
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    const { smokeDetectors } = data

    // Check if smokeDetectors is empty or not provided
    if (!smokeDetectors || smokeDetectors.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.housingFireProtections.smokeDetectorNullError,
        path: ['smokeDetectors'],
      })
      return // Exit early if no value provided
    }

    const propertySize = getRentalPropertySize(
      (data.propertySize as PropertyUnit[]) || [],
    )
    const numberOfSmokeDetectors = Number(smokeDetectors)
    const requiredSmokeDetectors = Math.ceil(Number(propertySize) / 80)
    if (numberOfSmokeDetectors < requiredSmokeDetectors) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.housingFireProtections.smokeDetectorMinRequiredError,
        path: ['smokeDetectors'],
      })
    }
  })
