import { Injectable } from '@nestjs/common'
import { TranslatedValueDto } from '../../../translation/dto/translated-value.dto'

@Injectable()
export class AdminTranslationService {
  /**
   * Creates translations value dto from key and translations
   * @param key - Translation unique key
   * @param defaultValueIS - Default value in icelandic
   * @param translations - Translations map that has pre-selected domain, i.e. class_name
   */
  createTranslatedValueDTOs({
    key,
    defaultValueIS,
    translations,
  }: {
    key: string
    defaultValueIS: string
    translations?: Map<string, Map<string, string>>
  }): TranslatedValueDto[] {
    return [
      {
        locale: 'is',
        value: defaultValueIS,
      },
      ...Array.from(translations || []).map(([locale, translation]) => ({
        locale,
        value: translation.get(key) ?? '',
      })),
    ]
  }
}
