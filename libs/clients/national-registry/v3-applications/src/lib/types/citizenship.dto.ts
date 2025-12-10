import { RikisfangDTO } from '../../../gen/fetch'

export interface CitizenshipDto {
  countryCode: string
  countryName: string | null
}

export const formatCitizenshipDto = (
  citizenship: RikisfangDTO | null | undefined,
): CitizenshipDto | null => {
  if (citizenship == null) {
    return null
  }

  return {
    countryCode: citizenship.kodi || '',
    countryName: citizenship.land || null,
  }
}
