import { EinstaklingurDTOLogForeldriItem } from '../../../gen/fetch'

export interface ParentDto {
  nationalId: string | null
  name: string | null
  dateOfBirth: Date | null
}

export function formatParentDto(
  parent?: EinstaklingurDTOLogForeldriItem | null,
): ParentDto | null {
  if (!parent) {
    return null
  }

  return {
    nationalId: parent.barnKennitala ?? null,
    name: parent.barnNafn ?? null,
    dateOfBirth: parent.logForeldriFaedingardagur ?? null,
  }
}
