import {
  computeCountryResidence,
  Residence,
} from '@island.is/residence-history'
import compareDesc from 'date-fns/compareDesc'

interface NationalRegistryResidence {
  address: NationalRegistryAddress

  houseIdentificationCode?: string | null

  realEstateNumber?: string | null

  country?: string | null

  dateOfChange?: Date | null
}

interface NationalRegistryAddress {
  streetName: string

  postalCode?: string | null

  city?: string | null

  municipalityCode?: string | null
}

export const hasResidenceHistory = (
  history: NationalRegistryResidence[] | undefined,
) => {
  if (history) {
    const res = history.map((residence) => {
      if (residence.country && residence.dateOfChange)
        return {
          address: {
            streetAddress: residence.address.streetName || undefined,
            postalCode: residence.address.postalCode || undefined,
            city: residence.address.city || undefined,
            municipalityCode: residence.address.municipalityCode || undefined,
          },
          country: residence.country,
          dateOfChange: new Date(residence.dateOfChange),
        }
    })
    const countryResidency = computeCountryResidence(res as Residence[])
    return countryResidency ? countryResidency['IS'] >= 185 : false
  }
  return false
}

export const hasLocalResidence = (
  history: NationalRegistryResidence[] | undefined,
) => {
  if (history) {
    const res = history.map((residence) => {
      if (residence.country && residence.dateOfChange)
        return {
          address: {
            streetAddress: residence.address.streetName || undefined,
            postalCode: residence.address.postalCode || undefined,
            city: residence.address.city || undefined,
            municipalityCode: residence.address.municipalityCode || undefined,
          },
          country: residence.country,
          dateOfChange: new Date(residence.dateOfChange),
        }
    })

    const sorted = (res as Residence[]).sort(
      ({ dateOfChange: a }, { dateOfChange: b }) =>
        compareDesc(new Date(a), new Date(b)),
    )
    return sorted[0]?.country === 'IS' || false
  }
  return false
}
