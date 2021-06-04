/* eslint-disable  @typescript-eslint/no-explicit-any */
import { LanguageDTO } from '../entities/dtos/language.dto'
import { TranslationDTO } from '../entities/dtos/translation.dto'
import { Language } from '../entities/models/language.model'
import { Translation } from '../entities/models/translation.model'
import { BaseService } from './BaseService'

export class TranslationService extends BaseService {
  /** Get's all Translations and count */
  static async findAndCountAllTranslations(
    searchString: string,
    page: number,
    count: number,
  ): Promise<{
    rows: Translation[]
    count: number
  } | null> {
    return BaseService.GET(
      `translation/translations?searchString=${encodeURIComponent(
        searchString,
      )}&page=${page}&count=${count}`,
    )
  }

  /** Get's all Languages and count */
  static async findAndCountAllLanguages(
    page: number,
    count: number,
  ): Promise<{
    rows: Language[]
    count: number
  } | null> {
    return BaseService.GET(`translation/languages?page=${page}&count=${count}`)
  }

  /** Find all languages */
  static async findAllLanguages(): Promise<Language[] | null> {
    return BaseService.GET(`translation/all-languages`)
  }

  /** Gets language by it's isoKey */
  static async findLanguage(isoKey: string): Promise<Language | null> {
    return BaseService.GET(`translation/language/${isoKey}`)
  }

  /** Adds a new Language */
  static async createLanguage(language: LanguageDTO): Promise<Language | null> {
    return BaseService.POST(`translation/language`, language)
  }

  /** Updates a an existing Language */
  static async updateLanguage(language: LanguageDTO): Promise<Language | null> {
    return BaseService.PUT(`translation/language`, language)
  }

  /** Deletes a Language */
  static async deleteLanguage(isoKey: string): Promise<number | null> {
    return BaseService.DELETE(`translation/language/${isoKey}`)
  }

  /** Adds a new Translation */
  static async createTranslation(
    translation: TranslationDTO,
  ): Promise<Translation | null> {
    return BaseService.POST(`translation/translation`, translation)
  }

  /** Updates a Translation */
  static async updateTranslation(
    translation: TranslationDTO,
  ): Promise<Translation | null> {
    return BaseService.PUT(`translation/translation`, translation)
  }

  /** Updates a Translation */
  static async deleteTranslation(
    translation: TranslationDTO,
  ): Promise<number | null> {
    return BaseService.DELETE(`translation/translation`, translation)
  }

  /** Gets a translation by it's key */
  static async findTranslation(
    language: string,
    className: string,
    property: string,
    key: string,
  ): Promise<Translation | null> {
    return BaseService.GET(
      `translation/translation/${encodeURIComponent(
        language,
      )}/${encodeURIComponent(className)}/${encodeURIComponent(
        property,
      )}/${encodeURIComponent(key)}`,
    )
  }
}
