import { z } from 'zod'
import * as m from '../messages'

export const specialProvisionsSchema = z
  .object({
    descriptionInput: z.string().optional(),
    rulesInput: z.string().optional(),
    // Watched field
    propertySearchUnits: z
      .array(
        z.object({
          size: z.number().optional(),
          changedSize: z.number().optional(),
        }),
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    const { propertySearchUnits, descriptionInput } = data

    const anyUnitSizeChanged = propertySearchUnits?.some((unit) => {
      return (unit.changedSize && unit.changedSize !== unit.size) || false
    })
    if (anyUnitSizeChanged && !descriptionInput) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.specialProvisions.housingInfo.inputRequiredErrorMessage,
        path: ['descriptionInput'],
      })
    }
  })
