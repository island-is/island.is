import { Injectable } from '@nestjs/common'
import fs from 'fs'
import { isDefined } from '@island.is/shared/utils'
import {
  Asset,
  AssetFileProp,
  AssetProps,
  ContentFields,
  ContentType,
  Entry,
  KeyValueMap,
} from 'contentful-management'
import { logger } from '@island.is/logging'
import chunk from 'lodash/chunk'
import { ManagementClientService } from './managementClient/managementClient.service'
import { ContentfulFetchResponse } from './managementClient/managementClient.types'
import {
  GENERIC_LIST_ITEM_CONTENT_TYPE,
  LOCALE,
  LOCALES_ARRAY,
} from '../../constants'
import {
  CmsEntryOpResult,
  ContentTypeOptions,
  EntryCreationDto,
  EntryUpdateDto,
  Localized,
} from './cms.types'

@Injectable()
export class CmsRepository {
  constructor(private readonly managementClient: ManagementClientService) {}

  // ── Queries ────────────────────────────────────────────────────────────────

  getContentByType = async (contentType: string): Promise<Array<Entry>> =>
    this.fetchEntries({ content_type: contentType })

  getContentByTypeAndLinkedEntry = async (
    contentType: string,
    linkedEntryId: string,
  ): Promise<Array<Entry>> =>
    this.fetchEntries({ content_type: contentType, links_to_entry: linkedEntryId })

  getGenericListItemEntries = async (genericListId: string): Promise<Entry[]> => {
    const response = await this.managementClient.getEntries({
      content_type: GENERIC_LIST_ITEM_CONTENT_TYPE,
      select: 'fields,sys,metadata',
      links_to_entry: genericListId,
    })

    if (!response?.ok) {
      logger.warn(`cms service failed to fetch items from ${genericListId} entries`, {
        error: response.error,
      })
      return []
    }

    return response.data.items.filter(isDefined)
  }

  // ── Assets ─────────────────────────────────────────────────────────────────

  findAssetByFileName = async (fileName: string): Promise<Asset | null> => {
    const response = await this.managementClient.getAssets({
      [`fields.file.fileName[${LOCALE}]`]: fileName,
      limit: 1,
    })
    if (!response.ok || response.data.items.length === 0) return null
    return response.data.items[0]
  }

  createLocalAsset = async (
    data: Omit<AssetFileProp, 'sys'>,
    tags: string[],
    publish = false,
  ): Promise<Asset | null> => {
    const createResult = await this.managementClient.createAssetFromLocalFile(data)

    if (!createResult.ok) {
      logger.warn('Failed to create local asset', { error: createResult.error })
      return null
    }

    try {
      const asset = createResult.data
      asset.metadata = {
        tags: tags.map((id) => ({ sys: { type: 'Link' as const, linkType: 'Tag' as const, id } })),
      }
      const updated = await asset.update()
      const processed = await updated.processForAllLocales()
      return publish ? processed.publish() : processed
    } catch (error) {
      logger.error('Failed to process local asset', { error })
      return null
    }
  }

  createAsset = async (
    data: Omit<AssetProps, 'sys'>,
    publish = false,
  ): Promise<Asset | null> => {
    const createResult = await this.managementClient.createAsset(data)

    if (!createResult.ok) {
      logger.warn('Failed to create asset', { error: createResult.error })
      return null
    }

    try {
      const processed = await createResult.data.processForAllLocales()
      return publish ? processed.publish() : processed
    } catch (error) {
      logger.error('Failed to process asset', { error })
      return null
    }
  }

  // ── Entry mutations ────────────────────────────────────────────────────────

  createEntries = async (
    entries: Array<EntryCreationDto>,
    contentType: ContentTypeOptions,
    publish = false,
  ): Promise<Array<CmsEntryOpResult>> => {
    if (!entries.length) {
      logger.warn('no entries to create')
      return [{ status: 'noop', error: 'no entries to create' }]
    }

    const cmsContentType = await this.getContentType(contentType)
    if (!cmsContentType) {
      return [{ status: 'error', error: 'invalid content type' }]
    }

    logger.info('creating entries', { entries: entries.length })

    return this.executeChunked(
      entries
        .filter((e) => {
          if (!e?.fields) {
            logger.info('No input fields, skipping entry')
            return false
          }
          return true
        })
        .map((entry) => () => this.createSingleEntry(cmsContentType, entry, publish)),
    )
  }

  updateEntries = async (
    entries: Array<EntryUpdateDto>,
    contentType: ContentTypeOptions,
    abortIfUnpublished = true,
  ): Promise<Array<CmsEntryOpResult>> => {
    if (!entries.length) {
      logger.warn('no entries to update')
      return [{ status: 'noop', error: 'no entries to update' }]
    }

    const cmsContentType = await this.getContentType(contentType)
    if (!cmsContentType) {
      return [{ status: 'error', error: 'invalid content type' }]
    }

    return this.executeChunked(
      entries
        .filter((e) => {
          if (!e?.inputFields) {
            logger.warn('No input fields to update', { referenceId: e.referenceId })
            return false
          }
          return true
        })
        .map((entry) => () =>
          this.updateSingleEntry(
            entry.cmsEntry,
            cmsContentType.fields,
            entry.inputFields,
            entry.referenceId,
            abortIfUnpublished,
          ),
        ),
    )
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private fetchEntries = async (
    query: Record<string, string>,
  ): Promise<Array<Entry>> => {
    const response = await this.managementClient.getEntries(query)

    if (response.ok) return response.data.items

    logger.warn('cms service failed to fetch content', {
      error: response.error,
      ...query,
    })
    return []
  }

  private getContentType = async (
    contentType: ContentTypeOptions,
  ): Promise<ContentType | null> => {
    const response = await this.managementClient.getContentType(contentType)

    if (!response.ok) {
      logger.warn('cms content type fetch failed', { error: response.error })
      return null
    }

    return response.data
  }

  private executeChunked = async (
    tasks: Array<() => Promise<Entry | undefined>>,
  ): Promise<CmsEntryOpResult[]> => {
    const results: CmsEntryOpResult[] = []

    for (const taskChunk of chunk(tasks, 3)) {
      const settled = await Promise.allSettled(taskChunk.map((fn) => fn()))
      logger.debug('chunk executed', { size: taskChunk.length })

      results.push(
        ...settled.map((pr): CmsEntryOpResult => {
          if (pr.status === 'fulfilled' && pr.value) {
            return { status: 'success', entry: pr.value }
          }
          if (pr.status === 'rejected') {
            return { status: 'error', error: pr.reason }
          }
          return { status: 'unknown' }
        }),
      )

      await new Promise<void>((resolve) => setTimeout(resolve, 2500))
    }

    return results
  }

  private createSingleEntry = async (
    contentType: ContentType,
    input: EntryCreationDto,
    publish = false,
  ): Promise<Entry | undefined> => {
    logger.debug('creating single entry', { slug: input.fields?.['slug']?.[LOCALE] })

    for (const key of Object.keys(input.fields)) {
      if (!this.fieldExists(contentType.fields, key)) {
        logger.info('Field not found', { inputField: key })
        return Promise.reject(`Invalid field in input fields: ${key}`)
      }
    }

    let result: ContentfulFetchResponse<Entry> | undefined
    try {
      result = await this.managementClient.createEntry(contentType.sys.id, input)
    } catch (e) {
      logger.warn('Entry creation failed', { error: e })
    }

    if (result?.ok) {
      logger.debug('Entry created', { id: result.data.sys.id })
      if (publish) {
        return result.data.publish()
      }
      return result.data
    }

    if (result && !result.ok) {
      logger.warn('Entry creation returned non-ok response', {
        error: result.error,
        slug: input.fields?.['slug']?.[LOCALE],
      })
    }

    return undefined
  }

  private updateSingleEntry = async (
    entry: Entry,
    contentFields: Array<ContentFields<KeyValueMap>>,
    inputFields: Localized<Array<{ key: string; value: unknown }>>,
    referenceId?: string,
    abortIfUnpublished = true,
  ): Promise<Entry | undefined> => {
    if (abortIfUnpublished && entry.isUpdated()) {
      logger.warn('Entry has unpublished changes, please publish!', {
        id: entry.sys.id,
        referenceId,
      })
      return Promise.reject('Entry has unpublished changes')
    }

    let hasChanges = false

    for (const locale of LOCALES_ARRAY) {
      const fieldsForLocale = inputFields[locale as keyof typeof inputFields]
      if (!fieldsForLocale) continue

      for (const inputField of fieldsForLocale) {
        if (!this.fieldExists(contentFields, inputField.key)) {
          logger.info('Field not found', {
            inputField: inputField.key,
            id: entry.sys.id,
            referenceId,
          })
          return Promise.reject(`Invalid field in input fields: ${inputField.key}`)
        }

        if (!entry.fields[inputField.key]?.[locale] && inputField.value) {
          logger.info('Field not found in entry, updating...', {
            inputField: inputField.key,
            id: entry.sys.id,
            referenceId,
          })
          hasChanges = true
          entry.fields[inputField.key] = { [locale]: inputField.value }
        } else if (entry.fields[inputField.key]?.[locale] !== inputField.value) {
          hasChanges = true
          entry.fields[inputField.key][locale] = inputField.value
        }
      }
    }

    if (!hasChanges) {
      logger.info('Values unchanged, aborting update', { id: entry.sys.id, referenceId })
      return undefined
    }

    logger.info('updating values', { id: entry.sys.id, referenceId })
    const updatedEntry = await entry.update()
    logger.info('Entry updated', { id: updatedEntry.sys.id, referenceId })

    if (!entry.isPublished()) {
      return updatedEntry
    }

    const publishedEntry = await updatedEntry.publish()
    logger.info('Entry published', { id: publishedEntry.sys.id, referenceId })
    return publishedEntry
  }

  private fieldExists = (
    contentFields: Array<ContentFields<KeyValueMap>>,
    key: string,
  ): boolean => contentFields.some((f) => f.id === key)
}
