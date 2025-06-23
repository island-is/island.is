import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import is from 'date-fns/locale/is'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { EMAIL_REGEX } from '@island.is/application/core'
import { RepeaterItem, StateLifeCycle } from '@island.is/application/types'
import {
  ApplicantsInfo,
  CostField,
  PropertyUnit,
  RentalHousingCategoryClass,
} from '../shared'
import {
  RentalHousingCategoryClassGroup,
  RentalHousingCategoryTypes,
  RentalHousingConditionInspector,
  RentalAmountPaymentDateOptions,
  OtherFeesPayeeOptions,
  SecurityDepositTypeOptions,
  SecurityDepositAmountOptions,
  RentalPaymentMethodOptions,
  NextStepInReviewOptions,
  EmergencyExitOptions,
} from './enums'
import * as m from '../lib/messages'

export const SPECIALPROVISIONS_DESCRIPTION_MAXLENGTH = 1500
export const minChangedUnitSize = 3
export const maxChangedUnitSize = 500

export const pruneAfterDays = (Days: number): StateLifeCycle => {
  return {
    shouldBeListed: false,
    shouldBePruned: true,
    whenToPrune: Days * 24 * 3600 * 1000,
  }
}

export const validateEmail = (value: string) => {
  return EMAIL_REGEX.test(value)
}

export const insertAt = (str: string, sub: string, pos: number) =>
  `${str.slice(0, pos)}${sub}${str.slice(pos)}`

export const formatNationalId = (nationalId: string) =>
  insertAt(nationalId.replace('-', ''), '-', 6) || '-'

export const formatDate = (date: string) => {
  return format(parseISO(date), 'dd.MM.yyyy', {
    locale: is,
  })
}

export const isValidMeterNumber = (value: string) => {
  const meterNumberRegex = /^[0-9]{1,20}$/
  return meterNumberRegex.test(value)
}

export const isValidMeterStatus = (value: string) => {
  const meterStatusRegex = /^[0-9]{1,10}(,[0-9])?$/
  return meterStatusRegex.test(value)
}

export const hasInvalidCostItems = (items: CostField[]) =>
  items.some((i) => i.hasError)

export const formatPhoneNumber = (phoneNumber: string): string => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone?.formatNational() || phoneNumber
}

export const formatBankInfo = (bankInfo: string) => {
  const formattedBankInfo = bankInfo.replace(/^(.{4})(.{2})/, '$1-$2-')
  if (formattedBankInfo && formattedBankInfo.length >= 6) {
    return formattedBankInfo
  }
  return bankInfo
}

export const hasAnyMatchingNationalId = (
  nationalIds: string[],
  applicants: ApplicantsInfo[] = [],
) => {
  return (
    nationalIds.length > 0 &&
    applicants?.some((applicant) =>
      nationalIds.includes(applicant.nationalIdWithName.nationalId),
    )
  )
}

export const hasDuplicateApplicants = (
  applicants: ApplicantsInfo[] = [],
): boolean => {
  const seen = new Set<string>()

  for (const applicant of applicants) {
    if (seen.has(applicant.nationalIdWithName.nationalId)) {
      return true
    }
    seen.add(applicant.nationalIdWithName.nationalId)
  }

  return false
}

export const isCostItemValid = (item: CostField) =>
  ((item.description ?? '').trim() !== '' && item.amount !== undefined) ||
  ((item.description ?? '').trim() === '' && item.amount === undefined)

export const isEmptyCostItem = (item: CostField) =>
  (item.description ?? '').trim() === '' && item.amount === undefined

export const filterEmptyCostItems = (items: CostField[]) =>
  items.filter((item) => !isEmptyCostItem(item)) ?? []

export const formatCurrency = (answer: string) =>
  answer.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export const parseCurrency = (value: string): number | undefined => {
  const numeric = value.replace(/[^\d]/g, '')
  return numeric ? Number(numeric) : undefined
}

export const getRentalPropertySize = (units: PropertyUnit[]) =>
  units.reduce(
    (total, unit) =>
      total +
      (unit.changedSize && unit.changedSize !== 0
        ? unit.changedSize
        : unit.size || 0),
    0,
  )

export const applicantTableFields: Record<string, RepeaterItem> = {
  nationalIdWithName: {
    component: 'nationalIdWithName',
    required: true,
    searchCompanies: true,
  },
  phone: {
    component: 'phone',
    required: true,
    label: m.landlordAndTenantDetails.phoneInputLabel,
    enableCountrySelector: true,
    width: 'half',
  },
  email: {
    component: 'input',
    required: true,
    label: m.landlordAndTenantDetails.emailInputLabel,
    type: 'email',
    width: 'half',
  },
  address: {
    component: 'input',
    required: true,
    label: m.landlordAndTenantDetails.addressInputLabel,
    maxLength: 100,
  },
}

export const applicantTableConfig = {
  format: {
    phone: (value: string) => value && formatPhoneNumber(value),
    nationalId: (value: string) => value && formatNationalId(value),
  },
  header: [
    m.landlordAndTenantDetails.nameInputLabel,
    m.landlordAndTenantDetails.phoneInputLabel,
    m.landlordAndTenantDetails.nationalIdHeaderLabel,
    m.landlordAndTenantDetails.emailInputLabel,
  ],
  rows: ['name', 'phone', 'nationalId', 'email'],
}

export const getPropertyTypeOptions = () => [
  {
    value: RentalHousingCategoryTypes.ENTIRE_HOME,
    label: m.registerProperty.category.typeSelectLabelEntireHome,
  },
  {
    value: RentalHousingCategoryTypes.ROOM,
    label: m.registerProperty.category.typeSelectLabelRoom,
  },
  {
    value: RentalHousingCategoryTypes.COMMERCIAL,
    label: m.registerProperty.category.typeSelectLabelCommercial,
  },
]

export const getPropertyClassOptions = () => [
  {
    value: RentalHousingCategoryClass.SPECIAL_GROUPS,
    label: m.registerProperty.category.classSelectLabelIsSpecialGroups,
  },
  {
    value: RentalHousingCategoryClass.GENERAL_MARKET,
    label: m.registerProperty.category.classSelectLabelNotSpecialGroups,
  },
]

export const getPropertyClassGroupOptions = () => [
  {
    value: RentalHousingCategoryClassGroup.STUDENT_HOUSING,
    label: m.registerProperty.category.classGroupSelectLabelStudentHousing,
  },
  {
    value: RentalHousingCategoryClassGroup.SENIOR_CITIZEN_HOUSING,
    label:
      m.registerProperty.category.classGroupSelectLabelSeniorCitizenHousing,
  },
  {
    value: RentalHousingCategoryClassGroup.COMMUNE,
    label: m.registerProperty.category.classGroupSelectLabelCommune,
  },
  {
    value: RentalHousingCategoryClassGroup.HALFWAY_HOUSE,
    label: m.registerProperty.category.classGroupSelectLabelHalfwayHouse,
  },
  {
    value: RentalHousingCategoryClassGroup.INCOME_BASED_HOUSING,
    label: m.registerProperty.category.classGroupSelectLabelIncomeBasedHousing,
  },
]

export const getInspectorOptions = () => [
  {
    value: RentalHousingConditionInspector.CONTRACT_PARTIES,
    label: m.housingCondition.inspectorOptionContractParties,
  },
  {
    value: RentalHousingConditionInspector.INDEPENDENT_PARTY,
    label: m.housingCondition.inspectorOptionIndependentParty,
  },
]

export const getRentalAmountPaymentDateOptions = () => [
  {
    value: RentalAmountPaymentDateOptions.FIRST_DAY,
    label: m.rentalAmount.paymentDateOptionFirstDay,
  },
  {
    value: RentalAmountPaymentDateOptions.LAST_DAY,
    label: m.rentalAmount.paymentDateOptionLastDay,
  },
  {
    value: RentalAmountPaymentDateOptions.OTHER,
    label: m.rentalAmount.paymentDateOptionOther,
  },
]

export const getSecurityDepositTypeOptions = () => [
  {
    label: m.securityDeposit.typeSelectionBankGuaranteeTitle,
    value: SecurityDepositTypeOptions.BANK_GUARANTEE,
  },
  {
    label: m.securityDeposit.typeSelectionCapitalTitle,
    value: SecurityDepositTypeOptions.CAPITAL,
  },
  {
    label: m.securityDeposit.typeSelectionThirdPartyGuaranteeTitle,
    value: SecurityDepositTypeOptions.THIRD_PARTY_GUARANTEE,
  },
  {
    label: m.securityDeposit.typeSelectionInsuranceCompanyTitle,
    value: SecurityDepositTypeOptions.INSURANCE_COMPANY,
  },
  {
    label: m.securityDeposit.typeSelectionMutualFundTitle,
    value: SecurityDepositTypeOptions.LANDLORDS_MUTUAL_FUND,
  },
  {
    label: m.securityDeposit.typeSelectionOtherTitle,
    value: SecurityDepositTypeOptions.OTHER,
  },
]

export const getSecurityAmountOptions = () => [
  {
    label: m.securityDeposit.amountSelection1Month,
    value: SecurityDepositAmountOptions.ONE_MONTH,
  },
  {
    label: m.securityDeposit.amountSelection2Month,
    value: SecurityDepositAmountOptions.TWO_MONTHS,
  },
  {
    label: m.securityDeposit.amountSelection3Month,
    value: SecurityDepositAmountOptions.THREE_MONTHS,
  },
  {
    label: m.securityDeposit.amountSelectionOther,
    value: SecurityDepositAmountOptions.OTHER,
  },
]

export const getOtherFeesPayeeOptions = () => [
  {
    value: OtherFeesPayeeOptions.LANDLORD,
    label: m.otherFees.paidByLandlordLabel,
  },
  {
    value: OtherFeesPayeeOptions.TENANT,
    label: m.otherFees.paidByTenantLabel,
  },
]

export const getPaymentMethodOptions = () => [
  {
    value: RentalPaymentMethodOptions.BANK_TRANSFER,
    label: m.rentalAmount.paymentMethodBankTransferLabel,
  },
  {
    value: RentalPaymentMethodOptions.PAYMENT_SLIP,
    label: m.rentalAmount.paymentMethodPaymentSlipLabel,
  },
  {
    value: RentalPaymentMethodOptions.OTHER,
    label: m.rentalAmount.paymentMethodOtherLabel,
  },
]

export const getNextStepInReviewOptions = () => [
  {
    value: NextStepInReviewOptions.GO_TO_SIGNING,
    label: m.inReview.reviewInfo.nextStepToSigningButtonText,
  },
  {
    value: NextStepInReviewOptions.EDIT_APPLICATION,
    label: m.inReview.reviewInfo.nextStepToEditButtonText,
  },
]

export const getEmergencyExitOptions = () => [
  {
    value: EmergencyExitOptions.YES,
    label: m.housingFireProtections.typeRadioYesExit,
  },
  {
    value: EmergencyExitOptions.NO,
    label: m.housingFireProtections.typeRadioNoExit,
  },
]
