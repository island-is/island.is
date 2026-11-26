import {
  HeimagistingarKTSetjaModel,
  HeimagistingDetailKT,
  HeimagistingKTSvar,
} from '../../gen/fetch'

export interface HomeLodgingYearDto {
  year: number
  returned: boolean
}

export interface HomeLodgingDto {
  id: string
  address: string
  /** Postal code and city as returned by Sýslumenn, e.g. "101 Reykjavík". */
  postalCode: string
  apartmentNumber?: string
  guests?: number
  rooms?: number
  years: HomeLodgingYearDto[]
}

const toNumber = (value?: string | null): number | undefined => {
  if (!value?.trim()) {
    return undefined
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

export const mapHomeLodgingDto = (
  homeLodging: HeimagistingDetailKT,
): HomeLodgingDto | null => {
  if (!homeLodging.id) {
    return null
  }

  const years = (homeLodging.years ?? []).flatMap((item) => {
    const year = toNumber(item.year)
    return year === undefined
      ? []
      : [{ year, returned: item.returned ?? false }]
  })

  return {
    id: homeLodging.id,
    address: homeLodging.address?.trim() ?? '',
    postalCode: homeLodging.postalCode?.trim() ?? '',
    apartmentNumber: homeLodging.apartmentNumber?.trim() || undefined,
    guests: toNumber(homeLodging.guests),
    rooms: toNumber(homeLodging.rooms),
    years,
  }
}

export interface HomeLodgingSubmissionDateRangeDto {
  /** ISO date (`YYYY-MM-DD`) of the check-in day. */
  from: string
  /** ISO date (`YYYY-MM-DD`) of the checkout day, which is not a night. */
  to: string
  amount?: number
}

export interface HomeLodgingSubmissionMonthDto {
  /** Month of the year, 1-12. */
  month: number
  dateRanges: HomeLodgingSubmissionDateRangeDto[]
  numberOfNights: number
  rentalIncome: number
}

export interface HomeLodgingSubmissionDto {
  homeLodgingId: string
  year: number
  advertisementUrls: string[]
  hasActiveAdvertisement: boolean
  nights: HomeLodgingSubmissionMonthDto[]
  comments?: string
}

export interface HomeLodgingSubmissionResponseDto {
  id?: string
  submittedAt?: string
  error?: string
}

const toUtcDate = (date: string): Date => new Date(`${date}T00:00:00Z`)

export const mapHomeLodgingSubmission = (
  submission: HomeLodgingSubmissionDto,
): HeimagistingarKTSetjaModel => ({
  id: submission.homeLodgingId,
  year: String(submission.year),
  urls: submission.advertisementUrls.map((url) => ({
    url,
    active: submission.hasActiveAdvertisement,
  })),
  nights: submission.nights.map((month) => ({
    month: String(month.month),
    dates: month.dateRanges.map(({ from, to, amount }) => ({
      from: toUtcDate(from),
      to: toUtcDate(to),
      amount,
    })),
    numberOfNights: month.numberOfNights,
    rentalIncome: month.rentalIncome,
  })),
  comments: submission.comments,
})

export const mapHomeLodgingSubmissionResponse = (
  response: HeimagistingKTSvar,
): HomeLodgingSubmissionResponseDto => ({
  id: response.id?.trim() || undefined,
  submittedAt:
    response.submittedAt && !Number.isNaN(response.submittedAt.getTime())
      ? response.submittedAt.toISOString()
      : undefined,
  error: response.error?.trim() || undefined,
})
