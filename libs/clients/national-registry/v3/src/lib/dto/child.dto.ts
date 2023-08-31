import { EinstaklingurDTOLogForeldriItem } from '../../../gen/fetch'

export interface ChildDto {
  nationalId: string | null
  name: string | null
}

export function formatChildDto(
  child?: EinstaklingurDTOLogForeldriItem | null,
): ChildDto | null {
  if (!child) {
    return null
  }

  return {
    nationalId: child.barnKennitala ?? null,
    name: child.barnNafn ?? null,
  }
}
