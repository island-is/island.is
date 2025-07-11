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
  PREVIOUS_RECIPIENTS_GENERIC_LIST_ID,
} from '../../constants'
import { logger } from '@island.is/logging'
import { EnergyGrantCollectionDto } from '../energyGrants/dto/energyGrantCollection.dto'
import { CmsGrant } from '../../grant-import/grant-import.types'
import { CreationType, EntryInput } from './cms.types'
import { mapEnergyGrantToGenericListItem } from './mapper'
import { ContentfulFetchResponse } from './managementClient/managementClient.types'

@Injectable()
export class CmsRepository {
  constructor(private readonly managementClient: ManagementClientService) {}

  private referenceIdPattern = /^([0-9]+)-([0-9]+)$/

  private parseReferenceId = (referenceId: string): string | null => {
    const regExResult = this.referenceIdPattern.exec(referenceId)
    if (!regExResult) {
      return null
    }
    return regExResult[2]
  }

  updatePreviousEnergyFundGrantRecipients = async (
    energyGrants: EnergyGrantCollectionDto,
  ) => {
    if (energyGrants) {
      const previousEntriesResponse = await this.managementClient.getEntries({
        content_type: GENERIC_LIST_ITEM_CONTENT_TYPE,
        select: 'fields,sys,metadata',
        links_to_entry: PREVIOUS_RECIPIENTS_GENERIC_LIST_ID,
      })

      if (!previousEntriesResponse.ok) {
        logger.warn(`cms service failed to fetch previous energy fund grants`, {
          error: previousEntriesResponse.error,
        })
        return []
      } else {
        const previousEntryNames: Array<Entry> =
          previousEntriesResponse.data.items
            .map((i) => {
              const title = i.fields['internalTitle']?.['LOCALE']

              if (!title) {
                return null
              }
              return title
            })
            .filter(isDefined)

        const newEntries: Array<CreationType> = energyGrants.grants
          .map((eg) => {
            if (
              previousEntryNames.find(
                (i) => i.fields['internalTitle']?.['LOCALE'] === eg.projectName,
              )
            ) {
              logger.info('Entry already exists, skipping.', {
                name: eg.projectName,
              })
              return null
            }

            return mapEnergyGrantToGenericListItem(eg)
          })
          .filter(isDefined)

        const contentTypeResponse = await this.managementClient.getContentType(
          GENERIC_LIST_ITEM_CONTENT_TYPE,
        )

        if (!contentTypeResponse.ok) {
          logger.warn('cms content type fetch failed', {
            error: contentTypeResponse.error,
          })
          return [
            {
              ok: false,
              error: contentTypeResponse.error.message,
            },
          ]
        } else {
          this.createEntries(newEntries, contentTypeResponse.data)
        }
      }
    }
  }

  getContentfulGrants = async (): Promise<Array<CmsGrant>> => {
    const entryResponse = await this.managementClient.getEntries({
      content_type: CONTENT_TYPE,
    })

    if (entryResponse.ok) {
      return entryResponse.data.items
        .map((e) => {
          const referenceId =
            e.fields?.['grantApplicationId']?.[LOCALE] ?? undefined
          const dateFrom = e.fields?.['grantDateFrom']?.[LOCALE] ?? undefined
          const dateTo = e.fields?.['grantDateTo']?.[LOCALE] ?? undefined
          const status = e.fields?.['grantStatus']?.[LOCALE] ?? undefined

          if (referenceId < 0 || status !== 'Automatic') {
            return
          }
          const grantId = this.parseReferenceId(referenceId)

          if (!grantId) {
            logger.warn('Invalid grant id, aborting...', {
              referenceId: grantId,
            })
            return
          }

          return {
            entry: e,
            id: e.sys.id,
            referenceId,
            grantId,
            dateFrom,
            dateTo,
          }
        })
        .filter(isDefined)
    } else {
      logger.warn(`cms service failed to fetch grants`, {
        error: entryResponse.error,
      })
      return []
    }
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
      logger.warn('belble')
    }

    logger.info('after create')

    if (createdEntry?.ok) {
      logger.info('Entry created', {
        id: createdEntry.data.sys.id,
      })
      return createdEntry.data
    }

    logger.warn('Entry creation failed', {
      error: createdEntry?.error,
    })

    return
  }

  updateEntries = async (entries: EntryInput, contentType: string) => {
    if (!entries.length) {
      logger.warn('no entries to update')
      return [
        {
          ok: true,
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
          ok: false,
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
        return { ok: true, entry: pr.value }
      }
      if (pr.status === 'rejected') {
        return { ok: false, error: pr.reason }
      }
      return { ok: false }
    })
  }

  private updateSingleEntry = async (
    entry: Entry,
    contentFields: Array<ContentFields<KeyValueMap>>,
    inputFields: Array<{ key: string; value: unknown }>,
    grantReferenceId?: string,
  ): Promise<Entry | undefined> => {
    if (entry.isUpdated()) {
      //Invalid state, log and skip
      logger.warn(`Entry has unpublished changes, please publish!`, {
        id: entry.sys.id,
        referenceId: grantReferenceId,
      })
      return Promise.reject(`Entry has unpublished changes`)
    }

    let hasChanges = false
    for (const inputField of inputFields) {
      if (!this.inputFieldExistsInContent(contentFields, inputField.key)) {
        logger.info(`Field not found`, {
          inputField: inputField.key,
          id: entry.sys.id,
          referenceId: grantReferenceId,
        })
        return Promise.reject(
          `Invalid field in input fields: ${inputField.key}`,
        )
      }

      if (!entry.fields[inputField.key]?.[LOCALE] && inputField.value) {
        logger.info(`Field not found in entry, updating...`, {
          inputField: inputField.key,
          id: entry.sys.id,
          referenceId: grantReferenceId,
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
        referenceId: grantReferenceId,
      })
      const updatedEntry = await entry.update()

      logger.info('Entry updated', {
        id: updatedEntry.sys.id,
        referenceId: grantReferenceId,
      })

      //If not currently published, stop.
      if (!hasEntryBeenPublishedBefore) {
        logger.info('returning updated entry, no publication', {
          id: updatedEntry.sys.id,
          referenceId: grantReferenceId,
        })
        return updatedEntry
      } else {
        const publishedEntry = await updatedEntry.publish()
        logger.info('Entry published, returning published entry', {
          id: publishedEntry.sys.id,
          referenceId: grantReferenceId,
        })
        return publishedEntry
      }
    }
    logger.info('Values unchanged, aborting update', {
      id: entry.sys.id,
      referenceId: grantReferenceId,
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
