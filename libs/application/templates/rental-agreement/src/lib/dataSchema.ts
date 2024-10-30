import { z } from 'zod'
import * as kennitala from 'kennitala'
import * as m from './messages'

const FileSchema = z.object({
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

const rentalInsurance = z
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
    if (data.securityType === 'bankGuarantee' && !data.bankGuaranteeInfo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.securityDeposit.bankInfoError,
        path: ['bankGuaranteeInfo'],
      })
    }

    if (
      data.securityType === 'thirdPartyGuarantee' &&
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
      data.securityType === 'insuranceCompany' &&
      !data.insuranceCompanyInfo
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.securityDeposit.insuranceCompanyError,
        path: ['insuranceCompanyInfo'],
      })
    }

    if (data.securityType === 'mutualFund' && !data.mutualFundInfo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.securityDeposit.mutualFundError,
        path: ['mutualFundInfo'],
      })
    }

    if (data.securityType === 'other' && !data.otherInfo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.securityDeposit.otherError,
        path: ['otherInfo'],
      })
    }

    if (data.securityType !== 'mutualFund' && !data.securityAmount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.securityDeposit.amountError,
        path: ['securityAmount'],
      })
    }

    if (
      (data.securityType === 'mutualFund' || data.securityAmount === 'other') &&
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
      data.securityType === 'mutualFund' &&
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
      (data.securityType === 'capital' ||
        data.securityType === 'thirdPartyGuarantee') &&
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

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: z.object({
    nationalId: z
      .string()
      .refine((val) => (val ? kennitala.isValid(val) : false), {
        params: m.dataSchema.nationalId,
      }),
  }),
  asdf: z.array(FileSchema),
  rentalAmount,
  rentalInsurance,
})
