import { Kodar } from '../../../gen/fetch'
import { sortAlpha } from '@island.is/shared/utils'

export interface MunicipalityDto {
  code: string
  name: string | null
}

export const formatMunicipalityDto = (
  municipalities: Kodar[] | null | undefined,
): MunicipalityDto[] | null => {
  if (municipalities == null) {
    return null
  }

  const mapped = municipalities?.map((municipality) => ({
    code: municipality.kodi,
    name: municipality.lysing ?? null,
  }))

  return mapped.sort(sortAlpha('name'))
}
