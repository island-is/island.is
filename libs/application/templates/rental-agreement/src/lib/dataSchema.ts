import { z } from 'zod'
import * as kennitala from 'kennitala'
import { RentOtherFeesPayeeOptions } from './constants'
import {
  SecurityDepositAmountOptions,
  SecurityDepositTypeOptions,
} from './constants'
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

const checkIfNegative = (inputNumber: string) => {
  if (Number(inputNumber) < 0) {
    return false
  } else {
    return true
  }
}

// debug error messages
const requiredErrorMsg = {
  id: 'ra.application:error.required',
  defaultMessage: 'Reitur má ekki vera tómur',
  description: 'Error message when a required field has not been filled',
}

const negativeNumberError = {
  id: 'ra.application:error.negativeNumber',
  defaultMessage: 'Ekki er leyfilegt að setja inn neikvæðar tölur',
  description: 'Error message when a required field has not been filled',
}

const rentalAmount = z.object({
  amount: z
    .string()
    .refine((x) => Boolean(x), {
      params: requiredErrorMsg,
    })
    .refine((x) => checkIfNegative(x), { params: negativeNumberError }),
})

const securityDeposit = z
  .object({
    securityType: z
      .string()
      .optional()
      .refine((x) => Boolean(x), {
        params: m.securityDeposit.typeError,
      }),
    bankGuaranteeInfo: z.string().optional(),
    thirdPartyGuaranteeInfo: z.string().optional(),
    insuranceCompanyInfo: z.string().optional(),
    mutualFundInfo: z.string().optional(),
    otherInfo: z.string().optional(),
    securityAmount: z.string().optional(),
    securityAmountOther: z.string().optional(),
    rentalAmount: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.securityType === SecurityDepositTypeOptions.BANK_GUARANTEE &&
      !data.bankGuaranteeInfo
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.securityDeposit.bankInfoError,
        path: ['bankGuaranteeInfo'],
      })
    }

    if (
      data.securityType === SecurityDepositTypeOptions.THIRD_PARTY_GUARANTEE &&
      !data.thirdPartyGuaranteeInfo
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.securityDeposit.thirdPartyGuaranteeError,
        path: ['thirdPartyGuaranteeInfo'],
      })
    }

    if (
      data.securityType === SecurityDepositTypeOptions.INSURANCE_COMPANY &&
      !data.insuranceCompanyInfo
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.securityDeposit.insuranceCompanyError,
        path: ['insuranceCompanyInfo'],
      })
    }

    if (
      data.securityType === SecurityDepositTypeOptions.MUTUAL_FUND &&
      !data.mutualFundInfo
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.securityDeposit.mutualFundError,
        path: ['mutualFundInfo'],
      })
    }

    if (
      data.securityType === SecurityDepositTypeOptions.OTHER &&
      !data.otherInfo
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.securityDeposit.otherError,
        path: ['otherInfo'],
      })
    }

    if (
      data.securityType !== SecurityDepositTypeOptions.MUTUAL_FUND &&
      !data.securityAmount
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.securityDeposit.amountError,
        path: ['securityAmount'],
      })
    }

    if (
      (data.securityType === SecurityDepositTypeOptions.MUTUAL_FUND ||
        data.securityAmount === SecurityDepositAmountOptions.OTHER) &&
      !data.securityAmountOther
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.securityDeposit.amountOtherError,
        path: ['securityAmountOther'],
      })
    }

    if (
      data.securityType === SecurityDepositTypeOptions.MUTUAL_FUND &&
      Number(data.rentalAmount) * 0.1 < Number(data.securityAmountOther)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.securityDeposit.amountOtherMutualFundError,
        path: ['securityAmountOther'],
      })
    }

    if (
      (data.securityType === SecurityDepositTypeOptions.CAPITAL ||
        data.securityType ===
          SecurityDepositTypeOptions.THIRD_PARTY_GUARANTEE) &&
      Number(data.rentalAmount) * 3 < Number(data.securityAmount)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.securityDeposit.amountOtherCapitolError,
        path: ['securityAmountOther'],
      })
    }
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
    if (data.housingFund === RentOtherFeesPayeeOptions.TENANT) {
      if (
        data.housingFundAmount &&
        data.housingFundAmount.toString().length > 7
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['housingFundAmount'],
          params: m.dataSchema.errorHousingFundLength,
        })
      }
    }
    if (data.electricityCost === RentOtherFeesPayeeOptions.TENANT) {
      if (
        data.electricityCostMeterNumber &&
        !isValidMeterNumber(data.electricityCostMeterNumber)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['electricityCostMeterNumber'],
          params: m.dataSchema.errorMeterNumberRegex,
        })
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
      }
    }
    if (data.heatingCost === RentOtherFeesPayeeOptions.TENANT) {
      if (
        data.heatingCostMeterNumber &&
        !isValidMeterNumber(data.heatingCostMeterNumber)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['heatingCostMeterNumber'],
          params: m.dataSchema.errorMeterNumberRegex,
        })
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
  rentalAmount,
  securityDeposit,
  condition: z.object({
    resultsFiles: z.array(fileSchema),
  }),
  rentOtherFees,
})
