import { LogheimiliDTO } from '../../../gen/fetch'

export interface ResidenceEntryDto {
  city: string | null
  postalCode: string | null
  streetName: string
  municipalityCode: string | null
  houseIdentificationCode: string
  realEstateNumber: string | null
  country: string | null
  dateOfChange: Date | null
}

export const formatResidenceEntryDto = (
  entry: LogheimiliDTO | null,
): ResidenceEntryDto | null => {
  if (entry == null) {
    return null
  }
  return {
    city: entry.stadur ?? null,
    postalCode: entry.postnumer ?? null,
    streetName: entry.heimilisfang ?? '',
    municipalityCode: entry.sveitarfelagsnumer ?? null,
    houseIdentificationCode: entry.huskodi ?? '',
    realEstateNumber: entry.fasteignanumer?.toString() ?? null,
    country: entry.landakodi ?? null,
    dateOfChange: entry.breytt ?? null,
  }
}
