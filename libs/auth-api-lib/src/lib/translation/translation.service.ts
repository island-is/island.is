import { NoContentException } from '@island.is/nest/problem'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import { Op, Transaction } from 'sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { Translation } from './models/translation.model'
import { Language } from './models/language.model'
import { TranslationDTO } from './dto/translation.dto'
import { LanguageDTO } from './dto/language.dto'

@Injectable()
export class TranslationService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(Translation)
    private translationModel: typeof Translation,
    @InjectModel(Language)
    private languageModel: typeof Language,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  /** Get's and counts all translations */
  async findAndCountAllTranslations(
    page: number,
    count: number,
  ): Promise<{
    rows: Translation[]
    count: number
  }> {
    page--
    const offset = page * count
    return this.translationModel.findAndCountAll({
      limit: count,
      offset: offset,
      order: ['language', 'className', 'key', 'property'],
    })
  }

  /** Find clients by searh string and returns with paging */
  async findTranslations(searchString: string, page: number, count: number) {
    if (!searchString) {
      throw new BadRequestException('Search String must be provided')
    }
    page--
    const offset = page * count
    searchString = searchString.trim()

    return this.translationModel.findAndCountAll({
      where: {
        value: { [Op.like]: searchString },
      },
      limit: count,
      offset: offset,
      distinct: true,
      order: ['language', 'className', 'key', 'property'],
    })
  }

  /** Get's all translations */
  async findAllTranslations(): Promise<Translation[]> {
    return this.translationModel.findAll()
  }

  /** Get's all languages */
  async findAllLanguages(): Promise<Language[]> {
    return this.languageModel.findAll()
  }

  /** Get's and counts all languages */
  async findAndCountAllLanguages(
    page: number,
    count: number,
  ): Promise<{
    rows: Language[]
    count: number
  }> {
    page--
    const offset = page * count
    return this.languageModel.findAndCountAll({
      limit: count,
      offset: offset,
      distinct: true,
      order: ['isoKey'],
    })
  }

  /** Adds a new Language */
  async createLanguage(language: LanguageDTO): Promise<Language> {
    return this.languageModel.create(language)
  }

  /** Updates an existing Language */
  async updateLanguage(languageData: LanguageDTO): Promise<Language> {
    this.logger.debug(`Updating language: ${languageData.isoKey}`)

    const language = await this.findLanguage(languageData.isoKey)
    if (!language) {
      throw new NoContentException()
    }

    return language.update(languageData)
  }

  /** Deletes a language */
  async deleteLanguage(isoKey: string): Promise<number> {
    this.logger.debug(`Deleting language: ${isoKey}`)

    return this.languageModel.destroy({ where: { isoKey: isoKey } })
  }

  /** Finds a translation by it's key */
  async findTranslation(
    language: string,
    className: string,
    property: string,
    key: string,
    transaction?: Transaction,
  ): Promise<Translation | null> {
    return this.translationModel.findOne({
      where: {
        language: language,
        className: className,
        key: key,
        property: property,
      },
      transaction,
    })
  }

  /** Creates a new Translation */
  async createTranslation(translation: TranslationDTO): Promise<Translation> {
    this.logger.debug(`Creating translation for id - ${translation.key}`)
    return this.translationModel.create(translation)
  }

  async findLanguage(isoKey: string): Promise<Language | null> {
    return this.languageModel.findByPk(isoKey)
  }

  /** Updates an existing translation */
  async updateTranslation(
    translationData: TranslationDTO,
  ): Promise<Translation> {
    this.logger.debug(
      'Updating the translation with key: ',
      translationData.key,
    )

    const translation = await this.findTranslation(
      translationData.language,
      translationData.className,
      translationData.property,
      translationData.key,
    )
    if (!translation) {
      throw new NoContentException()
    }

    return translation.update({ ...translationData })
  }

  /** Upserts an translation */
  async upsertTranslation(
    translationData: TranslationDTO,
    transaction?: Transaction,
  ): Promise<Translation> {
    this.logger.debug(
      'Upserting the translation with key: ',
      translationData.key,
    )

    const language = await this.languageModel.findByPk(
      translationData.language,
      { transaction },
    )
    if (!language) {
      throw new BadRequestException(
        `Language ${translationData.language} does not exist for translation`,
      )
    }

    const [translation] = await this.translationModel.upsert(translationData, {
      fields: ['value'],
      transaction,
    })

    return translation
  }

  /** Deletes a translation */
  async deleteTranslation(translate: TranslationDTO): Promise<number> {
    this.logger.debug(`Deleting translation with key: ${translate.key}`)

    if (!translate) {
      throw new BadRequestException('translate object must be provided')
    }

    return await this.translationModel.destroy({
      where: {
        language: translate.language,
        className: translate.className,
        key: translate.key,
        property: translate.property,
      },
    })
  }

  /**
   * Returns a map of translations for a given set of class instances for all languages.
   */
  async findTranslationMap(
    className: string,
    keys: string[],
    useMaster?: boolean,
  ): Promise<Map<string, Map<string, Map<string, string>>>>
  /**
   * Returns a map of translations for a given set of class instances for specific language.
   */
  async findTranslationMap(
    className: string,
    keys: string[],
    useMaster: boolean,
    language: string,
  ): Promise<Map<string, Map<string, string>>>
  async findTranslationMap(
    className: string,
    keys: string[],
    useMaster = false,
    language?: string,
  ): Promise<
    | Map<string, Map<string, string>>
    | Map<string, Map<string, Map<string, string>>>
  > {
    if (keys.length === 0) {
      return new Map()
    }

    const translations = await this.translationModel.findAll({
      useMaster,
      where: {
        ...(language && { language }),
        className,
        key: keys,
      },
    })

    return translations.reduce((acc, translation) => {
      if (!acc.has(translation.key)) {
        acc.set(translation.key, new Map())
      }

      let translationMap
      if (!language) {
        if (!acc.get(translation.key).has(translation.language)) {
          acc.get(translation.key).set(translation.language, new Map())
        }
        translationMap = acc.get(translation.key).get(translation.language)
      } else {
        translationMap = acc.get(translation.key)
      }

      if (translation.value) {
        translationMap.set(translation.property, translation.value)
      }
      return acc
    }, new Map())
  }
}
