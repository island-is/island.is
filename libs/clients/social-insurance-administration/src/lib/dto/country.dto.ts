import { Locale } from '@island.is/shared/types'
import { TrWebApiServicesCommonCountriesModelsCountryDto } from '../..'
import { GenericKeyValueDto } from './genericKeyValue.dto'

export interface CountryDto extends GenericKeyValueDto {
  isPartOfEes?: boolean
  isScandinavic?: boolean
}

export const mapCountryDto = (
  {
    code,
    name,
    nameIcelandic,
    isPartOfEes,
    isScandinavic,
  }: TrWebApiServicesCommonCountriesModelsCountryDto,
  locale: Locale,
): CountryDto | null => {
  const label = locale === 'en' ? name : nameIcelandic

  if (!code || !label) {
    return null
  }

  return {
    label,
    value: code,
    isPartOfEes,
    isScandinavic,
  }
}
