import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/sequelize'
import { Op, UniqueConstraintError } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import type { Transaction } from 'sequelize'
import type { User } from '@island.is/auth-nest-tools'
import { isOwnedTranslationMessageId } from '@island.is/application/utils'
import { Locale } from '@island.is/shared/types'
import type { ApplicationNamespaceTranslations } from '@island.is/islandis-translations'
import { logger } from '@island.is/logging'
import type { EntryProps, PlainClientAPI } from 'contentful-management'
import { ApplicationTranslation } from './application-translation.model'
import { ApplicationTranslationLog } from './application-translation-log.model'
import { ApplicationTranslationPublish } from './application-translation-publish.model'
import { ApplicationTranslationPublishSnapshot } from './application-translation-publish-snapshot.model'
import {
  CONTENTFUL_MANAGEMENT_CLIENT,
  CONTENTFUL_NAMESPACE_CONTENT_TYPE,
} from './contentful/contentful-translation.constants'
import {
  ContentfulTranslationRow,
  DEFAULT_LOCALE,
  ENGLISH_LOCALE,
  NamespaceEntryFields,
} from './contentful/contentful-translation.types'
import {
  TranslationContentfulEntryMismatchException,
  TranslationContentfulMigrationGuardException,
  TranslationNamespaceNotExtractedException,
} from './translation-contentful.exceptions'

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

const getTranslationActors = (user: User) => {
  const subjectNationalId = user.nationalId
  const actorNationalId = user.actor?.nationalId ?? user.nationalId
  return { subjectNationalId, actorNationalId }
}

/** English falls back to Icelandic when unset, matching Contentful's own `||` fallback semantics. */
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
    @InjectConnection()
    private readonly sequelize: Sequelize,
    @Inject(CONTENTFUL_MANAGEMENT_CLIENT)
    private readonly managementClient: PlainClientAPI,
  ) {}

  /** Draft columns are intentionally excluded -- this feeds live applications, so only published values may surface here. */
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

  private async resolveNamespaceEntry(
    namespace: string,
  ): Promise<EntryProps<NamespaceEntryFields> | null> {
    try {
      return await this.managementClient.entry.get<NamespaceEntryFields>({
        entryId: namespace,
      })
    } catch (error) {
      if ((error as { name?: string })?.name !== 'NotFound') {
        throw error
      }
    }

    const matches =
      await this.managementClient.entry.getMany<NamespaceEntryFields>({
        query: {
          content_type: CONTENTFUL_NAMESPACE_CONTENT_TYPE,
          'fields.namespace': namespace,
          limit: 2,
        },
      })

    if (matches.items.length === 0) {
      return null
    }

    if (matches.items.length > 1) {
      logger.error(
        `Multiple Contentful namespace entries match fields.namespace="${namespace}"`,
      )
      throw new Error(
        `Multiple Contentful namespace entries match fields.namespace="${namespace}"`,
      )
    }

    logger.warn(
      `Namespace "${namespace}" resolved via fields.namespace fallback search (sys.id: ${matches.items[0].sys.id}) -- this should not normally happen`,
    )

    return matches.items[0]
  }

  private assertNamespaceEntry(
    entry: EntryProps<NamespaceEntryFields>,
    namespace: string,
  ): void {
    const actualNamespace = entry.fields.namespace?.[DEFAULT_LOCALE]
    if (
      entry.sys.contentType.sys.id !== CONTENTFUL_NAMESPACE_CONTENT_TYPE ||
      actualNamespace !== namespace
    ) {
      logger.error(
        `Contentful entry mismatch: expected namespace "${namespace}", got sys.id="${entry.sys.id}", contentType="${entry.sys.contentType.sys.id}", fields.namespace="${actualNamespace}"`,
      )
      throw new TranslationContentfulEntryMismatchException(namespace)
    }
  }

  private async getPublishedNamespaceFields(
    namespace: string,
    draftEntry: EntryProps<NamespaceEntryFields>,
  ): Promise<NamespaceEntryFields | null> {
    if (draftEntry.sys.publishedVersion === undefined) {
      return null
    }

    const snapshots =
      await this.managementClient.snapshot.getManyForEntry<NamespaceEntryFields>(
        { entryId: namespace, query: { limit: 5 } },
      )

    const latestPublish = snapshots.items.find(
      (item) => item.sys.snapshotType === 'publish',
    )

    return latestPublish?.snapshot.fields ?? null
  }

  private buildTranslationRows(
    namespace: string,
    draftFields: NamespaceEntryFields,
    publishedFields: NamespaceEntryFields | null,
    entrySys: { createdAt: string; updatedAt: string },
  ): ContentfulTranslationRow[] {
    const draftIs = draftFields.strings?.[DEFAULT_LOCALE] ?? {}
    const draftEn = draftFields.strings?.[ENGLISH_LOCALE] ?? {}
    const draftDefaults = draftFields.defaults?.[DEFAULT_LOCALE] ?? {}
    const publishedIs = publishedFields?.strings?.[DEFAULT_LOCALE] ?? {}
    const publishedEn = publishedFields?.strings?.[ENGLISH_LOCALE] ?? {}

    const keys = new Set([...Object.keys(draftIs), ...Object.keys(publishedIs)])

    const created = new Date(entrySys.createdAt)
    const modified = new Date(entrySys.updatedAt)

    return Array.from(keys)
      .sort()
      .map((messageKey) => {
        const valueIs = publishedIs[messageKey] ?? ''
        const valueEn = publishedEn[messageKey]
        const rawDraftIs = draftIs[messageKey]
        const rawDraftEn = draftEn[messageKey]

        const draftValueIs =
          rawDraftIs !== undefined && rawDraftIs !== valueIs ? rawDraftIs : null
        const draftValueEn =
          rawDraftEn !== undefined && rawDraftEn !== (valueEn ?? '')
            ? rawDraftEn
            : null

        return {
          id: `${namespace}:${messageKey}`,
          namespace,
          messageKey,
          valueIs,
          valueEn,
          defaultMessage: draftDefaults[messageKey]?.defaultMessage,
          isReviewed: false,
          translatedBy: undefined,
          reviewedBy: undefined,
          draftValueIs,
          draftValueEn,
          created,
          modified,
        }
      })
  }

  async getTranslationsByNamespace(
    namespace: string,
  ): Promise<ContentfulTranslationRow[]> {
    const draftEntry = await this.resolveNamespaceEntry(namespace)

    if (!draftEntry) {
      throw new TranslationNamespaceNotExtractedException(namespace)
    }

    const publishedFields = await this.getPublishedNamespaceFields(
      namespace,
      draftEntry,
    )

    return this.buildTranslationRows(
      namespace,
      draftEntry.fields,
      publishedFields,
      {
        createdAt: draftEntry.sys.createdAt as string,
        updatedAt: draftEntry.sys.updatedAt as string,
      },
    )
  }

  async getTranslationById(id: string): Promise<ApplicationTranslation | null> {
    return this.translationModel.findByPk(id)
  }

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

  private async mergeTranslationsIntoEntry(
    namespace: string,
    inputs: UpsertTranslationInput[],
  ): Promise<void> {
    const entry = await this.resolveNamespaceEntry(namespace)

    if (!entry) {
      throw new TranslationNamespaceNotExtractedException(namespace)
    }

    this.assertNamespaceEntry(entry, namespace)

    const stringsIs = { ...(entry.fields.strings?.[DEFAULT_LOCALE] ?? {}) }
    const stringsEn = { ...(entry.fields.strings?.[ENGLISH_LOCALE] ?? {}) }
    let changed = false

    for (const input of inputs) {
      if (
        input.valueIs !== undefined &&
        stringsIs[input.messageKey] !== input.valueIs
      ) {
        stringsIs[input.messageKey] = input.valueIs
        changed = true
      }
      if (
        input.valueEn !== undefined &&
        stringsEn[input.messageKey] !== input.valueEn
      ) {
        stringsEn[input.messageKey] = input.valueEn
        changed = true
      }
    }

    if (!changed) {
      return
    }

    await this.managementClient.entry.update<NamespaceEntryFields>(
      { entryId: namespace },
      {
        ...entry,
        fields: {
          ...entry.fields,
          strings: {
            ...entry.fields.strings,
            [DEFAULT_LOCALE]: stringsIs,
            [ENGLISH_LOCALE]: stringsEn,
          },
        },
      },
    )
  }

  async bulkUpsertTranslations(
    translations: UpsertTranslationInput[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    user: User,
  ): Promise<ContentfulTranslationRow[]> {
    for (const input of translations) {
      assertMessageKeyBelongsToNamespace(input.namespace, input.messageKey)
    }

    const inputsByNamespace = new Map<string, UpsertTranslationInput[]>()
    for (const input of translations) {
      const group = inputsByNamespace.get(input.namespace) ?? []
      group.push(input)
      inputsByNamespace.set(input.namespace, group)
    }

    const rows: ContentfulTranslationRow[] = []

    for (const [namespace, inputs] of inputsByNamespace) {
      await this.mergeTranslationsIntoEntry(namespace, inputs)

      const namespaceRows = await this.getTranslationsByNamespace(namespace)
      const requestedKeys = new Set(inputs.map((i) => i.messageKey))
      rows.push(
        ...namespaceRows.filter((row) => requestedKeys.has(row.messageKey)),
      )
    }

    return rows
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
   * Disabled: autosave now writes drafts directly to Contentful, so this
   * Postgres-backed implementation would publish stale data that no longer
   * matches the draft.
   */
  async publishTranslations(
    _namespace: string,
    _user: User,
    _note?: string,
  ): Promise<ApplicationTranslationPublish> {
    throw new TranslationContentfulMigrationGuardException(
      'publishTranslations',
    )
  }

  /** Disabled -- see publishTranslations. */
  async getPublishHistory(_namespace: string): Promise<PublishHistoryItem[]> {
    throw new TranslationContentfulMigrationGuardException('getPublishHistory')
  }

  /** Disabled -- see publishTranslations. */
  async rollbackToPublish(
    _publishId: string,
    _namespace: string,
    _user: User,
  ): Promise<ApplicationTranslationPublish | null> {
    throw new TranslationContentfulMigrationGuardException('rollbackToPublish')
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
