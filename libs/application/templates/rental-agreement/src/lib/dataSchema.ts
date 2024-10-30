import { z } from 'zod'
import * as kennitala from 'kennitala'
import { rentOtherFeesPayeeOptions } from './constants'
import * as m from './messages'

const isValidMeterNumber = (value: string) => {
  const meterNumberRegex = /^[0-9]{1,20}$/
  return meterNumberRegex.test(value)
}

const isValidMeterStatus = (value: string) => {
  const meterStatusRegex = /^[0-9]{1,10}(,[0-9])?$/
  return meterStatusRegex.test(value)
}

const fileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const rentOtherFees = z
  .object({
    housingFund: z.string().optional(),
    housingFundAmount: z.string().optional(),
    electricityCost: z.string().optional(),
    electricityCostMeterNumber: z.string().optional(),
    electricityCostMeterStatus: z.string().optional(),
    heatingCost: z.string().optional(),
    heatingCostMeterNumber: z.string().optional(),
    heatingCostMeterStatus: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.housingFund === rentOtherFeesPayeeOptions.TENANT) {
      if (
        data.housingFundAmount &&
        data.housingFundAmount.toString().length > 7
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['housingFundAmount'],
          params: m.dataSchema.errorHousingFundLength,
        })
        return false
      }
    }
    if (data.electricityCost === rentOtherFeesPayeeOptions.TENANT) {
      if (
        data.electricityCostMeterNumber &&
        !isValidMeterNumber(data.electricityCostMeterNumber)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['electricityCostMeterNumber'],
          params: m.dataSchema.errorMeterNumberRegex,
        })
        return false
      }
      if (
        data.electricityCostMeterStatus &&
        !isValidMeterStatus(data.electricityCostMeterStatus)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['electricityCostMeterStatus'],
          params: m.dataSchema.errorMeterStatusRegex,
        })
        return false
      }
    }
    if (data.heatingCost === rentOtherFeesPayeeOptions.TENANT) {
      if (
        data.heatingCostMeterNumber &&
        !isValidMeterNumber(data.heatingCostMeterNumber)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['heatingCostMeterNumber'],
          params: m.dataSchema.errorMeterNumberRegex,
        })
        return false
      }
      if (
        data.heatingCostMeterStatus &&
        !isValidMeterStatus(data.heatingCostMeterStatus)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['heatingCostMeterStatus'],
          params: m.dataSchema.errorMeterStatusRegex,
        })
        return false
      }
    }
    return true
  })

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: z.object({
    nationalId: z
      .string()
      .refine((val) => (val ? kennitala.isValid(val) : false), {
        params: m.dataSchema.nationalId,
      }),
  }),
  rentalHousingConditionFiles: z.array(fileSchema),
  rentOtherFees,
})
