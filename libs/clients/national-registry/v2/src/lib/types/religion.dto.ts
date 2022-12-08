import { Kodar } from '../../../gen/fetch'
import { sortAlpha } from '@island.is/shared/utils'

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

  const mapped = religions?.map((religion) => ({
    code: religion.kodi,
    name: religion.lysing ?? null,
  }))

  return mapped.sort(sortAlpha('name'))
}
