import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { Locale } from '@island.is/shared/types'
import { ApplicationTranslation } from './application-translation.model'
import { ApplicationTranslationLog } from './application-translation-log.model'

export interface TranslationStatus {
  namespace: string
  total: number
  translatedEn: number
  untranslatedEn: number
  reviewed: number
}

export interface UpsertTranslationInput {
  namespace: string
  messageKey: string
  valueIs?: string
  valueEn?: string
}

/** Columns translated_by, reviewed_by, changed_by are VARCHAR(20) in the DB. */
const MAX_ACTOR_ID_LENGTH = 20

function truncateActorId(id: string | undefined): string | undefined {
  if (id === undefined) {
    return undefined
  }
  return id.length <= MAX_ACTOR_ID_LENGTH ? id : id.slice(0, MAX_ACTOR_ID_LENGTH)
}

@Injectable()
export class ApplicationTranslationService {
  constructor(
    @InjectModel(ApplicationTranslation)
    private readonly translationModel: typeof ApplicationTranslation,
    @InjectModel(ApplicationTranslationLog)
    private readonly logModel: typeof ApplicationTranslationLog,
  ) {}

  async getTranslationsForNamespace(
    namespace: string,
    locale: Locale,
  ): Promise<Record<string, string>> {
    const valueColumn = locale === 'en' ? 'valueEn' : 'valueIs'
    const translations = await this.translationModel.findAll({
      where: { namespace },
      attributes: ['messageKey', valueColumn],
    })

    const result: Record<string, string> = {}
    for (const t of translations) {
      const value =
        locale === 'en' ? (t.valueEn ?? t.valueIs) : t.valueIs
      if (value != null && value !== '') {
        result[t.messageKey] = value
      }
    }
    return result
  }

  async getTranslationsForNamespaces(
    namespaces: string[],
    locale: Locale,
  ): Promise<Record<string, string>> {
    const valueColumn = locale === 'en' ? 'valueEn' : 'valueIs'
    const translations = await this.translationModel.findAll({
      where: { namespace: { [Op.in]: namespaces } },
      attributes: ['messageKey', valueColumn],
    })

    const result: Record<string, string> = {}
    for (const t of translations) {
      const value =
        locale === 'en' ? (t.valueEn ?? t.valueIs) : t.valueIs
      if (value != null && value !== '') {
        result[t.messageKey] = value
      }
    }
    return result
  }

  async getTranslationsByNamespace(
    namespace: string,
  ): Promise<ApplicationTranslation[]> {
    return this.translationModel.findAll({
      where: { namespace },
      order: [['messageKey', 'ASC']],
    })
  }

  async upsertTranslation(
    input: UpsertTranslationInput,
    translatedBy?: string,
  ): Promise<ApplicationTranslation> {
    const actor = truncateActorId(translatedBy)

    const existing = await this.translationModel.findOne({
      where: {
        namespace: input.namespace,
        messageKey: input.messageKey,
      },
    })

    if (existing) {
      const updates: Partial<ApplicationTranslation> = {}
      let logOldValue: string | undefined
      let logNewValue: string | undefined

      if (input.valueIs !== undefined && input.valueIs !== existing.valueIs) {
        logOldValue = existing.valueIs
        logNewValue = input.valueIs
        updates.valueIs = input.valueIs
      }
      if (input.valueEn !== undefined && input.valueEn !== existing.valueEn) {
        logOldValue = existing.valueEn ?? undefined
        logNewValue = input.valueEn
        updates.valueEn = input.valueEn
      }

      if (Object.keys(updates).length > 0) {
        if (actor) {
          updates.translatedBy = actor
        }
        updates.isReviewed = false
        await existing.update(updates)

        await this.logModel.create({
          translationId: existing.id,
          oldValue: logOldValue,
          newValue: logNewValue,
          changedBy: actor,
          action: 'update',
        })
      }

      return existing
    }

    const created = await this.translationModel.create({
      namespace: input.namespace,
      messageKey: input.messageKey,
      valueIs: input.valueIs ?? '',
      valueEn: input.valueEn,
      translatedBy: actor,
      isReviewed: false,
    })

    await this.logModel.create({
      translationId: created.id,
      newValue: input.valueEn ?? input.valueIs,
      changedBy: actor,
      action: 'create',
    })

    return created
  }

  async bulkUpsertTranslations(
    translations: UpsertTranslationInput[],
    translatedBy?: string,
  ): Promise<ApplicationTranslation[]> {
    const results: ApplicationTranslation[] = []
    for (const input of translations) {
      const result = await this.upsertTranslation(input, translatedBy)
      results.push(result)
    }
    return results
  }

  async markAsReviewed(
    id: string,
    reviewedBy: string,
  ): Promise<ApplicationTranslation | null> {
    const reviewer = truncateActorId(reviewedBy)

    const translation = await this.translationModel.findByPk(id)
    if (!translation) {
      return null
    }

    await translation.update({
      isReviewed: true,
      reviewedBy: reviewer,
    })

    await this.logModel.create({
      translationId: translation.id,
      changedBy: reviewer,
      action: 'review',
    })

    return translation
  }

  async getTranslationStatus(namespace: string): Promise<TranslationStatus> {
    const translations = await this.translationModel.findAll({
      where: { namespace },
      attributes: ['valueEn', 'isReviewed'],
    })

    const total = translations.length
    const translatedEn = translations.filter((t) => t.valueEn != null).length
    const reviewed = translations.filter((t) => t.isReviewed).length

    return {
      namespace,
      total,
      translatedEn,
      untranslatedEn: total - translatedEn,
      reviewed,
    }
  }

  async getAllNamespacesWithStatus(): Promise<TranslationStatus[]> {
    const translations = await this.translationModel.findAll({
      attributes: ['namespace', 'valueEn', 'isReviewed'],
    })

    const grouped = new Map<
      string,
      { total: number; translatedEn: number; reviewed: number }
    >()

    for (const t of translations) {
      const stats = grouped.get(t.namespace) ?? {
        total: 0,
        translatedEn: 0,
        reviewed: 0,
      }
      stats.total++
      if (t.valueEn != null) stats.translatedEn++
      if (t.isReviewed) stats.reviewed++
      grouped.set(t.namespace, stats)
    }

    return Array.from(grouped.entries()).map(([namespace, stats]) => ({
      namespace,
      total: stats.total,
      translatedEn: stats.translatedEn,
      untranslatedEn: stats.total - stats.translatedEn,
      reviewed: stats.reviewed,
    }))
  }

  async syncDefaultMessages(
    namespace: string,
    messages: Record<string, string>,
  ): Promise<{ created: number; updated: number; deprecated: number }> {
    const existing = await this.translationModel.findAll({
      where: { namespace },
    })

    const existingByKey = new Map(existing.map((t) => [t.messageKey, t]))
    const incomingKeys = new Set(Object.keys(messages))

    let created = 0
    let updated = 0
    let deprecated = 0

    for (const [key, defaultMessage] of Object.entries(messages)) {
      const existingTranslation = existingByKey.get(key)
      if (existingTranslation) {
        if (existingTranslation.defaultMessage !== defaultMessage) {
          await existingTranslation.update({ defaultMessage })
          updated++
        }
      } else {
        await this.translationModel.create({
          namespace,
          messageKey: key,
          valueIs: defaultMessage,
          defaultMessage,
          isReviewed: false,
        })
        created++
      }
    }

    for (const existingTranslation of existing) {
      if (!incomingKeys.has(existingTranslation.messageKey)) {
        deprecated++
      }
    }

    return { created, updated, deprecated }
  }
}
