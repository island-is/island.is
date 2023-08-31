import { EinstaklingurDTONafnAllt } from '../../../gen/fetch'

export interface NameDto {
  givenName: string | null
  middleName: string | null
  lastName: string | null
  nameConfirmed?: boolean | null
}

export function formatNameDto(
  name?: EinstaklingurDTONafnAllt | null,
): NameDto | null {
  if (!name) {
    return null
  }

  return {
    givenName: name.eiginNafn ?? null,
    middleName: name.milliNafn ?? null,
    lastName: name.kenniNafn ?? null,
    nameConfirmed: name.nafnStadfest === 'true' ?? null,
  }
}
