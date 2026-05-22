import { SocialInsuranceYearWithMonths } from '@island.is/api/schema'

export const FORM_MAX_WIDTH = { maxWidth: 480 } as const

export const toYearOptions = (
  data: SocialInsuranceYearWithMonths[] | null | undefined,
) =>
  (data ?? [])
    .filter((ym): ym is typeof ym & { year: number } => ym.year != null)
    .map((ym) => ({ label: String(ym.year), value: ym.year }))

export const toMonthOptions = (
  data: SocialInsuranceYearWithMonths[] | null | undefined,
  year: number | null,
  lang: string,
) =>
  (data?.find((ym) => ym.year === year)?.months ?? []).map((month) => ({
    label: new Intl.DateTimeFormat(lang, { month: 'long' }).format(
      new Date(2000, month - 1),
    ),
    value: month,
  }))
