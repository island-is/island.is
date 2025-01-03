import { z } from 'zod'
import * as kennitala from 'kennitala'
import {
  RentalAmountIndexTypes,
  RentalAmountPaymentDateOptions,
  RentalHousingCategoryClass,
  RentalHousingCategoryTypes,
  RentOtherFeesPayeeOptions,
  SecurityDepositAmountOptions,
  SecurityDepositTypeOptions,
  TRUE,
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

const checkIfNegative = (inputNumber: string) => {
  if (Number(inputNumber) < 0) {
    return false
  } else {
    return true
  }
}

const fileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const registerProperty = z
  .object({
    address: z.string().optional(),
    propertyId: z.string().optional(),
    unitId: z.string().optional(),
    postalCode: z.string().optional(),
    municipality: z.string().optional(),
    size: z.string().optional(),
    numOfRooms: z.string().optional(),
    categoryType: z
      .enum([
        RentalHousingCategoryTypes.ENTIRE_HOME,
        RentalHousingCategoryTypes.ROOM,
        RentalHousingCategoryTypes.COMMERCIAL,
      ])
      .optional(),
    categoryClass: z
      .enum([
        RentalHousingCategoryClass.GENERAL_MARKET,
        RentalHousingCategoryClass.SPECIAL_GROUPS,
      ])
      .optional(),
    categoryClassGroup: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.categoryClass &&
      data.categoryClass.includes('specialGroups') &&
      !data.categoryClassGroup
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.registerProperty.category.classGroupRequiredError,
        path: ['categoryClassGroup'],
      })
    }
  })

const landlordInfo = z
  .object({
    table: z.array(
      z.object({
        nationalIdWithName: z.object({
          nationalId: z.string().refine((x) => !!x && x.trim().length > 0, {
            params: m.landlordDetails.landlordNationalIdEmptyError,
          }),
          name: z.string(),
        }),
        phone: z
          .string()
          .optional()
          .refine((x) => !!x && x.trim().length > 0, {
            params: m.landlordDetails.landlordPhoneNumberEmptyError,
          }),
        email: z
          .string()
          .optional()
          .refine((x) => !!x && x.trim().length > 0, {
            params: m.landlordDetails.landlordEmailEmptyError,
          }),
        address: z
          .string()
          .optional()
          .refine((x) => !!x && x.trim().length > 0, {
            params: m.landlordDetails.landlordAddressEmptyError,
          }),
        isRepresentative: z.array(z.string()).optional(),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    // TODO: Uncomment this when validation in repeatable table is fixed
    // const filterNonRepresentatives =
    //   data.table &&
    //   data.table.filter(
    //     (landlord) => !landlord.isRepresentative?.includes(IS_REPRESENTATIVE),
    //   )
    if (data.table && data.table.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.landlordDetails.landlordEmptyTableError,
        path: ['table'],
      })
    }
    // TODO: Uncomment this when validation in repeatable table is fixed
    // else if (filterNonRepresentatives?.length === 0) {
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.custom,
    //     message: 'Custom error message',
    //     params: m.landlordDetails.landlordOnlyRepresentativeTableError,
    //     path: ['table'],
    //   })
    // }
  })

const tenantInfo = z
  .object({
    table: z.array(
      z.object({
        nationalIdWithName: z.object({
          nationalId: z.string().refine((x) => !!x && x.trim().length > 0, {
            params: m.tenantDetails.tenantNationalIdEmptyError,
          }),
          name: z.string(),
        }),
        phone: z
          .string()
          .optional()
          .refine((x) => !!x && x.trim().length > 0, {
            params: m.tenantDetails.tenantPhoneNumberEmptyError,
          }),
        email: z
          .string()
          .optional()
          .refine((x) => !!x && x.trim().length > 0, {
            params: m.tenantDetails.tenantEmailEmptyError,
          }),
        address: z
          .string()
          .optional()
          .refine((x) => !!x && x.trim().length > 0, {
            params: m.tenantDetails.tenantAddressEmptyError,
          }),
        isRepresentative: z.array(z.string()).optional(),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    // TODO: Uncomment this when validation in repeatable table is fixed
    // const filterNonRepresentatives =
    //   data.table &&
    //   data.table.filter(
    //     (tenant) => !tenant.isRepresentative?.includes(IS_REPRESENTATIVE),
    //   )
    if (data.table && data.table.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.tenantDetails.tenantEmptyTableError,
        path: ['table'],
      })
    }
    // TODO: Uncomment this when validation in repeatable table is fixed
    // else if (filterNonRepresentatives?.length === 0) {
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.custom,
    //     message: 'Custom error message',
    //     params: m.tenantDetails.tenantOnlyRepresentativeTableError,
    //     path: ['table'],
    //   })
    // }
  })

const rentalPeriod = z
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
    const start = data.startDate ? new Date(data.startDate) : ''
    const end = data.endDate ? new Date(data.endDate) : ''
    const isDefiniteChecked = data.isDefinite && data.isDefinite.includes(TRUE)
    if (isDefiniteChecked) {
      if (!data.endDate || !data.endDate.trim().length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['endDate'],
          params: m.rentalPeriod.errorAgreementEndDateNotFilled,
        })
      } else if (start >= end) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['endDate'],
          params: m.rentalPeriod.errorEndDateBeforeStart,
        })
      }
    }
  })

const rentalAmount = z
  .object({
    amount: z
      .string()
      .refine((x) => Boolean(x), {
        params: m.dataSchema.requiredErrorMsg,
      })
      .refine((x) => checkIfNegative(x), {
        params: m.dataSchema.negativeNumberError,
      }),
    indexTypes: z
      .enum([
        RentalAmountIndexTypes.CONSUMER_PRICE_INDEX,
        RentalAmountIndexTypes.CONSTRUCTION_COST_INDEX,
        RentalAmountIndexTypes.WAGE_INDEX,
      ])
      .optional(),
    indexValue: z.string().optional(),
    isIndexConnected: z.string().array().optional(),
    paymentDateOptions: z
      .enum([
        RentalAmountPaymentDateOptions.FIRST_DAY,
        RentalAmountPaymentDateOptions.LAST_DAY,
        RentalAmountPaymentDateOptions.OTHER,
      ])
      .optional(),
    paymentDateOther: z.string().optional(),
    isPaymentInsuranceRequired: z.string().array().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.paymentDateOptions &&
      data.paymentDateOptions.includes(RentalAmountPaymentDateOptions.OTHER) &&
      !data.paymentDateOther?.trim().length
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.rentalAmount.paymentDateOtherOptionRequiredError,
        path: ['paymentDateOther'],
      })
    }
  })

const specialProvisions = z.object({
  descriptionInput: z.string().optional(),
  rulesInput: z.string().optional(),
})

const condition = z.object({
  inspector: z.string().optional(),
  inspectorName: z.string().optional(),
  resultsDescription: z.string().optional(),
  resultsFiles: z.array(fileSchema),
})

const fireProtections = z.object({
  smokeDetectors: z.string().optional(),
  fireExtinguisher: z.string().optional(),
  exits: z.string().optional(),
  fireBlanket: z.string().optional(),
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
      Number(data.rentalAmount) * 3 < Number(data.securityAmountOther)
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
    electricityCostMeterStatusDate: z.string().optional(),
    heatingCost: z.string().optional(),
    heatingCostMeterNumber: z.string().optional(),
    heatingCostMeterStatus: z.string().optional(),
    heatingCostMeterStatusDate: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.housingFund === RentOtherFeesPayeeOptions.TENANT) {
      if (
        data.housingFundAmount &&
        data.housingFundAmount.toString().length > 7
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.otherFees.errorHousingFundLength,
          path: ['housingFundAmount'],
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
          message: 'Custom error message',
          params: m.otherFees.errorMeterNumberRegex,
          path: ['electricityCostMeterNumber'],
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
    }
    if (data.heatingCost === RentOtherFeesPayeeOptions.TENANT) {
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
  landlordInfo,
  tenantInfo,
  registerProperty,
  specialProvisions,
  rentalPeriod,
  rentalAmount,
  rentOtherFees,
  securityDeposit,
  condition,
  fireProtections,
})

export type RentalAgreement = z.TypeOf<typeof dataSchema>
