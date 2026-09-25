import {
  BadRequestException,
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import { isOwnedTranslationMessageId } from '@island.is/application/utils'
import { logger } from '@island.is/logging'
import { retry } from '@island.is/shared/utils/server'
import { Features } from '@island.is/feature-flags'
import { FeatureFlagService } from '@island.is/nest/feature-flags'
import type { EntryProps, PlainClientAPI } from 'contentful-management'
import {
  CONTENTFUL_MANAGEMENT_CLIENT,
  CONTENTFUL_NAMESPACE_CONTENT_TYPE,
  ContentfulTranslationRow,
  DEFAULT_LOCALE,
  ENGLISH_LOCALE,
  NamespaceEntryFields,
} from '@island.is/application/api/core'

const WRITE_COALESCE_MS = 3000

export interface UpsertTranslationInput {
  namespace: string
  messageKey: string
  valueIs?: string
  valueEn?: string
}

export interface PublishHistoryItem {
  id: string
  namespace: string
  publishedAt: Date
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
    @Inject(CONTENTFUL_MANAGEMENT_CLIENT)
    private readonly managementClient: PlainClientAPI,
    @Inject(FeatureFlagService)
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  private readonly pendingWrites = new Map<
    string,
    { inputs: UpsertTranslationInput[]; flush: Promise<void> }
  >()

  private async assertWritesEnabled(user: User): Promise<void> {
    const readOnly = await this.featureFlagService.getValue(
      Features.applicationTranslationWorkspaceReadOnly,
      false,
      user,
    )
    if (readOnly) {
      throw new ServiceUnavailableException(
        'Translation workspace writes are temporarily disabled',
      )
    }
  }

  private withConflictRetry<T>(fn: () => Promise<T>): Promise<T> {
    return retry(fn, {
      maxRetries: 5,
      shouldRetryOnError: (e) => e.name === 'VersionMismatch',
      logPrefix: 'ApplicationTranslationService Contentful write',
      logger,
    })
  }

  private coalescedMerge(
    namespace: string,
    inputs: UpsertTranslationInput[],
  ): Promise<void> {
    const existing = this.pendingWrites.get(namespace)
    if (existing) {
      existing.inputs.push(...inputs)
      return existing.flush
    }

    const bucket: { inputs: UpsertTranslationInput[]; flush: Promise<void> } = {
      inputs: [...inputs],
      flush: undefined as unknown as Promise<void>,
    }

    bucket.flush = new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        this.pendingWrites.delete(namespace)
        this.withConflictRetry(() =>
          this.mergeTranslationsIntoEntry(namespace, bucket.inputs),
        ).then(resolve, reject)
      }, WRITE_COALESCE_MS)
    })

    this.pendingWrites.set(namespace, bucket)
    return bucket.flush
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
      throw new BadRequestException(
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
      throw new BadRequestException(
        `Resolved Contentful entry does not match namespace ${namespace}`,
      )
    }
  }

  private async getVerifiedNamespaceEntry(
    namespace: string,
  ): Promise<EntryProps<NamespaceEntryFields>> {
    const entry = await this.resolveNamespaceEntry(namespace)

    if (!entry) {
      throw new BadRequestException(
        `Namespace "${namespace}" has not been extracted to Contentful yet; run "yarn nx run <project>:extract-strings"`,
      )
    }

    this.assertNamespaceEntry(entry, namespace)

    return entry
  }

  private static findPublishSnapshot<
    T extends {
      sys: { snapshotType?: string; createdAt: string }
      snapshot: { sys: { version: number } }
    },
  >(items: T[], expectedVersion?: number): T | undefined {
    const publishSnapshots = items
      .filter((item) => item.sys.snapshotType === 'publish')
      .sort(
        (a, b) =>
          new Date(b.sys.createdAt).getTime() -
          new Date(a.sys.createdAt).getTime(),
      )

    if (expectedVersion === undefined) {
      return publishSnapshots[0]
    }

    return publishSnapshots.find(
      (item) => item.snapshot.sys.version === expectedVersion,
    )
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

    const latestPublish = ApplicationTranslationService.findPublishSnapshot(
      snapshots.items,
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

    const keys = new Set([
      ...Object.keys(draftIs),
      ...Object.keys(draftEn),
      ...Object.keys(publishedIs),
      ...Object.keys(publishedEn),
    ])

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
    const draftEntry = await this.getVerifiedNamespaceEntry(namespace)

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

  private async mergeTranslationsIntoEntry(
    namespace: string,
    inputs: UpsertTranslationInput[],
  ): Promise<void> {
    const entry = await this.getVerifiedNamespaceEntry(namespace)

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
    user: User,
  ): Promise<ContentfulTranslationRow[]> {
    await this.assertWritesEnabled(user)

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
    const failedNamespaces: string[] = []

    for (const [namespace, inputs] of inputsByNamespace) {
      try {
        await this.coalescedMerge(namespace, inputs)

        const namespaceRows = await this.getTranslationsByNamespace(namespace)
        const requestedKeys = new Set(inputs.map((i) => i.messageKey))
        rows.push(
          ...namespaceRows.filter((row) => requestedKeys.has(row.messageKey)),
        )
      } catch (error) {
        logger.error(
          `Failed to save translations for namespace "${namespace}"`,
          error as Error,
        )
        failedNamespaces.push(namespace)
      }
    }

    if (failedNamespaces.length > 0) {
      throw new BadRequestException(
        `Failed to save translations for namespace(s): ${failedNamespaces.join(
          ', ',
        )}`,
      )
    }

    return rows
  }

  private async getLatestPublishSnapshot(
    namespace: string,
    expectedVersion?: number,
  ): Promise<PublishHistoryItem> {
    const findSnapshot = async () => {
      const snapshots =
        await this.managementClient.snapshot.getManyForEntry<NamespaceEntryFields>(
          { entryId: namespace, query: { limit: 5 } },
        )

      return ApplicationTranslationService.findPublishSnapshot(
        snapshots.items,
        expectedVersion,
      )
    }

    let latest = await findSnapshot()

    if (!latest && expectedVersion !== undefined) {
      latest = await retry(
        async () => {
          const match = await findSnapshot()
          if (!match) {
            throw new Error('CONTENTFUL_PUBLISH_SNAPSHOT_PENDING')
          }
          return match
        },
        {
          maxRetries: 8,
          retryDelayMs: 750,
          shouldRetryOnError: (e) =>
            e.message === 'CONTENTFUL_PUBLISH_SNAPSHOT_PENDING',
        },
      ).catch(() => undefined)
    }

    if (!latest) {
      throw new BadRequestException(
        `No publish snapshot found for namespace "${namespace}" immediately after publishing`,
      )
    }

    return {
      id: latest.sys.id,
      namespace,
      publishedAt: new Date(latest.sys.createdAt),
    }
  }

  async publishTranslations(
    namespace: string,
    user: User,
  ): Promise<PublishHistoryItem> {
    await this.assertWritesEnabled(user)

    const publishedEntry = await this.withConflictRetry(async () => {
      const entry = await this.getVerifiedNamespaceEntry(namespace)

      return this.managementClient.entry.publish<NamespaceEntryFields>(
        { entryId: namespace },
        entry,
      )
    })

    return this.getLatestPublishSnapshot(namespace, publishedEntry.sys.version)
  }

  async getPublishHistory(namespace: string): Promise<PublishHistoryItem[]> {
    const items: PublishHistoryItem[] = []
    const limit = 100
    let skip = 0

    for (;;) {
      const page =
        await this.managementClient.snapshot.getManyForEntry<NamespaceEntryFields>(
          { entryId: namespace, query: { select: 'sys', limit, skip } },
        )

      for (const item of page.items) {
        if (item.sys.snapshotType === 'publish') {
          items.push({
            id: item.sys.id,
            namespace,
            publishedAt: new Date(item.sys.createdAt),
          })
        }
      }

      if (page.items.length < limit) {
        break
      }
      skip += limit
    }

    return items.sort(
      (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime(),
    )
  }

  async rollbackToPublish(
    snapshotId: string,
    namespace: string,
    user: User,
  ): Promise<PublishHistoryItem | null> {
    await this.assertWritesEnabled(user)

    let targetSnapshot
    try {
      targetSnapshot =
        await this.managementClient.snapshot.getForEntry<NamespaceEntryFields>({
          entryId: namespace,
          snapshotId,
        })
    } catch (error) {
      if ((error as { name?: string })?.name === 'NotFound') {
        return null
      }
      throw error
    }

    const publishedEntry = await this.withConflictRetry(async () => {
      const entry = await this.getVerifiedNamespaceEntry(namespace)

      const targetIs =
        targetSnapshot.snapshot.fields.strings?.[DEFAULT_LOCALE] ?? {}
      const targetEn =
        targetSnapshot.snapshot.fields.strings?.[ENGLISH_LOCALE] ?? {}
      const currentIs = entry.fields.strings?.[DEFAULT_LOCALE] ?? {}
      const currentEn = entry.fields.strings?.[ENGLISH_LOCALE] ?? {}

      const keys = new Set([
        ...Object.keys(currentIs),
        ...Object.keys(currentEn),
        ...Object.keys(targetIs),
        ...Object.keys(targetEn),
      ])

      const mergedIs: Record<string, string> = {}
      const mergedEn: Record<string, string> = {}
      for (const key of keys) {
        mergedIs[key] = targetIs[key] ?? ''
        mergedEn[key] = targetEn[key] ?? ''
      }

      const updated =
        await this.managementClient.entry.update<NamespaceEntryFields>(
          { entryId: namespace },
          {
            ...entry,
            fields: {
              ...entry.fields,
              strings: {
                ...entry.fields.strings,
                [DEFAULT_LOCALE]: mergedIs,
                [ENGLISH_LOCALE]: mergedEn,
              },
            },
          },
        )

      return this.managementClient.entry.publish<NamespaceEntryFields>(
        { entryId: namespace },
        updated,
      )
    })

    return this.getLatestPublishSnapshot(namespace, publishedEntry.sys.version)
  }
}
