import { Injectable } from '@nestjs/common'
import { TranslatedValueDto } from '../../../translation/dto/translated-value.dto'
import { TranslationService } from '../../../translation/translation.service'
import { ApiScope } from '../../models/api-scope.model'
import { AdminScopeDTO } from '../dto/admin-scope.dto'

@Injectable()
export class AdminTranslationService {
  constructor(private readonly translationService: TranslationService) {}

  /**
   * Creates new api scope translations
   */
  async getApiScopeTranslations(keys: string[]) {
    return this.translationService.findTranslationMap('apiscope', keys)
  }

  /**
   * Maps api scope to admin api scope
   */
  mapApiScopeToAdminScopeDTO(
    apiScope: ApiScope,
    translations: Map<string, Map<string, Map<string, string>>>,
  ): AdminScopeDTO {
    return {
      ...apiScope.toDTO(),
      displayName: this.createTranslatedValueDTOs({
        key: 'displayName',
        defaultValueIS: apiScope.displayName,
        translations: translations.get(apiScope.name),
      }),
      description: this.createTranslatedValueDTOs({
        key: 'description',
        defaultValueIS: apiScope.description,
        translations: translations.get(apiScope.name),
      }),
    }
  }

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
        value: defaultValueIS ?? '',
      },
      ...Array.from(translations || [])
        .map(([locale, translation]) => ({
          locale,
          value: translation.get(key) ?? '',
        }))
        // Filter out empty translations so our sync check doesn't fail
        .filter((translation) => translation.value !== ''),
    ]
  }

  /**
   * Finds the translation by locale
   */
  findTranslationByLocale(
    translatedValueDTO: TranslatedValueDto[],
    locale: string,
  ): TranslatedValueDto | undefined {
    return translatedValueDTO.find(
      (translatedValue) => translatedValue.locale === locale,
    )
  }
}
