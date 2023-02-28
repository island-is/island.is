import { Rikisfang } from '../../../gen/fetch'

export interface CitizenshipDto {
  countryCode: string
  countryName: string | null
}

export function formatCitizenshipDto(
  citizenship: Rikisfang | null | undefined,
): CitizenshipDto | null {
  if (citizenship == null) {
    return null
  }

  return {
    countryCode: citizenship.kodi,
    countryName: citizenship.land ?? null,
  }
}
