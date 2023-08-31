import { EinstaklingurDTOHju } from '../../../gen/fetch'

export interface SpouseDto {
  nationalId: string
  name: string
  maritalStatus: string | null
  cohabitation: string | null
}

export function formatSpouseDto(
  spouse?: EinstaklingurDTOHju | null,
): SpouseDto | null {
  if (!spouse || !spouse.makiKennitala || !spouse.makiNafn) {
    return null
  }

  return {
    nationalId: spouse.makiKennitala,
    name: spouse.makiNafn,
    maritalStatus: spouse.hjuskaparstadaTexti ?? null,
    cohabitation: spouse.sambudTexti ?? null,
  }
}
