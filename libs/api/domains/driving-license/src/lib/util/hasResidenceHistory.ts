import {
  computeCountryResidence,
  Residence,
} from '@island.is/residence-history'
import compareDesc from 'date-fns/compareDesc'
import { ResidenceEntryDto } from '@island.is/clients/national-registry-v3-applications'

export const mapResidence = (history: ResidenceEntryDto[]): Residence[] =>
  history.reduce<Residence[]>((acc, residence) => {
    if (residence.country && residence.dateOfChange) {
      acc.push({
        address: {
          streetName: residence.streetName || undefined,
          postalCode: residence.postalCode || undefined,
          city: residence.city || undefined,
          municipalityCode: residence.municipalityCode || undefined,
        },
        country: residence.country,
        dateOfChange: new Date(residence.dateOfChange),
      })
    }
    return acc
  }, [])

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
