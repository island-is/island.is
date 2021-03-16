import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Sequelize } from 'sequelize-typescript'
import { Translation } from '../entities/models/translation.model'
import { Language } from '../entities/models/language.model'
import { TranslationDTO } from '../entities/dto/translation.dto'
import { LanguageDTO } from '../entities/dto/language.dto'

@Injectable()
export class TranslationService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(Translation)
    private translationModel: typeof Translation,
    @InjectModel(Language)
    private langugeModel: typeof Language,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  /** Get's and counts all translations */
  async findAndCountAllTranslations(): Promise<{
    rows: Translation[]
    count: number
  } | null> {
    return this.translationModel.findAndCountAll()
  }

  /** Get's all translations */
  async findAllTranslations(): Promise<Translation[] | null> {
    return this.translationModel.findAll()
  }

  /** Get's all languages */
  async findAllLanguges(): Promise<Language[] | null> {
    return this.langugeModel.findAll()
  }

  /** Get's and counts all languages */
  async findAndCountAllLanguges(): Promise<{
    rows: Language[]
    count: number
  } | null> {
    return this.langugeModel.findAndCountAll()
  }

  /** Creates a new Translation */
  async create(translation: TranslationDTO): Promise<Translation | undefined> {
    this.logger.debug(`Creating translation for id - ${translation.key}`)

    try {
      return this.sequelize.transaction((t) => {
        return this.translationModel.create(translation)
      })
    } catch {
      this.logger.warn('Error when executing transaction, rollbacked.')
    }
  }

  async findLanguage(isoKey: string): Promise<Language | null> {
    return this.langugeModel.findByPk(isoKey)
  }

  async createLanguage(language: LanguageDTO): Promise<Language | undefined> {
    try {
      return this.sequelize.transaction((t) => {
        return this.langugeModel.create(language)
      })
    } catch {
      this.logger.warn('Error when executing transaction, rollbacked.')
    }
  }

  async updateLanguage(language: LanguageDTO): Promise<Language | null> {
    this.logger.debug(`Updating language: ${language.isoKey}`)

    await this.langugeModel.update(language, {
      where: { isoKey: language.isoKey },
    })

    return this.findLanguage(language.isoKey)
  }

  async deleteLanguage(isoKey: string): Promise<number | null> {
    this.logger.debug(`Deleting language: ${isoKey}`)

    return this.langugeModel.destroy({ where: { isoKey: isoKey } })
  }

  async findTranslation(
    language: string,
    className: string,
    key: string,
    property: string,
  ): Promise<Translation | null> {
    return this.translationModel.findOne({
      where: {
        language: language,
        className: className,
        key: key,
        property: property,
      },
    })
  }

  /** Updates an existing user identity */
  async update(translate: Translation): Promise<Translation | null> {
    this.logger.debug('Updating the translation with key: ', translate.key)

    await this.translationModel.update(
      { ...translate },
      {
        where: {
          language: translate.language,
          className: translate.className,
          key: translate.key,
          property: translate.property,
        },
      },
    )

    return this.findTranslation(
      translate.language,
      translate.className,
      translate.key,
      translate.property,
    )
  }

  /** Deletes a translation */
  async delete(translate: Translation): Promise<number> {
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
}
