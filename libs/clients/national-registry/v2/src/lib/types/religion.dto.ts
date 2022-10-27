import { Kodar } from '../../../gen/fetch'

export interface ReligionDto {
  code: string
  name: string | null
}

export function formatReligionDto(
  religions: Kodar[] | null | undefined,
): ReligionDto[] | null {
  if (religions == null) {
    return null
  }

  return religions?.map((religion) => ({
    code: religion.kodi,
    name: religion.lysing ?? null,
  }))
}
