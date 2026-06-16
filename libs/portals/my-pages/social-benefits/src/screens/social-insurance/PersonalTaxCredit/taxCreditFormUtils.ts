import { SocialInsuranceYearWithMonths } from '@island.is/api/schema'
import { MONTHS, m as coreMessages } from '@island.is/portals/my-pages/core'
import { FormatMessage } from '@island.is/localization'

export type PersonalFormValues = {
  action: 'register' | 'update' | 'discontinue' | null
  year: number | null
  month: number | null
  percentage: string
}

export type SpouseFormValues = {
  action: 'grant' | 'deceased' | null
  year: number | null
  month: number | null
  percentage: string
}

export const PERSONAL_FORM_DEFAULTS: PersonalFormValues = {
  action: null,
  year: null,
  month: null,
  percentage: '',
}

export const SPOUSE_FORM_DEFAULTS: SpouseFormValues = {
  action: null,
  year: null,
  month: null,
  percentage: '',
}

export const DECEASED_SPOUSE_ERROR_CODES = {
  DATE_OF_DEATH_NOT_WITHIN_VALID_RANGE:
    'SPOUSE_DATE_OF_DEATH_NOT_WITHIN_VALID_RANGE',
} as const

export const toYearOptions = (
  data: SocialInsuranceYearWithMonths[] | null | undefined,
) =>
  (data ?? [])
    .filter(
      (ym): ym is SocialInsuranceYearWithMonths & { year: number } =>
        ym.year != null,
    )
    .map((ym) => ({ label: String(ym.year), value: ym.year }))

export const toMonthOptions = (
  data: SocialInsuranceYearWithMonths[] | null | undefined,
  year: number | null,
  formatMessage: FormatMessage,
) =>
  (data?.find((ym) => ym.year === year)?.months ?? []).map((month) => ({
    label: formatMessage(
      coreMessages[MONTHS[month - 1] as keyof typeof coreMessages],
    ),
    value: month,
  }))
