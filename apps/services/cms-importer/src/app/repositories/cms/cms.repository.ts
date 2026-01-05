import { Injectable } from '@nestjs/common'
import { isDefined } from '@island.is/shared/utils'
import {
  ContentFields,
  ContentType,
  Entry,
  KeyValueMap,
} from 'contentful-management'
import { ManagementClientService } from './managementClient/managementClient.service'
import {
  CONTENT_TYPE,
  GENERIC_LIST_ITEM_CONTENT_TYPE,
  LOCALE,
} from '../../constants'
import { logger } from '@island.is/logging'
import { CreationType, EntryInput, EntryUpdateResult } from './cms.types'
import { ContentfulFetchResponse } from './managementClient/managementClient.types'

@Injectable()
export class CmsRepository {
  constructor(private readonly managementClient: ManagementClientService) {}

  getContentByType = async (contentType: string): Promise<Array<Entry>> => {
    const entryResponse = await this.managementClient.getEntries({
      content_type: CONTENT_TYPE,
    })

    if (entryResponse.ok) {
      return entryResponse.data.items
    } else {
      logger.warn(`cms service failed to fetch content`, {
        error: entryResponse.error,
        contentType,
      })
      return []
    }
  }

  getGenericListItemEntries = async (
    genericListId: string,
  ): Promise<Entry[]> => {
    const existingEntries = await this.managementClient.getEntries({
      content_type: GENERIC_LIST_ITEM_CONTENT_TYPE,
      select: 'fields,sys,metadata',
      links_to_entry: genericListId,
    })

    if (!existingEntries?.ok) {
      logger.warn(
        `cms service failed to fetch items from ${genericListId} entries`,
        {
          error: existingEntries.error,
        },
      )
      return []
    }

    return existingEntries.data.items.filter(isDefined)
  }

  createEntries = async (
    entries: Array<CreationType>,
    contentType: ContentType,
  ) => {
    logger.info('creating entries...')
    if (!entries.length) {
      logger.warn('no entries to create')
      return [
        {
          ok: true,
          error: 'no entries to create',
        },
      ]
    }

    const promises = entries
      .map((entry) => {
        if (!entry?.fields) {
          logger.warn('No input fields, aborting creation...')
          return
        }
        return this.createSingleEntry(contentType, entry)
      })
      .filter(isDefined)

    const promiseRes = await Promise.allSettled(promises)

    return promiseRes.map((pr) => {
      if (pr.status === 'fulfilled' && pr.value) {
        return { ok: true, entry: pr.value }
      }
      if (pr.status === 'rejected') {
        return { ok: false, error: pr.reason }
      }
      return { ok: false }
    })
  }

  private createSingleEntry = async (
    contentType: ContentType,
    input: CreationType,
  ): Promise<Entry | undefined> => {
    logger.info('creating single entry...')

    const fields = input.fields?.['fields']

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
        'genericListItem',
        input,
      )
    } catch (e) {
      logger.warn('Entry creation failed', {
        error: e,
      })
    }

    if (createdEntry?.ok) {
      logger.info('Entry created', {
        id: createdEntry.data.sys.id,
      })
      return createdEntry.data
    }

    return
  }

  updateEntries = async (
    entries: EntryInput,
    contentType: string,
  ): Promise<Array<EntryUpdateResult>> => {
    if (!entries.length) {
      logger.warn('no entries to update')
      return [
        {
          ok: 'noop',
          error: 'no entries to update',
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
          ok: 'error',
          error: contentTypeResponse.error.message,
        },
      ]
    }

    const promises = entries
      .map((entry) => {
        if (!entry?.inputFields) {
          logger.warn('No input fields to update for grant', {
            referenceId: entry.referenceId,
          })
          return
        }
        return this.updateSingleEntry(
          entry.cmsEntry,
          contentTypeResponse.data?.fields,
          entry?.inputFields,
          entry?.referenceId,
        )
      })
      .filter(isDefined)

    const promiseRes = await Promise.allSettled(promises)

    return promiseRes.map((pr) => {
      if (pr.status === 'fulfilled' && pr.value) {
        return { ok: 'success', entry: pr.value }
      }
      if (pr.status === 'rejected') {
        return { ok: 'error', error: pr.reason }
      }
      return { ok: 'unknown' }
    })
  }

  private updateSingleEntry = async (
    entry: Entry,
    contentFields: Array<ContentFields<KeyValueMap>>,
    inputFields: Array<{ key: string; value: unknown }>,
    referenceId?: string,
  ): Promise<Entry | undefined> => {
    if (entry.isUpdated()) {
      //Invalid state, log and skip
      logger.warn(`Entry has unpublished changes, please publish!`, {
        id: entry.sys.id,
        referenceId,
      })
      return Promise.reject(`Entry has unpublished changes`)
    }

    let hasChanges = false
    for (const inputField of inputFields) {
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

      if (!entry.fields[inputField.key]?.[LOCALE] && inputField.value) {
        logger.info(`Field not found in entry, updating...`, {
          inputField: inputField.key,
          id: entry.sys.id,
          referenceId,
        })
        hasChanges = true
        entry.fields[inputField.key] = {
          [LOCALE]: inputField.value,
        }
      } else if (entry.fields[inputField.key]?.[LOCALE] !== inputField.value) {
        hasChanges = true
        entry.fields[inputField.key][LOCALE] = inputField.value
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
