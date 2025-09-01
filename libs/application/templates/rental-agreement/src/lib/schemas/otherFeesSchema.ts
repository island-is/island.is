import { z } from 'zod'
import { YesOrNoEnum } from '@island.is/application/core'
import {
  isValidMeterNumber,
  isValidMeterStatus,
  parseCurrency,
} from '../../utils/utils'
import { OtherFeesPayeeOptions } from '../../utils/enums'
import * as m from '../messages'

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
    otherCostItems: z
      .array(
        z.object({
          description: z.string().optional(),
          amount: z.string().optional(),
        }),
      )
      .optional()
      .nullable(),
    otherCostsDescription: z.string().optional(),
    otherCostsAmount: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const {
      housingFund,
      housingFundAmount,
      electricityCost,
      electricityCostMeterNumber,
      electricityCostMeterStatus,
      electricityCostMeterStatusDate,
      heatingCost,
      heatingCostMeterNumber,
      heatingCostMeterStatus,
      heatingCostMeterStatusDate,
      otherCosts,
      otherCostItems,
    } = data

    const tenantPaysHousingFund = housingFund === OtherFeesPayeeOptions.TENANT
    const tenantPaysElectricityCost =
      electricityCost === OtherFeesPayeeOptions.TENANT
    const tenantPaysHeatingCost = heatingCost === OtherFeesPayeeOptions.TENANT
    const hasOtherCosts = otherCosts?.includes(YesOrNoEnum.YES)

    // Housing fund
    if (housingFund && tenantPaysHousingFund) {
      const numericAmount = parseCurrency(housingFundAmount ?? '')
      if (!housingFundAmount) {
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
    if (electricityCost && tenantPaysElectricityCost) {
      if (!electricityCostMeterNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.otherFees.errorMeterNumberEmpty,
          path: ['electricityCostMeterNumber'],
        })
      }
      if (
        electricityCostMeterNumber &&
        !isValidMeterNumber(electricityCostMeterNumber)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.otherFees.errorMeterNumberRegex,
          path: ['electricityCostMeterNumber'],
        })
      }
      if (!electricityCostMeterStatus) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.otherFees.errorMeterStatusEmpty,
          path: ['electricityCostMeterStatus'],
        })
      }
      if (
        electricityCostMeterStatus &&
        !isValidMeterStatus(electricityCostMeterStatus)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.otherFees.errorMeterStatusRegex,
          path: ['electricityCostMeterStatus'],
        })
      }
      if (!electricityCostMeterStatusDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.otherFees.errorMeterStatusDateEmpty,
          path: ['electricityCostMeterStatusDate'],
        })
      }
    }

    // Heating cost
    if (heatingCost && tenantPaysHeatingCost) {
      if (!heatingCostMeterNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.otherFees.errorMeterNumberEmpty,
          path: ['heatingCostMeterNumber'],
        })
      }
      if (
        heatingCostMeterNumber &&
        !isValidMeterNumber(heatingCostMeterNumber)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.otherFees.errorMeterNumberRegex,
          path: ['heatingCostMeterNumber'],
        })
      }
      if (!heatingCostMeterStatus) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.otherFees.errorMeterStatusEmpty,
          path: ['heatingCostMeterStatus'],
        })
      }
      if (
        heatingCostMeterStatus &&
        !isValidMeterStatus(heatingCostMeterStatus)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.otherFees.errorMeterStatusRegex,
          path: ['heatingCostMeterStatus'],
        })
      }
      if (!heatingCostMeterStatusDate) {
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
      if (!otherCostItems || otherCostItems.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.otherFees.errorOtherCost,
          path: ['otherCostItems'],
        })
      } else {
        // Validate each item in the otherCostItems array
        otherCostItems.forEach((item, index) => {
          if (!item.description || item.description.trim() === '') {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Custom error message',
              params: m.otherFees.errorOtherCostDescription,
              path: ['otherCostItems', index, 'description'],
            })
          }
          if (
            item.amount === undefined ||
            item.amount === null ||
            Number(item.amount) <= 0
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Custom error message',
              params: m.otherFees.errorOtherCostAmount,
              path: ['otherCostItems', index, 'amount'],
            })
          }
          if (
            item.amount !== undefined &&
            item.amount !== null &&
            Number(item.amount) > 100000
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Custom error message',
              params: m.otherFees.errorOtherCostAmountTooHigh,
              path: ['otherCostItems', index, 'amount'],
            })
          }
        })
      }
    }
  })
