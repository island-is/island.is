import { SocialInsuranceYearWithMonths } from '@island.is/api/schema'
import { MONTHS, m as coreMessages } from '@island.is/portals/my-pages/core'
import { FormatMessage } from '@island.is/localization'

export const FORM_MAX_WIDTH = { maxWidth: 480 } as const

// Converts year-with-months data into select options, filtering out entries with no year.
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
