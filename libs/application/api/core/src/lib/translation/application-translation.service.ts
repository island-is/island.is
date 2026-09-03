import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op, UniqueConstraintError } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import type { Transaction } from 'sequelize'
import type { User } from '@island.is/auth-nest-tools'
import { isOwnedTranslationMessageId } from '@island.is/application/utils'
import { Locale } from '@island.is/shared/types'
import type { ApplicationNamespaceTranslations } from '@island.is/islandis-translations'
import { ApplicationTranslation } from './application-translation.model'
import { ApplicationTranslationLog } from './application-translation-log.model'
import { ApplicationTranslationPublish } from './application-translation-publish.model'
import { ApplicationTranslationPublishSnapshot } from './application-translation-publish-snapshot.model'

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

export interface PublishHistoryItem {
  id: string
  namespace: string
  publishedBy?: string
  actorNationalId?: string
  publishedAt: Date
  note?: string
}

/** Matches audit module: nationalId is the subject; actor is the delegating user when present. */
const getTranslationActors = (user: User) => {
  const subjectNationalId = user.nationalId
  const actorNationalId = user.actor?.nationalId ?? user.nationalId
  return { subjectNationalId, actorNationalId }
}

const publishedEnglishValue = (
  valueEn?: string | null,
  valueIs?: string | null,
): string | undefined => {
  if (valueEn != null && valueEn !== '') {
    return valueEn
  }
  if (valueIs != null && valueIs !== '') {
    return valueIs
  }
  return undefined
}

export const assertMessageKeyBelongsToNamespace = (
  namespace: string,
  messageKey: string,
): void => {
  if (!isOwnedTranslationMessageId(messageKey, [namespace])) {
    throw new BadRequestException(`messageKey must start with "${namespace}:"`)
  }
}

@Injectable()
export class ApplicationTranslationService {
  constructor(
    @InjectModel(ApplicationTranslation)
    private readonly translationModel: typeof ApplicationTranslation,
    @InjectModel(ApplicationTranslationLog)
    private readonly logModel: typeof ApplicationTranslationLog,
    @InjectModel(ApplicationTranslationPublish)
    private readonly publishModel: typeof ApplicationTranslationPublish,
    @InjectModel(ApplicationTranslationPublishSnapshot)
    private readonly snapshotModel: typeof ApplicationTranslationPublishSnapshot,
    private readonly sequelize: Sequelize,
  ) {}

  /**
   * Runtime read path -- returns published values only.
   * Draft columns are intentionally excluded.
   * Empty English falls back to Icelandic (Contentful `||` semantics).
   */
  async getTranslationsForAllLocales(
    namespace: string,
  ): Promise<ApplicationNamespaceTranslations> {
    const translations = await this.translationModel.findAll({
      where: { namespace },
      attributes: ['messageKey', 'valueIs', 'valueEn'],
    })

    const is: Record<string, string> = {}
    const en: Record<string, string> = {}
    for (const t of translations) {
      if (t.valueIs != null && t.valueIs !== '') {
        is[t.messageKey] = t.valueIs
      }
      const enValue = publishedEnglishValue(t.valueEn, t.valueIs)
      if (enValue) {
        en[t.messageKey] = enValue
      }
    }
    return { is, en }
  }

  async getTranslationsForNamespace(
    namespace: string,
    locale: Locale,
  ): Promise<Record<string, string>> {
    const translations = await this.getTranslationsForAllLocales(namespace)
    return translations[locale]
  }

  /**
   * Admin read path -- returns all columns including draft values.
   */
  async getTranslationsByNamespace(
    namespace: string,
  ): Promise<ApplicationTranslation[]> {
    return this.translationModel.findAll({
      where: { namespace },
      order: [['messageKey', 'ASC']],
    })
  }

  async getTranslationById(id: string): Promise<ApplicationTranslation | null> {
    return this.translationModel.findByPk(id)
  }

  /**
   * Saves to **draft** columns. Published values are untouched.
   */
  async upsertTranslation(
    input: UpsertTranslationInput,
    user: User,
    transaction?: Transaction,
  ): Promise<ApplicationTranslation> {
    assertMessageKeyBelongsToNamespace(input.namespace, input.messageKey)

    const existing = await this.translationModel.findOne({
      where: {
        namespace: input.namespace,
        messageKey: input.messageKey,
      },
      ...(transaction ? { transaction } : {}),
    })

    if (existing) {
      return this.applyDraftUpdate(existing, input, user, transaction)
    }

    const { actorNationalId } = getTranslationActors(user)

    try {
      const created = transaction
        ? await this.translationModel.create(
            {
              namespace: input.namespace,
              messageKey: input.messageKey,
              valueIs: '',
              draftValueIs: input.valueIs,
              draftValueEn: input.valueEn,
              translatedBy: actorNationalId,
              isReviewed: false,
            },
            { transaction },
          )
        : await this.translationModel.create({
            namespace: input.namespace,
            messageKey: input.messageKey,
            valueIs: '',
            draftValueIs: input.valueIs,
            draftValueEn: input.valueEn,
            translatedBy: actorNationalId,
            isReviewed: false,
          })

      const logPayload = {
        translationId: created.id,
        newValue: input.valueIs ?? input.valueEn,
        changedBy: actorNationalId,
        action: 'create' as const,
      }
      if (transaction) {
        await this.logModel.create(logPayload, { transaction })
      } else {
        await this.logModel.create(logPayload)
      }

      return created
    } catch (error) {
      if (!(error instanceof UniqueConstraintError)) {
        throw error
      }

      const raced = await this.translationModel.findOne({
        where: {
          namespace: input.namespace,
          messageKey: input.messageKey,
        },
        ...(transaction ? { transaction } : {}),
      })

      if (!raced) {
        throw error
      }

      return this.applyDraftUpdate(raced, input, user, transaction)
    }
  }

  async bulkUpsertTranslations(
    translations: UpsertTranslationInput[],
    user: User,
  ): Promise<ApplicationTranslation[]> {
    for (const input of translations) {
      assertMessageKeyBelongsToNamespace(input.namespace, input.messageKey)
    }

    return this.sequelize.transaction(async (transaction) => {
      const results: ApplicationTranslation[] = []
      for (const input of translations) {
        const result = await this.upsertTranslation(input, user, transaction)
        results.push(result)
      }
      return results
    })
  }

  async markAsReviewed(
    id: string,
    user: User,
  ): Promise<ApplicationTranslation | null> {
    const { actorNationalId } = getTranslationActors(user)

    const translation = await this.translationModel.findByPk(id)
    if (!translation) {
      return null
    }

    await translation.update({
      isReviewed: true,
      reviewedBy: actorNationalId,
    })

    await this.logModel.create({
      translationId: translation.id,
      changedBy: actorNationalId,
      action: 'review',
    })

    return translation
  }

  /**
   * Publish: copy draft values into published columns, snapshot the newly
   * published state (so history rows restore *this* version), then clear drafts.
   *
   * NOTE: Publish records created before this fix snapshot the *pre-publish*
   * state (values before overwriting). Rolling back to those older records will
   * restore the pre-publish values, not the values that were published at that
   * time. New publish records snapshot the correct post-publish state.
   */
  async publishTranslations(
    namespace: string,
    user: User,
    note?: string,
  ): Promise<ApplicationTranslationPublish> {
    const { subjectNationalId, actorNationalId } = getTranslationActors(user)

    return this.sequelize.transaction(async (transaction) => {
      const rows = await this.translationModel.findAll({
        where: { namespace },
        transaction,
        lock: transaction.LOCK.UPDATE,
      })

      const publish = await this.publishModel.create(
        {
          namespace,
          publishedBy: subjectNationalId,
          actorNationalId: user.actor?.nationalId,
          note,
        },
        { transaction },
      )

      for (const row of rows) {
        const hasDrafts = row.draftValueIs != null || row.draftValueEn != null
        if (!hasDrafts) {
          continue
        }

        const oldValueIs = row.valueIs
        const updates: Partial<ApplicationTranslation> = {
          draftValueIs: null,
          draftValueEn: null,
        }

        if (row.draftValueIs != null) {
          updates.valueIs = row.draftValueIs
        }
        if (row.draftValueEn != null) {
          updates.valueEn = row.draftValueEn
        }

        await row.update(updates, { transaction })

        await this.logModel.create(
          {
            translationId: row.id,
            oldValue: oldValueIs,
            newValue: row.valueIs,
            changedBy: actorNationalId,
            action: 'publish',
          },
          { transaction },
        )
      }

      const snapshotRows = rows.map((r) => ({
        publishId: publish.id,
        messageKey: r.messageKey,
        valueIs: r.valueIs,
        valueEn: r.valueEn,
      }))
      if (snapshotRows.length > 0) {
        await this.snapshotModel.bulkCreate(snapshotRows, { transaction })
      }

      return publish
    })
  }

  async getPublishHistory(namespace: string): Promise<PublishHistoryItem[]> {
    const publishes = await this.publishModel.findAll({
      where: { namespace },
      order: [['publishedAt', 'DESC']],
    })

    return publishes.map((p) => ({
      id: p.id,
      namespace: p.namespace,
      publishedBy: p.publishedBy,
      actorNationalId: p.actorNationalId,
      publishedAt: p.publishedAt,
      note: p.note,
    }))
  }

  /**
   * Rollback: restore published values from a snapshot, clear drafts,
   * and blank keys that did not exist in that version.
   */
  async rollbackToPublish(
    publishId: string,
    namespace: string,
    user: User,
  ): Promise<ApplicationTranslationPublish | null> {
    const { subjectNationalId, actorNationalId } = getTranslationActors(user)

    return this.sequelize.transaction(async (transaction) => {
      const publish = await this.publishModel.findByPk(publishId, {
        include: [ApplicationTranslationPublishSnapshot],
        transaction,
      })

      if (!publish || publish.namespace !== namespace) {
        return null
      }

      const snapshots = publish.snapshots ?? []
      const snapshotByKey = new Map(snapshots.map((s) => [s.messageKey, s]))

      const currentRows = await this.translationModel.findAll({
        where: { namespace },
        transaction,
        lock: transaction.LOCK.UPDATE,
      })

      const rollbackPublish = await this.publishModel.create(
        {
          namespace,
          publishedBy: subjectNationalId,
          actorNationalId: user.actor?.nationalId,
          note: `Rollback to version from ${publish.publishedAt.toISOString()}`,
        },
        { transaction },
      )

      const preRollbackSnapshots = currentRows.map((r) => ({
        publishId: rollbackPublish.id,
        messageKey: r.messageKey,
        valueIs: r.valueIs,
        valueEn: r.valueEn,
      }))
      if (preRollbackSnapshots.length > 0) {
        await this.snapshotModel.bulkCreate(preRollbackSnapshots, {
          transaction,
        })
      }

      const currentByKey = new Map(
        currentRows.map((row) => [row.messageKey, row]),
      )

      for (const snapshot of snapshots) {
        const row = currentByKey.get(snapshot.messageKey)
        if (row) {
          const oldValueIs = row.valueIs

          await row.update(
            {
              valueIs: snapshot.valueIs,
              valueEn: snapshot.valueEn,
              draftValueIs: null,
              draftValueEn: null,
            },
            { transaction },
          )

          await this.logModel.create(
            {
              translationId: row.id,
              oldValue: oldValueIs,
              newValue: snapshot.valueIs,
              changedBy: actorNationalId,
              action: 'rollback',
            },
            { transaction },
          )
        } else {
          const created = await this.translationModel.create(
            {
              namespace,
              messageKey: snapshot.messageKey,
              valueIs: snapshot.valueIs,
              valueEn: snapshot.valueEn,
              draftValueIs: null,
              draftValueEn: null,
              isReviewed: false,
            },
            { transaction },
          )

          await this.logModel.create(
            {
              translationId: created.id,
              newValue: snapshot.valueIs,
              changedBy: actorNationalId,
              action: 'rollback',
            },
            { transaction },
          )
        }
      }

      for (const row of currentRows) {
        if (snapshotByKey.has(row.messageKey)) {
          continue
        }

        const oldValueIs = row.valueIs
        await row.update(
          {
            valueIs: '',
            valueEn: null,
            draftValueIs: null,
            draftValueEn: null,
          },
          { transaction },
        )

        await this.logModel.create(
          {
            translationId: row.id,
            oldValue: oldValueIs,
            newValue: '',
            changedBy: actorNationalId,
            action: 'rollback',
          },
          { transaction },
        )
      }

      return rollbackPublish
    })
  }

  async getTranslationStatus(namespace: string): Promise<TranslationStatus> {
    const translations = await this.translationModel.findAll({
      where: { namespace },
      attributes: ['valueEn', 'isReviewed'],
    })

    const total = translations.length
    const translatedEn = translations.filter(
      (t) => t.valueEn != null && t.valueEn !== '',
    ).length
    const reviewed = translations.filter((t) => t.isReviewed).length

    return {
      namespace,
      total,
      translatedEn,
      untranslatedEn: total - translatedEn,
      reviewed,
    }
  }

  async getAllNamespacesWithStatus(
    namespaces?: string[],
  ): Promise<TranslationStatus[]> {
    if (namespaces && namespaces.length === 0) {
      return []
    }

    const rows = await this.translationModel.findAll({
      attributes: [
        'namespace',
        [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'total'],
        [
          this.sequelize.literal(
            `COUNT(CASE WHEN value_en IS NOT NULL AND value_en <> '' THEN 1 END)`,
          ),
          'translatedEn',
        ],
        [
          this.sequelize.literal(
            `SUM(CASE WHEN is_reviewed THEN 1 ELSE 0 END)`,
          ),
          'reviewed',
        ],
      ],
      ...(namespaces ? { where: { namespace: { [Op.in]: namespaces } } } : {}),
      group: ['namespace'],
      raw: true,
    })

    return (
      rows as unknown as Array<{
        namespace: string
        total: string | number
        translatedEn: string | number
        reviewed: string | number
      }>
    ).map((row) => {
      const total = Number(row.total)
      const translatedEn = Number(row.translatedEn)
      const reviewed = Number(row.reviewed)
      return {
        namespace: row.namespace,
        total,
        translatedEn,
        untranslatedEn: total - translatedEn,
        reviewed,
      }
    })
  }

  async syncDefaultMessages(
    namespace: string,
    messages: Record<string, string>,
  ): Promise<{ created: number; updated: number; deprecated: number }> {
    return this.sequelize.transaction(async (transaction) => {
      const existing = await this.translationModel.findAll({
        where: { namespace },
        transaction,
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
            await existingTranslation.update(
              { defaultMessage },
              { transaction },
            )
            updated++
          }
        } else {
          await this.translationModel.create(
            {
              namespace,
              messageKey: key,
              valueIs: defaultMessage,
              defaultMessage,
              isReviewed: false,
            },
            { transaction },
          )
          created++
        }
      }

      for (const existingTranslation of existing) {
        if (!incomingKeys.has(existingTranslation.messageKey)) {
          deprecated++
        }
      }

      return { created, updated, deprecated }
    })
  }

  private async applyDraftUpdate(
    existing: ApplicationTranslation,
    input: UpsertTranslationInput,
    user: User,
    transaction?: Transaction,
  ): Promise<ApplicationTranslation> {
    const { actorNationalId } = getTranslationActors(user)
    const updates: Partial<ApplicationTranslation> = {}
    let logOldValue: string | undefined
    let logNewValue: string | undefined

    if (
      input.valueIs !== undefined &&
      input.valueIs !== existing.draftValueIs
    ) {
      logOldValue = existing.draftValueIs ?? existing.valueIs
      logNewValue = input.valueIs
      updates.draftValueIs = input.valueIs
    }

    if (
      input.valueEn !== undefined &&
      input.valueEn !== existing.draftValueEn
    ) {
      logOldValue = existing.draftValueEn ?? existing.valueEn ?? undefined
      logNewValue = input.valueEn
      updates.draftValueEn = input.valueEn
    }

    if (Object.keys(updates).length > 0) {
      updates.translatedBy = actorNationalId
      updates.isReviewed = false
      if (transaction) {
        await existing.update(updates, { transaction })
        await this.logModel.create(
          {
            translationId: existing.id,
            oldValue: logOldValue,
            newValue: logNewValue,
            changedBy: actorNationalId,
            action: 'draft',
          },
          { transaction },
        )
      } else {
        await existing.update(updates)
        await this.logModel.create({
          translationId: existing.id,
          oldValue: logOldValue,
          newValue: logNewValue,
          changedBy: actorNationalId,
          action: 'draft',
        })
      }
    }

    return existing
  }
}
