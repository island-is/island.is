import { z } from 'zod'
import * as kennitala from 'kennitala'
import { CostField } from '../utils/types'
import {
  maxChangedUnitSize,
  minChangedUnitSize,
  OtherFeesPayeeOptions,
  RentalAmountIndexTypes,
  RentalAmountPaymentDateOptions,
  RentalHousingCategoryClass,
  RentalHousingCategoryClassGroup,
  RentalHousingCategoryTypes,
  RentalHousingConditionInspector,
  RentalPaymentMethodOptions,
  SecurityDepositAmountOptions,
  SecurityDepositTypeOptions,
  TRUE,
} from '../utils/constants'
import * as m from './messages'

const isValidMeterNumber = (value: string) => {
  const meterNumberRegex = /^[0-9]{1,20}$/
  return meterNumberRegex.test(value)
}

const isValidMeterStatus = (value: string) => {
  const meterStatusRegex = /^[0-9]{1,10}(,[0-9])?$/
  return meterStatusRegex.test(value)
}

const hasInvalidCostItems = (items: CostField[]) =>
  items.some((i) => i.hasError)

const checkIfNegative = (inputNumber: string) => {
  if (Number(inputNumber) < 0) {
    return false
  } else {
    return true
  }
}

const approveExternalData = z.boolean().refine((v) => v)

const applicant = z.object({
  nationalId: z
    .string()
    .refine((val) => (val ? kennitala.isValid(val) : false), {
      params: m.dataSchema.nationalId,
    }),
})

const fileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const landlordInfo = z
  .object({
    table: z.array(
      z.object({
        nationalIdWithName: z.object({
          nationalId: z
            .string()
            .optional()
            .refine((x) => !!x && x.trim().length > 0, {
              params: m.landlordDetails.landlordNationalIdEmptyError,
            }),
          name: z.string().optional(),
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
    // if (filterNonRepresentatives?.length === 0) {
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

const searchResults = z
  .object({
    label: z.string().optional(),
    units: z
      .array(
        z.object({
          size: z.number().optional(),
          address: z.string().optional(),
          checked: z.boolean().optional(),
          sizeUnit: z.string().optional(),
          unitCode: z.string().optional(),
          addressCode: z.number().optional(),
          propertyCode: z.number().optional(),
          propertyValue: z.number().optional(),
          appraisalUnitCode: z.number().optional(),
          fireInsuranceValuation: z.number().optional(),
          propertyUsageDescription: z.string().optional(),
          numOfRooms: z.number().optional(),
          changedSize: z.number().optional(),
        }),
      )
      .optional(),
    value: z.string().optional(),
    address: z.string().optional(),
    landCode: z.number().optional(),
    postalCode: z.number().optional(),
    streetName: z.string().optional(),
    addressCode: z.number().optional(),
    checkedUnits: z.object({}).optional(),
    streetNumber: z.number().optional(),
    municipalityCode: z.number().optional(),
    municipalityName: z.string().optional(),
  })
  .optional()

const registerProperty = z
  .object({
    searchresults: searchResults,
    categoryType: z.nativeEnum(RentalHousingCategoryTypes).optional(),
    categoryClass: z.nativeEnum(RentalHousingCategoryClass).optional(),
    categoryClassGroup: z
      .nativeEnum(RentalHousingCategoryClassGroup)
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data?.searchresults?.units && data.searchresults.units.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.registerProperty.search.searchResultsNoUnitChosenError,
        path: ['searchResults'],
      })
    }
    if (data?.searchresults?.units && data.searchresults.units.length > 0) {
      const totalRooms = data.searchresults.units.reduce(
        (sum, unit) => sum + (unit.numOfRooms || 0),
        0,
      )
      if (totalRooms < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message too few rooms',
          params: m.registerProperty.search.numOfRoomsMinimumError,
          path: ['searchResults.units'],
        })
      }
      data.searchresults.units.forEach((unit) => {
        if (unit.changedSize && unit.changedSize > maxChangedUnitSize) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Custom error message size too large',
            params: m.registerProperty.search.changedSizeTooLargeError,
            path: ['searchResults.units'],
          })
        } else if (unit.changedSize && unit.changedSize < minChangedUnitSize) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Custom error message size too small',
            params: m.registerProperty.search.changedSizeTooSmallError,
            path: ['searchResults.units'],
          })
        }
      })
    }
    if (
      data.categoryClass === RentalHousingCategoryClass.SPECIAL_GROUPS &&
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

const specialProvisions = z
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
    const anyUnitSizeChanged = data.propertySearchUnits?.some((unit) => {
      return (unit.changedSize && unit.changedSize !== unit.size) || false
    })
    if (anyUnitSizeChanged && !data.descriptionInput) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.specialProvisions.housingInfo.inputRequiredErrorMessage,
        path: ['descriptionInput'],
      })
    }
  })

const condition = z
  .object({
    inspector: z.string().optional(),
    inspectorName: z.string().optional(),
    resultsDescription: z.string().optional(),
    resultsFiles: z.array(fileSchema),
  })
  .superRefine((data, ctx) => {
    if (
      data.inspector === RentalHousingConditionInspector.INDEPENDENT_PARTY &&
      !data.inspectorName
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.housingCondition.inspectorNameRequired,
        path: ['inspectorName'],
      })
    }

    if (!data.resultsDescription && !data.resultsFiles.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.housingCondition.inspectionResultsRequired,
        path: ['resultsFiles'],
      })
    }
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
    if (!isDefiniteChecked) {
      return
    }
    if (!data.endDate || !data.endDate.trim().length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        params: m.rentalPeriod.errorAgreementEndDateNotFilled,
      })
      return
    }
    if (start >= end) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        params: m.rentalPeriod.errorEndDateBeforeStart,
      })
    }
  })

const rentalAmount = z
  .object({
    amount: z.string().optional(),
    indexTypes: z.nativeEnum(RentalAmountIndexTypes).optional(),
    indexValue: z.string().optional(),
    isIndexConnected: z.string().array().optional(),
    paymentDateOptions: z.nativeEnum(RentalAmountPaymentDateOptions).optional(),
    paymentDateOther: z.string().optional(),
    paymentMethodOptions: z.nativeEnum(RentalPaymentMethodOptions).optional(),
    paymentMethodNationalId: z.string().optional(),
    paymentMethodBankAccountNumber: z.string().optional(),
    paymentMethodOtherTextField: z.string().optional(),
    securityDepositRequired: z.string().array().optional(),
  })
  .superRefine((data, ctx) => {
    // Error message if amount is not filled and if it is negative
    if (!data.amount || !data.amount.trim().length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.dataSchema.requiredErrorMsg,
        path: ['amount'],
      })
    }
    if (data.amount && !checkIfNegative(data.amount)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.dataSchema.negativeNumberError,
        path: ['amount'],
      })
    }

    if (data.isIndexConnected?.includes(TRUE) && !data.indexTypes) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.rentalAmount.indexValueRequiredError,
        path: ['indexTypes'],
      })
    }
    if (
      data.paymentDateOptions &&
      data.paymentDateOptions.includes(RentalAmountPaymentDateOptions.OTHER) &&
      !data.paymentDateOther?.trim().length
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.rentalAmount.paymentDateOtherOptionRequiredError,
        path: ['rentalAmount.paymentDateOther'],
      })
    }

    if (
      data.paymentMethodOptions === RentalPaymentMethodOptions.BANK_TRANSFER
    ) {
      if (!data.paymentMethodNationalId?.trim().length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.rentalAmount.paymentMethodNationalIdRequiredError,
          path: ['paymentMethodNationalId'],
        })
      }
      if (
        data.paymentMethodNationalId &&
        data.paymentMethodNationalId?.trim().length &&
        !kennitala.isValid(data.paymentMethodNationalId)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.rentalAmount.paymentMethodNationalIdInvalidError,
          path: ['paymentMethodNationalId'],
        })
      }
      if (!data.paymentMethodBankAccountNumber?.trim().length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.rentalAmount.paymentMethodBankAccountNumberRequiredError,
          path: ['paymentMethodBankAccountNumber'],
        })
      }
      if (
        data.paymentMethodBankAccountNumber &&
        data.paymentMethodBankAccountNumber?.trim().length &&
        data.paymentMethodBankAccountNumber.length < 7
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.rentalAmount.paymentMethodBankAccountNumberInvalidError,
          path: ['paymentMethodBankAccountNumber'],
        })
      }
    }

    if (data.paymentMethodOptions === RentalPaymentMethodOptions.OTHER) {
      if (!data.paymentMethodOtherTextField?.trim().length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.rentalAmount.paymentMethodOtherTextFieldRequiredError,
          path: ['paymentMethodOtherTextField'],
        })
      }
    }
  })

const fireProtections = z
  .object({
    smokeDetectors: z.string().optional(),
    fireExtinguisher: z.string().optional(),
    emergencyExits: z.string().optional(),
    fireBlanket: z.string().optional(),
    propertySize: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const propertySizeString = data.propertySize?.replace(',', '.') || ''
    const numberOfSmokeDetectors = Number(data.smokeDetectors)
    const requiredSmokeDetectors = Math.ceil(Number(propertySizeString) / 80)
    if (
      data.smokeDetectors &&
      numberOfSmokeDetectors < requiredSmokeDetectors
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.housingFireProtections.smokeDetectorMinRequiredError,
        path: ['smokeDetectors'],
      })
    }

    if (data.fireExtinguisher && Number(data.fireExtinguisher) < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.housingFireProtections.fireExtinguisherNullError,
        path: ['fireExtinguisher'],
      })
    }

    if (data.emergencyExits && Number(data.emergencyExits) < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.housingFireProtections.emergencyExitNullError,
        path: ['emergencyExits'],
      })
    }
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
    securityAmountCalculated: z.string().optional(),
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
      data.securityType === SecurityDepositTypeOptions.LANDLORDS_MUTUAL_FUND &&
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
      data.securityType !== SecurityDepositTypeOptions.LANDLORDS_MUTUAL_FUND &&
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
      (data.securityType === SecurityDepositTypeOptions.LANDLORDS_MUTUAL_FUND ||
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
      data.securityType === SecurityDepositTypeOptions.LANDLORDS_MUTUAL_FUND &&
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

const otherCostItemsSchema = z.object({
  description: z.string().optional(),
  amount: z.number().optional(),
  hasError: z.boolean().optional(),
})

const otherFees = z
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
    const hasOtherCosts = data.otherCosts?.includes(TRUE)

    if (data.housingFund && tenantPaysHousingFund) {
      if (!data.housingFundAmount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.otherFees.errorHousingFundEmpty,
          path: ['housingFundAmount'],
        })
      }
    }

    //
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
          params: m.otherFees.errorMeterStatusRegex,
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
          params: m.otherFees.errorMeterNumberEmpty,
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

const preSignatureInfo = z.object({
  statement: z
    .string()
    .array()
    .refine((x) => x.includes(TRUE), {
      params: m.inReview.preSignatureInfo.statementError,
    }),
})

export const dataSchema = z.object({
  approveExternalData,
  applicant,
  landlordInfo,
  tenantInfo,
  registerProperty,
  rentalPeriod,
  rentalAmount,
  securityDeposit,
  specialProvisions,
  condition,
  fireProtections,
  otherFees,
  preSignatureInfo,
})

export type RentalAgreement = z.TypeOf<typeof dataSchema>
