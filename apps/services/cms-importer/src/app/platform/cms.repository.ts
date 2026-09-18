import { Injectable } from '@nestjs/common'
import { isDefined } from '@island.is/shared/utils'
import {
  Asset,
  AssetProps,
  ContentFields,
  ContentType,
  Entry,
  KeyValueMap,
} from 'contentful-management'
import { ManagementClientService } from './managementClient/managementClient.service'
import {
  GENERIC_LIST_ITEM_CONTENT_TYPE,
  LOCALE,
  LOCALES_ARRAY,
} from '../constants'
import { logger } from '@island.is/logging'
import {
  CmsEntryOpResult,
  ContentTypeOptions,
  EntryCreationDto,
  EntryUpdateDto,
  Localized,
} from './cms.types'
import chunk from 'lodash/chunk'
import { ContentfulFetchResponse } from './managementClient/managementClient.types'

@Injectable()
export class CmsRepository {
  constructor(private readonly managementClient: ManagementClientService) {}

  /*
    Fetches every page of a query rather than relying on the management
    client's default `limit: 1000`, which silently truncates any query with
    more matches than that (`linkUrl` is already well past it). Truncation is
    dangerous here because callers use these results for dedupe, where a
    missing entry reads as "does not exist yet" and causes a duplicate to be
    created.

    Ordering is by `sys.id` — the CMA gives no stable sequence across paged
    requests without an explicit order, and unlike `sys.createdAt` an id is
    unique, so entries cannot repeat or drop across a page boundary.

    Throws on a failed page instead of returning what it has so far: an empty
    or partial array is indistinguishable from "no entries exist", which is
    precisely the duplicate-creation failure this paging exists to prevent.
    `runWorker` catches it and fails the job, which is the correct outcome —
    better a job that stops than one that silently rewrites content.
  */
  private fetchAllEntries = async (
    query: Record<string, unknown>,
    logContext: Record<string, unknown>,
  ): Promise<Array<Entry>> => {
    const pageSize = 1000
    const entries: Array<Entry> = []

    for (let skip = 0; ; skip += pageSize) {
      const entryResponse = await this.managementClient.getEntries({
        ...query,
        order: 'sys.id',
        limit: pageSize,
        skip,
      })

      if (!entryResponse.ok) {
        logger.error('cms service failed to fetch content', {
          error: entryResponse.error,
          ...logContext,
          skip,
        })
        throw new Error(
          `cms service failed to fetch content: ${JSON.stringify(logContext)}`,
        )
      }

      const { items, total } = entryResponse.data
      entries.push(...items)

      if (entries.length >= total || items.length === 0) {
        return entries
      }
    }
  }

  getContentByType = async (contentType: string): Promise<Array<Entry>> =>
    this.fetchAllEntries({ content_type: contentType }, { contentType })

  getContentByTypeAndLinkedEntry = async (
    contentType: string,
    linkedEntryId: string,
  ): Promise<Array<Entry>> =>
    this.fetchAllEntries(
      { content_type: contentType, links_to_entry: linkedEntryId },
      { contentType, linkedEntryId },
    )

  private getContentType = async (
    contentType: ContentTypeOptions,
  ): Promise<ContentType | null> => {
    const contentTypeResponse = await this.managementClient.getContentType(
      contentType,
    )

    if (!contentTypeResponse.ok) {
      logger.warn('cms content type fetch failed', {
        error: contentTypeResponse.error,
      })
      return null
    }

    return contentTypeResponse.data
  }

  getGenericListItemEntries = async (
    genericListId: string,
  ): Promise<Entry[]> => {
    const entries = await this.fetchAllEntries(
      {
        content_type: GENERIC_LIST_ITEM_CONTENT_TYPE,
        select: 'fields,sys,metadata',
        links_to_entry: genericListId,
      },
      { genericListId },
    )

    return entries.filter(isDefined)
  }

  findAssetByFileName = async (fileName: string): Promise<Asset | null> => {
    const response = await this.managementClient.getAssets({
      [`fields.file.fileName[${LOCALE}]`]: fileName,
      limit: 1,
    })
    if (!response.ok || response.data.items.length === 0) return null
    return response.data.items[0]
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

  createEntries = async (
    entries: Array<EntryCreationDto>,
    contentType: ContentTypeOptions,
    publish = false,
  ): Promise<Array<CmsEntryOpResult>> => {
    logger.info('creating entries', {
      entries: entries.length,
    })

    const cmsContentType = await this.getContentType(contentType)

    if (!cmsContentType) {
      return [
        {
          status: 'error',
          error: 'invalid content type',
        },
      ]
    }

    if (!entries.length) {
      logger.warn('no entries to create')
      return [
        {
          status: 'noop',
          error: 'no entries to create',
        },
      ]
    }

    const entryChunks = chunk(entries, 3)

    const execute = async (
      entries: EntryCreationDto[],
    ): Promise<CmsEntryOpResult[]> => {
      const promiseRes = await Promise.allSettled(
        entries
          .map((entry) => {
            if (!entry?.fields) {
              logger.info('No input fields, aborting creation...')
              return
            }
            return this.createSingleEntry(cmsContentType, entry, publish)
          })
          .filter(isDefined),
      )

      return promiseRes.map((pr) => {
        if (pr.status === 'fulfilled' && pr.value) {
          return { status: 'success' as const, entry: pr.value }
        }
        if (pr.status === 'rejected') {
          return { status: 'error' as const, error: pr.reason }
        }
        return { status: 'unknown' as const }
      })
    }

    const resultArray: CmsEntryOpResult[] = []
    //sequential execution by chunk size
    for (const entryChunk of entryChunks) {
      const response = await execute(entryChunk)
      logger.debug('execute has finished')
      resultArray.push(...response)

      //wait for 2,5 seconds before executing next chunk, for rate limit reasos
      await new Promise((resolve) => setTimeout(resolve, 2500))
    }

    return resultArray
  }

  private createSingleEntry = async (
    contentType: ContentType,
    input: EntryCreationDto,
    publish = false,
  ): Promise<Entry | undefined> => {
    logger.debug('creating single entry...', {
      id: input.fields?.['slug']?.[LOCALE],
    })

    const fields = input.fields

    for (const inputFieldKey of Object.keys(fields)) {
      if (!this.inputFieldExistsInContent(contentType.fields, inputFieldKey)) {
        logger.info(`Field not found`, {
          inputField: inputFieldKey,
        })
        return Promise.reject(`Invalid field in input fields: ${inputFieldKey}`)
      }
    }

    let createdEntry: ContentfulFetchResponse<Entry> | undefined
    try {
      createdEntry = await this.managementClient.createEntry(
        contentType.sys.id,
        input,
      )
    } catch (e) {
      logger.warn('Entry creation failed', {
        error: e,
      })
    }

    if (createdEntry?.ok) {
      logger.debug('Entry created', {
        id: createdEntry.data.sys.id,
      })
      return publish ? createdEntry.data.publish() : createdEntry.data
    }

    return
  }

  updateEntries = async (
    entries: Array<EntryUpdateDto>,
    contentType: ContentTypeOptions,
    abortIfUnpublished = true,
  ): Promise<Array<CmsEntryOpResult>> => {
    if (!entries.length) {
      logger.warn('no entries to update')
      return [
        {
          status: 'noop',
          error: 'no entries to update',
        },
      ]
    }

    const cmsContentType = await this.getContentType(contentType)

    if (!cmsContentType) {
      return [
        {
          status: 'error',
          error: 'invalid content type',
        },
      ]
    }

    const contentTypeResponse = await this.managementClient.getContentType(
      contentType,
    )

    if (!contentTypeResponse.ok) {
      logger.warn('cms content type fetch failed', {
        error: contentTypeResponse.error,
      })
      return [
        {
          status: 'error',
          error: contentTypeResponse.error.message,
        },
      ]
    }

    const entryChunks = chunk(entries, 3)

    const execute = async (
      entries: EntryUpdateDto[],
    ): Promise<CmsEntryOpResult[]> => {
      const promiseRes = await Promise.allSettled(
        entries
          .map((entry) => {
            if (!entry?.inputFields) {
              logger.warn('No input fields to update', {
                referenceId: entry.referenceId,
              })
              return
            }
            return this.updateSingleEntry(
              entry.cmsEntry,
              contentTypeResponse.data?.fields,
              entry?.inputFields,
              entry?.referenceId,
              abortIfUnpublished,
            )
          })
          .filter(isDefined),
      )

      return promiseRes.map((pr) => {
        if (pr.status === 'fulfilled' && pr.value) {
          return { status: 'success' as const, entry: pr.value }
        }
        if (pr.status === 'rejected') {
          return { status: 'error' as const, error: pr.reason }
        }
        return { status: 'unknown' as const }
      })
    }

    const resultArray: CmsEntryOpResult[] = []
    //sequential execution by chunk size
    for (const entryChunk of entryChunks) {
      const response = await execute(entryChunk)
      logger.debug('execute has finished')
      resultArray.push(...response)

      //wait for 2,5 seconds before executing next chunk, for rate limit reasos
      await new Promise((resolve) => setTimeout(resolve, 2500))
    }

    return resultArray
  }

  private updateSingleEntry = async (
    entry: Entry,
    contentFields: Array<ContentFields<KeyValueMap>>,
    inputFields: Localized<Array<{ key: string; value: unknown }>>,
    referenceId?: string,
    abortIfUnpublished = true,
  ): Promise<Entry | undefined> => {
    logger.info('updating a single entry', {
      abortIfUnpublished,
    })
    if (abortIfUnpublished && entry.isUpdated()) {
      //Invalid state, log and skip
      logger.warn(`Entry has unpublished changes, please publish!`, {
        id: entry.sys.id,
        referenceId,
      })
      return Promise.reject(`Entry has unpublished changes`)
    }

    let hasChanges = false
    for (const locale of LOCALES_ARRAY) {
      const fieldsForLocale = inputFields[locale as keyof typeof inputFields]
      if (!fieldsForLocale) {
        continue
      }

      for (const inputField of fieldsForLocale) {
        if (!this.inputFieldExistsInContent(contentFields, inputField.key)) {
          logger.info(`Field not found`, {
            inputField: inputField.key,
            id: entry.sys.id,
            referenceId,
          })
          return Promise.reject(
            `Invalid field in input fields: ${inputField.key}`,
          )
        }

        if (!entry.fields[inputField.key]?.[locale] && inputField.value) {
          logger.info(`Field not found in entry, updating...`, {
            inputField: inputField.key,
            id: entry.sys.id,
            referenceId,
          })
          hasChanges = true
          entry.fields[inputField.key] = {
            [locale]: inputField.value,
          }
        } else if (
          entry.fields[inputField.key]?.[locale] !== inputField.value
        ) {
          hasChanges = true
          entry.fields[inputField.key][locale] = inputField.value
        }
      }
    }

    const hasEntryBeenPublishedBefore = entry.isPublished()

    if (hasChanges) {
      logger.info('updating values', {
        id: entry.sys.id,
        referenceId,
      })
      const updatedEntry = await entry.update()

      logger.info('Entry updated', {
        id: updatedEntry.sys.id,
        referenceId,
      })

      //If not currently published, stop.
      if (!hasEntryBeenPublishedBefore) {
        logger.info('returning updated entry, no publication', {
          id: updatedEntry.sys.id,
          referenceId,
        })
        return updatedEntry
      } else {
        const publishedEntry = await updatedEntry.publish()
        logger.info('Entry published, returning published entry', {
          id: publishedEntry.sys.id,
          referenceId,
        })
        return publishedEntry
      }
    }
    logger.info('Values unchanged, aborting update', {
      id: entry.sys.id,
      referenceId,
    })
    return undefined
  }

  private inputFieldExistsInContent = (
    contentFields: Array<ContentFields<KeyValueMap>>,
    inputFieldKey: string,
  ) => {
    return !!contentFields.find((ctf) => ctf.id === inputFieldKey)
  }
}
