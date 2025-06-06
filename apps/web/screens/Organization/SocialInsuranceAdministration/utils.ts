import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from 'next-usequerystate'
import type { ParsedUrlQuery } from 'querystring'

import { Option } from '@island.is/island-ui/core'
import {
  CustomPage,
  SocialInsurancePensionCalculationBasePensionType,
  SocialInsurancePensionCalculationInput,
  SocialInsurancePensionCalculationLivingCondition,
  SocialInsurancePensionCalculationPeriodIncomeType,
} from '@island.is/web/graphql/schema'

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
    birthMonth: parseAsInteger.parseServerSide(query.birthMonth),
    birthYear: parseAsInteger.parseServerSide(query.birthYear),
    startMonth: parseAsInteger.parseServerSide(query.startMonth),
    startYear: parseAsInteger.parseServerSide(query.startYear),
    dateOfCalculations: parseAsString.parseServerSide(query.dateOfCalculations),
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

export const getDateOfCalculationsOptions = (pageData?: CustomPage | null) => {
  const options: Option<string>[] = [
    ...(pageData?.configJson?.dateOfCalculationOptions ?? [
      {
        label: '2024',
        value: new Date(2024, 11, 31).toISOString(),
      },
      {
        label: '2023 (júl-des)',
        value: new Date(2023, 11, 31).toISOString(),
      },
      {
        label: '2023 (jan-jún)',
        value: new Date(2023, 5, 30).toISOString(),
      },
      {
        label: '2022 (jún-des)',
        value: new Date(2022, 11, 31).toISOString(),
      },
      {
        label: '2022 (jan-maí)',
        value: new Date(2022, 5, 31).toISOString(),
      },
    ]),
  ]

  const missingYearOptions: Option<string>[] = []
  if (pageData?.configJson?.addMissingYearsAutomatically !== false) {
    let year = new Date().getFullYear()
    while (year > new Date(options[0].value).getFullYear()) {
      missingYearOptions.push({
        label: year.toString(),
        value: new Date(year, 11, 31).toISOString(),
      })
      year -= 1
    }
    missingYearOptions.reverse()
  }

  for (const missingYearOption of missingYearOptions) {
    options.unshift(missingYearOption)
  }

  return options
}

export const extractSlug = (
  locale: string,
  customPageData?: CustomPage | null,
) => {
  return locale === 'is'
    ? (customPageData?.configJson?.icelandicSlug as string) ||
        'tryggingastofnun'
    : (customPageData?.configJson?.englishSlug as string) ||
        'social-insurance-administration'
}

export const is2025PreviewActive = (customPageData?: CustomPage | null) => {
  return Boolean(customPageData?.configJson?.show2025Preview)
}

export const is2025FormPreviewActive = (customPageData?: CustomPage | null) => {
  return Boolean(customPageData?.configJson?.show2025FormPreview)
}

export const NEW_SYSTEM_TAKES_PLACE_DATE = new Date(2025, 8, 2)
