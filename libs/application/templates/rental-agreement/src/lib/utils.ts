import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import {
  rentalAmountIndexTypes,
  rentalHousingCategoryClass,
  rentalHousingCategoryClassGroup,
  rentalHousingCategoryTypes,
  rentalHousingConditionInspector,
  rentalAmountPaymentDateOptions,
  rentOtherFeesPayeeOptions,
} from './constants'
import * as m from './messages'

export const insertAt = (str: string, sub: string, pos: number) =>
  `${str.slice(0, pos)}${sub}${str.slice(pos)}`

export const formatNationalId = (nationalId: string) =>
  insertAt(nationalId.replace('-', ''), '-', 6) || '-'

export const getApplicationAnswers = (answers: Application['answers']) => {
  const propertyCategoryTypeOptions =
    getValueViaPath<rentalHousingCategoryTypes>(
      answers,
      'registerPropertyCategoryType',
    )

  const propertyCategoryClassOptions =
    getValueViaPath<rentalHousingCategoryClass>(
      answers,
      'registerPropertyCategoryClass',
    )

  const inspectorOptions = getValueViaPath<rentalHousingConditionInspector>(
    answers,
    'rentalHousingConditionInspector',
  )

  const rentalAmountIndexTypesOptions = getValueViaPath<rentalAmountIndexTypes>(
    answers,
    'rentalAmountIndexTypes',
  )

  const rentalAmountPaymentDateOptions =
    getValueViaPath<rentalAmountPaymentDateOptions>(
      answers,
      'rentalAmountPaymentDate',
    )

  const rentOtherFeesHousingFund = getValueViaPath<rentOtherFeesPayeeOptions>(
    answers,
    'rentOtherFees.housingFund',
  )

  const rentOtherFeesElectricityCost =
    getValueViaPath<rentOtherFeesPayeeOptions>(
      answers,
      'rentOtherFees.electricityCost',
    )

  const rentOtherFeesHeatingCost = getValueViaPath<rentOtherFeesPayeeOptions>(
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
    value: rentalHousingCategoryTypes.ENTIRE_HOME,
    label: m.registerProperty.category.typeSelectLabelEntireHome,
  },
  {
    value: rentalHousingCategoryTypes.ROOM,
    label: m.registerProperty.category.typeSelectLabelRoom,
  },
  {
    value: rentalHousingCategoryTypes.COMMERCIAL,
    label: m.registerProperty.category.typeSelectLabelCommercial,
  },
]

export const getPropertyCategoryClassOptions = () => [
  {
    value: rentalHousingCategoryClass.GENERAL_MARKET,
    label: m.registerProperty.category.classSelectLabelGeneralMarket,
  },
  {
    value: rentalHousingCategoryClass.SPECIAL_GROUPS,
    label: m.registerProperty.category.classSelectLabelSpecialGroups,
  },
]

export const getPropertyCategoryClassGroupOptions = () => [
  {
    value: rentalHousingCategoryClassGroup.STUDENT_HOUSING,
    label: m.registerProperty.category.classGroupSelectLabelStudentHousing,
  },
  {
    value: rentalHousingCategoryClassGroup.SENIOR_CITIZEN_HOUSING,
    label:
      m.registerProperty.category.classGroupSelectLabelSeniorCitizenHousing,
  },
  {
    value: rentalHousingCategoryClassGroup.COMMUNE,
    label: m.registerProperty.category.classGroupSelectLabelCommune,
  },
  {
    value: rentalHousingCategoryClassGroup.HALFWAY_HOUSE,
    label: m.registerProperty.category.classGroupSelectLabelHalfwayHouse,
  },
  {
    value: rentalHousingCategoryClassGroup.SOCIAL_HOUSING,
    label: m.registerProperty.category.classGroupSelectLabelSocialHousing,
  },
  {
    value: rentalHousingCategoryClassGroup.INCOME_BASED_HOUSING,
    label: m.registerProperty.category.classGroupSelectLabelIncomeBasedHousing,
  },
  {
    value: rentalHousingCategoryClassGroup.EMPLOYEE_HOUSING,
    label: m.registerProperty.category.classGroupSelectLabelEmployeeHousing,
  },
]

export const getInspectorOptions = () => [
  {
    value: rentalHousingConditionInspector.CONTRACT_PARTIES,
    label: m.housingCondition.inspectorOptionContractParties,
  },
  {
    value: rentalHousingConditionInspector.INDEPENDENT_PARTY,
    label: m.housingCondition.inspectorOptionIndependentParty,
  },
]

export const getRentalAmountIndexTypes = () => [
  {
    value: rentalAmountIndexTypes.CONSUMER_PRICE_INDEX,
    label: m.rentalAmount.indexOptionConsumerPriceIndex,
  },
  {
    value: rentalAmountIndexTypes.CONSTRUCTION_COST_INDEX,
    label: m.rentalAmount.indexOptionConstructionCostIndex,
  },
  {
    value: rentalAmountIndexTypes.WAGE_INDEX,
    label: m.rentalAmount.indexOptionWageIndex,
  },
]

export const getRentalAmountPaymentDateOptions = () => [
  {
    value: rentalAmountPaymentDateOptions.FIRST_DAY,
    label: m.rentalAmount.paymentDateOptionFirstDay,
  },
  {
    value: rentalAmountPaymentDateOptions.LAST_DAY,
    label: m.rentalAmount.paymentDateOptionLastDay,
  },
  {
    value: rentalAmountPaymentDateOptions.OTHER,
    label: m.rentalAmount.paymentDateOptionOther,
  },
]

export const getRentalOtherFeesPayeeOptions = () => [
  {
    value: rentOtherFeesPayeeOptions.LANDLORD,
    label: m.otherFees.paidByLandlordLabel,
  },
  {
    value: rentOtherFeesPayeeOptions.TENANT,
    label: m.otherFees.paidByTenantLabel,
  },
]
