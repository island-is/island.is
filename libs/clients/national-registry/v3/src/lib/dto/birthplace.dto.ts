import { EinstaklingurDTOFaeding } from '../../../gen/fetch'

export interface BirthplaceDto {
  location: string
  municipalityCode: string | null
  dateOfBirth: Date | null
}

export function formatBirthplaceDto(
  birthplace?: EinstaklingurDTOFaeding | null,
): BirthplaceDto | null {
  if (!birthplace || !birthplace.faedingarStadurHeiti) {
    return null
  }

  return {
    location: birthplace.faedingarStadurHeiti,
    municipalityCode: birthplace.faedingarStadurKodi ?? null,
    dateOfBirth: birthplace.faedingarDagur
      ? new Date(birthplace.faedingarDagur)
      : null,
  }
}
