import { ApiProtectedV1PensionCalculatorPostRequest } from '@island.is/clients/social-insurance-administration'
import {
  BasePensionType,
  Birthyear,
  LivingCondition,
  PensionCalculationInput,
  PensionStart,
  PeriodIncomeType,
} from './dtos/pensionCalculation.input'

const basePensionTypeMapping: Record<BasePensionType, number> = {
  [BasePensionType.Retirement]: 1, // Ellilífeyrir
  [BasePensionType.FishermanRetirement]: 2, // Ellilífeyrir sjómanna
  [BasePensionType.Disability]: 3, // Örorkulífeyrir
  [BasePensionType.Rehabilitation]: 4, // Endurhæfingarlífeyrir
  [BasePensionType.HalfRetirement]: 5, // Hálfur Ellilífeyrir
}

const livingConditionMapping: Record<LivingCondition, number> = {
  [LivingCondition.LivesAlone]: 1,
  [LivingCondition.DoesNotLiveAlone]: 2,
}

const startPensionMapping: Record<PensionStart, number> = {
  [PensionStart.Starts2017OrBefore]: 1,
  [PensionStart.Starts2018OrLater]: 2,
}

const birthyearMapping: Record<Birthyear, number> = {
  [Birthyear.Born1951OrEarlier]: 1,
  [Birthyear.Born1952OrLater]: 2,
}

const periodIncomeTypeMapping: Record<PeriodIncomeType, number> = {
  [PeriodIncomeType.Year]: 1,
  [PeriodIncomeType.Month]: 2,
}

export const mapPensionCalculationInput = (
  input: PensionCalculationInput,
): ApiProtectedV1PensionCalculatorPostRequest['trWebCommonsExternalPortalsApiModelsPensionCalculatorPensionCalculatorInput'] => {
  const startPension = input.startPension
    ? startPensionMapping[input.startPension]
    : input.startPension
  return {
    ...input,
    start: startPension,
    startPension,
    typeOfBasePension: input.typeOfBasePension
      ? basePensionTypeMapping[input.typeOfBasePension]
      : input.typeOfBasePension,
    livingCondition: input.livingCondition
      ? livingConditionMapping[input.livingCondition]
      : input.livingCondition,
    yearOfBirth: input.yearOfBirth
      ? birthyearMapping[input.yearOfBirth]
      : input.yearOfBirth,
    typeOfPeriodIncome: input.typeOfPeriodIncome
      ? periodIncomeTypeMapping[input.typeOfPeriodIncome]
      : input.typeOfPeriodIncome,
  }
}
