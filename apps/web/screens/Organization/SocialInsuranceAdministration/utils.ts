import {
  parseAsBoolean,
  parseAsInteger,
  parseAsIsoDateTime,
  parseAsStringEnum,
} from 'next-usequerystate'
import type { ParsedUrlQuery } from 'querystring'

import {
  SocialInsurancePensionCalculationBasePensionType,
  SocialInsurancePensionCalculationInput,
  SocialInsurancePensionCalculationLivingCondition,
  SocialInsurancePensionCalculationPeriodIncomeType,
} from '@island.is/web/graphql/schema'

import { PensionCalculatorFormState } from './PensionCalculator'

const convertStringToNumber = (value: string) => {
  if (!value) {
    return undefined
  }
  return Number(value)
}

export const convertFormStateToCalculationInput = (
  formState: PensionCalculatorFormState,
): SocialInsurancePensionCalculationInput => {
  return {
    birthdate: new Date(formState.birthdate),
    ageOfFirst75DisabilityAssessment: convertStringToNumber(
      formState.ageOfFirst75DisabilityAssessment,
    ),
    benefitsFromMunicipality: convertStringToNumber(
      formState.benefitsFromMunicipality,
    ),
  }
}

export const convertQueryParametersToCalculationInput = (
  query: ParsedUrlQuery,
): SocialInsurancePensionCalculationInput => {
  return {
    benefitsFromMunicipality: parseAsInteger.parseServerSide(
      query.benefitsFromMunicipality,
    ),
    capitalIncome: parseAsInteger.parseServerSide(query.capitalIncome),
    childCount: parseAsInteger.parseServerSide(query.childCount),
    childSupportCount: parseAsInteger.parseServerSide(query.childSupportCount),
    dateOfCalculations: parseAsIsoDateTime.parseServerSide(
      query.dateOfCalculations,
    ),
    foreignBasicPension: parseAsInteger.parseServerSide(
      query.foreignBasicPension,
    ),
    hasSpouse: parseAsBoolean.parseServerSide(query.hasSpouse),
    income: parseAsInteger.parseServerSide(query.income),
    otherIncome: parseAsInteger.parseServerSide(query.otherIncome),
    livingCondition: parseAsStringEnum(
      Object.values(SocialInsurancePensionCalculationLivingCondition),
    ).parseServerSide(query.livingCondition),
    livingConditionAbroadInYears: parseAsInteger.parseServerSide(
      query.livingConditionAbroadInYears,
    ),
    taxCard: parseAsInteger.parseServerSide(query.taxCard),
    mobilityImpairment: parseAsBoolean.parseServerSide(
      query.mobilityImpairment,
    ),
    ageOfFirst75DisabilityAssessment: parseAsInteger.parseServerSide(
      query.ageOfFirst75DisabilityAssessment,
    ),
    pensionPayments: parseAsInteger.parseServerSide(query.pensionPayments),
    premium: parseAsInteger.parseServerSide(query.premium),
    privatePensionPayments: parseAsInteger.parseServerSide(
      query.privatePensionPayments,
    ),
    typeOfPeriodIncome: parseAsStringEnum(
      Object.values(SocialInsurancePensionCalculationPeriodIncomeType),
    ).parseServerSide(query.typeOfPeriodIncome),
    typeOfBasePension: parseAsStringEnum(
      Object.values(SocialInsurancePensionCalculationBasePensionType),
    ).parseServerSide(query.typeOfBasePension),
    livingConditionRatio: parseAsInteger.parseServerSide(
      query.livingConditionRatio,
    ),
    installmentClaims: parseAsInteger.parseServerSide(query.installmentClaims),
    birthdate: parseAsIsoDateTime.parseServerSide(query.birthdate),
    startDate: parseAsIsoDateTime.parseServerSide(query.startDate),
  }
}

const convertToString = <T>(value: T) => {
  if (typeof value === 'string') {
    return value
  }
  if (typeof value === 'number') {
    return String(value)
  }
  if (value instanceof Date) {
    return value.toISOString()
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }
  return ''
}

export const convertToQueryParams = <T>(data: T) => {
  const queryParams = new URLSearchParams()

  for (const stringKey in data) {
    const key = stringKey as keyof typeof data
    const value = convertToString(data[key])
    if (value && typeof key === 'string') {
      queryParams.append(key, value)
    }
  }

  return queryParams
}
