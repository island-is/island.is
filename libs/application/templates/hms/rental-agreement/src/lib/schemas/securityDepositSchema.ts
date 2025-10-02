import { z } from 'zod'
import {
  SecurityDepositAmountOptions,
  SecurityDepositTypeOptions,
} from '../../utils/enums'
import * as m from '../messages'

export const securityDepositSchema = z
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
    securityAmountCalculated: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const {
      securityType,
      securityAmount,
      securityAmountOther,
      rentalAmount,
      bankGuaranteeInfo,
      thirdPartyGuaranteeInfo,
      insuranceCompanyInfo,
      mutualFundInfo,
      otherInfo,
    } = data

    if (
      securityType === SecurityDepositTypeOptions.BANK_GUARANTEE &&
      !bankGuaranteeInfo
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.securityDeposit.bankInfoError,
        path: ['bankGuaranteeInfo'],
      })
    }

    if (
      securityType === SecurityDepositTypeOptions.THIRD_PARTY_GUARANTEE &&
      !thirdPartyGuaranteeInfo
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.securityDeposit.thirdPartyGuaranteeError,
        path: ['thirdPartyGuaranteeInfo'],
      })
    }

    if (
      securityType === SecurityDepositTypeOptions.INSURANCE_COMPANY &&
      !insuranceCompanyInfo
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.securityDeposit.insuranceCompanyError,
        path: ['insuranceCompanyInfo'],
      })
    }

    if (
      securityType === SecurityDepositTypeOptions.LANDLORDS_MUTUAL_FUND &&
      !mutualFundInfo
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.securityDeposit.mutualFundError,
        path: ['mutualFundInfo'],
      })
    }

    if (securityType === SecurityDepositTypeOptions.OTHER && !otherInfo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.securityDeposit.otherError,
        path: ['otherInfo'],
      })
    }

    if (
      securityType !== SecurityDepositTypeOptions.LANDLORDS_MUTUAL_FUND &&
      !securityAmount
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.securityDeposit.amountError,
        path: ['securityAmount'],
      })
    }

    if (
      (securityType === SecurityDepositTypeOptions.LANDLORDS_MUTUAL_FUND ||
        securityAmount === SecurityDepositAmountOptions.OTHER) &&
      !securityAmountOther
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.securityDeposit.amountOtherError,
        path: ['securityAmountOther'],
      })
    }

    if (
      (securityType === SecurityDepositTypeOptions.LANDLORDS_MUTUAL_FUND ||
        securityAmount === SecurityDepositAmountOptions.OTHER) &&
      securityAmountOther &&
      Number(securityAmountOther) <= 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.securityDeposit.amountOtherZeroError,
        path: ['securityAmountOther'],
      })
    }

    if (
      securityType === SecurityDepositTypeOptions.LANDLORDS_MUTUAL_FUND &&
      Number(rentalAmount) * 0.1 < Number(securityAmountOther)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.securityDeposit.amountOtherCapitalError,
        path: ['securityAmountOther'],
      })
    }

    if (
      (securityType === SecurityDepositTypeOptions.CAPITAL ||
        securityType === SecurityDepositTypeOptions.THIRD_PARTY_GUARANTEE ||
        securityType === SecurityDepositTypeOptions.BANK_GUARANTEE ||
        securityType === SecurityDepositTypeOptions.INSURANCE_COMPANY ||
        securityType === SecurityDepositTypeOptions.OTHER) &&
      Number(rentalAmount) * 3 < Number(securityAmountOther)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.securityDeposit.amountOtherCapitalError,
        path: ['securityAmountOther'],
      })
    }
  })
