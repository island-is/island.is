import { Injectable } from '@nestjs/common'
import { isDefined } from '@island.is/shared/utils'
import { ContentFields, Entry, KeyValueMap } from 'contentful-management'
import { ManagementClientService } from '../modules/managementClient/managementClient.service'
import { CmsGrant, CmsGrantInput } from '../app.types'
import { CONTENT_TYPE, LOCALE } from '../constants'
import { logger } from '@island.is/logging'

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

  updateContentfulGrants = async (grants: CmsGrantInput) => {
    if (!grants.length) {
      logger.warn('no entries to update')
      return [
        {
          ok: true,
          error: 'no entries to update',
        },
      ]
    }

    const contentTypeResponse = await this.managementClient.getContentType(
      CONTENT_TYPE,
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

    const promises = grants
      .map((grant) => {
        if (!grant?.inputFields) {
          logger.warn('No input fields to update for grant', {
            referenceId: grant.referenceId,
          })
          return
        }
        return this.updateContentfulEntry(
          grant.referenceId,
          grant.cmsGrantEntry,
          contentTypeResponse.data?.fields,
          grant?.inputFields,
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

  private inputFieldExistsInContent = (
    contentFields: Array<ContentFields<KeyValueMap>>,
    inputField: { key: string; value: unknown },
  ) => {
    return !!contentFields.find((ctf) => ctf.id === inputField.key)
  }

  private updateContentfulEntry = async (
    grantReferenceId: string,
    entry: Entry,
    contentFields: Array<ContentFields<KeyValueMap>>,
    inputFields: Array<{ key: string; value: unknown }>,
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
      if (!this.inputFieldExistsInContent(contentFields, inputField)) {
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
    return Promise.resolve(undefined)
  }
}
