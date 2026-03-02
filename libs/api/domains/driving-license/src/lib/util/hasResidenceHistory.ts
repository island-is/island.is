import {
  computeCountryResidence,
  Residence,
} from '@island.is/residence-history'
import compareDesc from 'date-fns/compareDesc'
import { ResidenceEntryDto } from '@island.is/clients/national-registry-v3-applications'

export const mapResidence = (history: ResidenceEntryDto[]): Residence[] => {
  const mappedHistory = history.map((residence) => {
    if (residence.country && residence.dateOfChange)
      return {
        address: {
          streetAddress: residence.streetName || undefined,
          postalCode: residence.postalCode || undefined,
          city: residence.city || undefined,
          municipalityCode: residence.municipalityCode || undefined,
        },
        country: residence.country,
        dateOfChange: new Date(residence.dateOfChange),
      } as Residence
  })
  return mappedHistory.filter(Boolean) as Residence[]
}

export const hasResidenceHistory = (residence: Residence[] | undefined) => {
  if (residence) {
    const countryResidency = computeCountryResidence(residence)
    return countryResidency ? countryResidency['IS'] >= 185 : false
  }
  return false
}

export const hasLocalResidence = (residence: Residence[] | undefined) => {
  if (residence) {
    const sorted = residence.sort(({ dateOfChange: a }, { dateOfChange: b }) =>
      compareDesc(new Date(a), new Date(b)),
    )
    return sorted[0]?.country === 'IS' || false
  }
  return false
}
