import { FaedingarstadurDTO } from '../../../gen/fetch'

export interface BirthplaceDto {
  municipalityNumber: string | null
  locality: string | null
  birthdate: Date
}

export const formatBirthplaceDto = (
  birthplace: FaedingarstadurDTO | null | undefined,
): BirthplaceDto | null => {
  if (birthplace == null) {
    return null
  }

  return {
    birthdate: birthplace.faedingardagur
      ? new Date(birthplace.faedingardagur)
      : new Date(),
    locality: birthplace.stadur ?? null,
    municipalityNumber: birthplace.sveitarfelagsnumer ?? null,
  }
}
