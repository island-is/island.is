import { EinstaklingurDTORikisfang } from '../../../gen/fetch'

export interface CitizenshipDto {
  name: string
  code: string | null
}

export function formatCitizenshipDto(
  citizenship?: EinstaklingurDTORikisfang | null,
): CitizenshipDto | null {
  if (!citizenship || !citizenship.rikisfangLand) {
    return null
  }

  return {
    name: citizenship.rikisfangLand,
    code: citizenship.rikisfangKodi ?? '',
  }
}
