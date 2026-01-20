import { Locale } from '@island.is/shared/types'
import { TrWebApiServicesCommonCountriesModelsLanguageDto } from '../..'
import { GenericKeyValueDto } from './genericKeyValue.dto'

export interface LanguageDto extends GenericKeyValueDto {}

export const mapLanguageDto = (
  { code, nameEn, nameIs }: TrWebApiServicesCommonCountriesModelsLanguageDto,
  locale: Locale,
): LanguageDto | null => {
  const label = locale === 'en' ? nameEn : nameIs

  if (!code || !label) {
    return null
  }

  return {
    label,
    value: code,
  }
}
