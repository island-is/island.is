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
    birthdate: parseAsString.parseServerSide(query.birthdate),
    startDate: parseAsString.parseServerSide(query.startDate),
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
  const options: Option<string>[] = pageData?.configJson
    ?.dateOfCalculationOptions ?? [
    {
      label: '2024',
      value: new Date(2024, 1, 1).toISOString(),
    },
    {
      label: '2023 (júl-des)',
      value: new Date(2023, 7, 1).toISOString(),
    },
    {
      label: '2023 (jan-jún)',
      value: new Date(2023, 2, 1).toISOString(),
    },
    {
      label: '2022 (jún-des)',
      value: new Date(2022, 7, 1).toISOString(),
    },
    {
      label: '2022 (jan-maí)',
      value: new Date(2022, 2, 1).toISOString(),
    },
    {
      label: '2021',
      value: new Date(2021, 2, 1).toISOString(),
    },
    {
      label: '2020',
      value: new Date(2020, 2, 1).toISOString(),
    },
    {
      label: '2019',
      value: new Date(2019, 2, 1).toISOString(),
    },
    {
      label: '2018',
      value: new Date(2018, 2, 1).toISOString(),
    },
    {
      label: '2017',
      value: new Date(2017, 2, 1).toISOString(),
    },
    {
      label: '2016',
      value: new Date(2016, 2, 1).toISOString(),
    },
    {
      label: '2015',
      value: new Date(2015, 2, 1).toISOString(),
    },
  ]

  const missingYearOptions: Option<string>[] = []
  if (pageData?.configJson?.addMissingYearsAutomatically !== false) {
    let year = new Date().getFullYear()
    while (year > new Date(options[0].value).getFullYear()) {
      missingYearOptions.push({
        label: year.toString(),
        value: new Date(year, 0, 1).toISOString(),
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
