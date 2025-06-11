import { z } from 'zod'
import { YesOrNoEnum } from '@island.is/application/core'
import { CostField } from '../../shared'
import {
  hasInvalidCostItems,
  isValidMeterNumber,
  isValidMeterStatus,
  parseCurrency,
} from '../../utils/utils'
import { OtherFeesPayeeOptions } from '../../utils/enums'
import * as m from '../messages'

const otherCostItemsSchema = z.object({
  description: z.string().optional(),
  amount: z.number().optional(),
  hasError: z.boolean().optional(),
})

export const otherFees = z
  .object({
    housingFund: z.string().optional(),
    housingFundAmount: z.string().optional(),
    electricityCost: z.string().optional(),
    electricityCostMeterNumber: z.string().optional(),
    electricityCostMeterStatus: z.string().optional(),
    electricityCostMeterStatusDate: z.string().optional(),
    heatingCost: z.string().optional(),
    heatingCostMeterNumber: z.string().optional(),
    heatingCostMeterStatus: z.string().optional(),
    heatingCostMeterStatusDate: z.string().optional(),
    otherCosts: z.array(z.string()).optional(),
    otherCostItems: z.union([
      z.string(),
      z.array(otherCostItemsSchema).optional(),
    ]), // String so that it clears on OtherCosts change (clearOnChange)
    otherCostsDescription: z.string().optional(),
    otherCostsAmount: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const tenantPaysHousingFund =
      data.housingFund === OtherFeesPayeeOptions.TENANT
    const tenantPaysElectricityCost =
      data.electricityCost === OtherFeesPayeeOptions.TENANT
    const tenantPaysHeatingCost =
      data.heatingCost === OtherFeesPayeeOptions.TENANT
    const hasOtherCosts = data.otherCosts?.includes(YesOrNoEnum.YES)

    // Housing fund
    if (data.housingFund && tenantPaysHousingFund) {
      const numericAmount = parseCurrency(data.housingFundAmount ?? '')
      if (!data.housingFundAmount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.otherFees.errorHousingFundEmpty,
          path: ['housingFundAmount'],
        })
      }

      if (numericAmount !== undefined && numericAmount < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.otherFees.errorHousingFundTooLow,
          path: ['housingFundAmount'],
        })
      }
      if (numericAmount !== undefined && numericAmount > 999999) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.otherFees.errorHousingFundTooHigh,
          path: ['housingFundAmount'],
        })
      }
    }

    // Electricity cost
    if (data.electricityCost && tenantPaysElectricityCost) {
      if (!data.electricityCostMeterNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.otherFees.errorMeterNumberEmpty,
          path: ['electricityCostMeterNumber'],
        })
      }
      if (
        data.electricityCostMeterNumber &&
        !isValidMeterNumber(data.electricityCostMeterNumber)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.otherFees.errorMeterNumberRegex,
          path: ['electricityCostMeterNumber'],
        })
      }
      if (!data.electricityCostMeterStatus) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.otherFees.errorMeterStatusEmpty,
          path: ['electricityCostMeterStatus'],
        })
      }
      if (
        data.electricityCostMeterStatus &&
        !isValidMeterStatus(data.electricityCostMeterStatus)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.otherFees.errorMeterStatusRegex,
          path: ['electricityCostMeterStatus'],
        })
      }
      if (!data.electricityCostMeterStatusDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.otherFees.errorMeterStatusDateEmpty,
          path: ['electricityCostMeterStatusDate'],
        })
      }
    }

    // Heating cost
    if (data.heatingCost && tenantPaysHeatingCost) {
      if (!data.heatingCostMeterNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.otherFees.errorMeterNumberEmpty,
          path: ['heatingCostMeterNumber'],
        })
      }
      if (
        data.heatingCostMeterNumber &&
        !isValidMeterNumber(data.heatingCostMeterNumber)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.otherFees.errorMeterNumberRegex,
          path: ['heatingCostMeterNumber'],
        })
      }
      if (!data.heatingCostMeterStatus) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.otherFees.errorMeterStatusEmpty,
          path: ['heatingCostMeterStatus'],
        })
      }
      if (
        data.heatingCostMeterStatus &&
        !isValidMeterStatus(data.heatingCostMeterStatus)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.otherFees.errorMeterStatusRegex,
          path: ['heatingCostMeterStatus'],
        })
      }
      if (!data.heatingCostMeterStatusDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.otherFees.errorMeterStatusDateEmpty,
          path: ['heatingCostMeterStatusDate'],
        })
      }
    }

    // Other costs
    if (hasOtherCosts) {
      if (
        data.otherCostItems &&
        hasInvalidCostItems(data.otherCostItems as CostField[])
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.otherFees.errorOtherCost,
          path: ['otherCostItems'],
        })
      }
    }
  })
