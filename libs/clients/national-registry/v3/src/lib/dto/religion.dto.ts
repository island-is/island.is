import { EinstaklingurDTOTru } from '../../../gen/fetch'

export interface ReligionDto {
  name: string | null
  code: string | null
}

export function formatReligionDto(
  religion?: EinstaklingurDTOTru | null,
): ReligionDto | null {
  if (!religion) {
    return null
  }

  return {
    name: religion.trufelagHeiti ?? null,
    code: religion.trufelagKodi ?? null,
  }
}
