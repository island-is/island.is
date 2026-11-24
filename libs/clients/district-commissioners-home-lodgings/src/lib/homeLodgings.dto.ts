import { Heimagisting } from '../../gen/fetch'

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
  homeLodging: Heimagisting,
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
