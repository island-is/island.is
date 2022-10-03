import { Heimili } from '../../../gen/fetch'

export interface ResidenceHistoryEntryDto {
  city: string | null
  postalCode: string | null
  streetName: string
  municipalityCode: string | null
  houseIdentificationCode: string
  realEstateNumber: string | null
  country: string | null
  dateOfChange: Date | null
}

export function formatResidenceHistoryEntryDto(
  entry: Heimili,
): ResidenceHistoryEntryDto {
  return {
    city: entry.stadur ?? null,
    postalCode: entry.postnumer ?? null,
    streetName: entry.heimilisfang,
    municipalityCode: entry.sveitarfelagsnumer ?? null,
    houseIdentificationCode: entry.huskodi,
    realEstateNumber: entry.fasteignanumer ?? null,
    country: entry.landakodi ?? null,
    dateOfChange: entry.breytt ?? null,
  }
}
