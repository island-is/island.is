import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import {
  RentalAmountIndexTypes,
  RentalHousingCategoryClass,
  RentalHousingCategoryClassGroup,
  RentalHousingCategoryTypes,
  RentalHousingConditionInspector,
  RentalAmountPaymentDateOptions,
  RentOtherFeesPayeeOptions,
  SecurityDepositTypeOptions,
  SecurityDepositAmountOptions,
} from './constants'
import * as m from './messages'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import is from 'date-fns/locale/is'

export const insertAt = (str: string, sub: string, pos: number) =>
  `${str.slice(0, pos)}${sub}${str.slice(pos)}`

export const formatNationalId = (nationalId: string) =>
  insertAt(nationalId.replace('-', ''), '-', 6) || '-'

export const formatDate = (date: string) => {
  return format(parseISO(date), 'dd.MM.yyyy', {
    locale: is,
  })
}

export const getApplicationAnswers = (answers: Application['answers']) => {
  const propertyCategoryTypeOptions =
    getValueViaPath<RentalHousingCategoryTypes>(
      answers,
      'registerProperty.categoryType',
    )

  const propertyCategoryClassOptions =
    getValueViaPath<RentalHousingCategoryClass>(
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

  const rentOtherFeesHousingFund = getValueViaPath<RentOtherFeesPayeeOptions>(
    answers,
    'rentOtherFees.housingFund',
  )

  const rentOtherFeesElectricityCost =
    getValueViaPath<RentOtherFeesPayeeOptions>(
      answers,
      'rentOtherFees.electricityCost',
    )

  const rentOtherFeesHeatingCost = getValueViaPath<RentOtherFeesPayeeOptions>(
    answers,
    'rentOtherFees.heatingCost',
  )

  return {
    propertyCategoryTypeOptions,
    propertyCategoryClassOptions,
    inspectorOptions,
    rentalAmountIndexTypesOptions,
    rentalAmountPaymentDateOptions,
    rentOtherFeesElectricityCost,
    rentOtherFeesHeatingCost,
    rentOtherFeesHousingFund,
  }
}

export const getPropertyCategoryTypeOptions = () => [
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

export const getPropertyCategoryClassOptions = () => [
  {
    value: RentalHousingCategoryClass.GENERAL_MARKET,
    label: m.registerProperty.category.classSelectLabelGeneralMarket,
  },
  {
    value: RentalHousingCategoryClass.SPECIAL_GROUPS,
    label: m.registerProperty.category.classSelectLabelSpecialGroups,
  },
]

export const getPropertyCategoryClassGroupOptions = () => [
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
    value: RentalHousingCategoryClassGroup.SOCIAL_HOUSING,
    label: m.registerProperty.category.classGroupSelectLabelSocialHousing,
  },
  {
    value: RentalHousingCategoryClassGroup.INCOME_BASED_HOUSING,
    label: m.registerProperty.category.classGroupSelectLabelIncomeBasedHousing,
  },
  {
    value: RentalHousingCategoryClassGroup.EMPLOYEE_HOUSING,
    label: m.registerProperty.category.classGroupSelectLabelEmployeeHousing,
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
    value: SecurityDepositTypeOptions.MUTUAL_FUND,
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

export const getRentalOtherFeesPayeeOptions = () => [
  {
    value: RentOtherFeesPayeeOptions.LANDLORD,
    label: m.otherFees.paidByLandlordLabel,
  },
  {
    value: RentOtherFeesPayeeOptions.TENANT,
    label: m.otherFees.paidByTenantLabel,
  },
]
