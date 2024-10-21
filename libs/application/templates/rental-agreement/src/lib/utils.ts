import { Application } from '@island.is/application/types'
import {
  AnswerOptions,
  rentalAmountIndexTypes,
  rentalHousingCategoryClass,
  rentalHousingCategoryClassGroup,
  rentalHousingCategoryTypes,
  rentalHousingConditionInspector,
  rentalAmountPaymentDateOptions,
} from './constants'
import * as m from './messages'
import { getValueViaPath } from '@island.is/application/core'

export const insertAt = (str: string, sub: string, pos: number) =>
  `${str.slice(0, pos)}${sub}${str.slice(pos)}`

export const formatNationalId = (nationalId: string) =>
  insertAt(nationalId.replace('-', ''), '-', 6) || '-'

export const getApplicationAnswers = (answers: Application['answers']) => {
  const propertyCategoryTypeOptions = getValueViaPath(
    answers,
    'registerPropertyCategoryType',
  ) as rentalHousingCategoryTypes

  const propertyCategoryClassOptions = getValueViaPath(
    answers,
    'registerPropertyCategoryClass',
  ) as rentalHousingCategoryClass

  const inspectorOptions = getValueViaPath(
    answers,
    'rentalHousingConditionInspector',
  ) as rentalHousingConditionInspector

  const isRentalAmountIndexConnected = getValueViaPath(
    answers,
    'isRentalAmountIndexConnected',
  ) as AnswerOptions

  const rentalAmountIndexTypesOptions = getValueViaPath(
    answers,
    'rentalAmountIndexTypes',
  ) as rentalAmountIndexTypes

  return {
    propertyCategoryTypeOptions,
    propertyCategoryClassOptions,
    inspectorOptions,
    isRentalAmountIndexConnected,
    rentalAmountIndexTypesOptions,
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
