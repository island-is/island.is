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
    rows: any[]
    count: number
  } | null> {
    return BaseService.GET(
      `translation/translations?searchString=${searchString}&page=${page}&count=${count}`,
    )
  }

  /** Get's all Languages and count */
  static async findAndCountAllLanguages(
    page: number,
    count: number,
  ): Promise<{
    rows: any[]
    count: number
  } | null> {
    return BaseService.GET(`translation/languages?page=${page}&count=${count}`)
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
    return BaseService.POST(`translation`, translation)
  }

  /** Updates a Translation */
  static async updateTranslation(
    translation: TranslationDTO,
  ): Promise<Translation | null> {
    return BaseService.PUT(`translation`, translation)
  }

  /** Updates a Translation */
  static async deleteTranslation(
    translation: TranslationDTO,
  ): Promise<number | null> {
    return BaseService.DELETE(`translation`, translation)
  }
}
