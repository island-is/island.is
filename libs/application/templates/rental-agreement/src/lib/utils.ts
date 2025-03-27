import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import {
  RentalAmountIndexTypes,
  RentalHousingCategoryClass,
  RentalHousingCategoryClassGroup,
  RentalHousingCategoryTypes,
  RentalHousingConditionInspector,
  RentalAmountPaymentDateOptions,
  OtherFeesPayeeOptions,
  SecurityDepositTypeOptions,
  SecurityDepositAmountOptions,
  UserRole,
  RentalPaymentMethodOptions,
} from './constants'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import is from 'date-fns/locale/is'
import * as m from './messages'

export const validateEmail = (value: string) => {
  const regex =
    /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
  return regex.test(value)
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

export const formatCurrency = (
  answer: string,
  options?: { skipCurrency: boolean },
) =>
  `${answer.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}${
    options?.skipCurrency ? '' : ' ISK'
  }`

export const getApplicationAnswers = (answers: Application['answers']) => {
  const propertyTypeOptions = getValueViaPath<RentalHousingCategoryTypes>(
    answers,
    'registerProperty.categoryType',
  )

  const propertyClassOptions = getValueViaPath<RentalHousingCategoryClass>(
    answers,
    'registerProperty.categoryClass',
  )

  const inspectorOptions = getValueViaPath<RentalHousingConditionInspector>(
    answers,
    'condition.inspector',
  )

  const rentalAmountIndexTypesOptions = getValueViaPath<RentalAmountIndexTypes>(
    answers,
    'rentalAmount.indexTypes',
  )

  const rentalAmountPaymentDateOptions =
    getValueViaPath<RentalAmountPaymentDateOptions>(
      answers,
      'rentalAmount.paymentDateOptions',
    )

  const otherFeesHousingFund = getValueViaPath<OtherFeesPayeeOptions>(
    answers,
    'otherFees.housingFund',
  )

  const otherFeesElectricityCost = getValueViaPath<OtherFeesPayeeOptions>(
    answers,
    'otherFees.electricityCost',
  )

  const otherFeesHeatingCost = getValueViaPath<OtherFeesPayeeOptions>(
    answers,
    'otherFees.heatingCost',
  )

  return {
    propertyTypeOptions,
    propertyClassOptions,
    inspectorOptions,
    rentalAmountIndexTypesOptions,
    rentalAmountPaymentDateOptions,
    otherFeesElectricityCost,
    otherFeesHeatingCost,
    otherFeesHousingFund,
  }
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
  // TODO: Add this option if decision is made to use
  // {
  //   value: RentalHousingCategoryClassGroup.EMPLOYEE_HOUSING,
  //   label: m.registerProperty.category.classGroupSelectLabelEmployeeHousing,
  // },
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

export const getRentalAmountIndexTypes = () => [
  {
    value: RentalAmountIndexTypes.CONSUMER_PRICE_INDEX,
    label: m.rentalAmount.indexOptionConsumerPriceIndex,
  },
  {
    value: RentalAmountIndexTypes.CONSTRUCTION_COST_INDEX,
    label: m.rentalAmount.indexOptionConstructionCostIndex,
  },
  {
    value: RentalAmountIndexTypes.WAGE_INDEX,
    label: m.rentalAmount.indexOptionWageIndex,
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

export const getOtherFeesHousingFundPayeeOptions = () => [
  {
    value: OtherFeesPayeeOptions.LANDLORD_OR_NOT_APPLICABLE,
    label: m.otherFees.housingFundPayedByLandlordLabel,
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

export const getUserRoleOptions = [
  {
    label: m.userRole.landlordOptionLabel,
    value: UserRole.LANDLORD,
  },
  {
    label: m.userRole.tenantOptionLabel,
    value: UserRole.TENANT,
  },
]
