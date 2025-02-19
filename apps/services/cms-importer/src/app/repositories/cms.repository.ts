import { Injectable } from '@nestjs/common'
import { isDefined } from '@island.is/shared/utils'
import { ContentFields, Entry, KeyValueMap } from 'contentful-management'
import { ManagementClientService } from '../modules/managementClient/managementClient.service'
import { CmsGrant, CmsGrantInput } from '../app.types'
import { CONTENT_TYPE, LOCALE } from '../modules/managementClient/constants'
import { logger } from '@island.is/logging'

@Injectable()
export class CmsRepository {
  constructor(private readonly managementClient: ManagementClientService) {}

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

          return {
            entry: e,
            id: e.sys.id,
            referenceId,
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

  updateContentfulGrants = async (grantsToUpdate: CmsGrantInput) => {
    const referenceIds = grantsToUpdate.map((g) => g.referenceId)
    const entriesResponse = await this.getContentfulGrants()

    if (!entriesResponse.length) {
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

    const promises = entriesResponse
      .filter((i) => referenceIds.includes(i.referenceId))
      .map((i) => {
        const grant = grantsToUpdate.find(
          (g) => g.referenceId === i.referenceId,
        )
        if (!grant?.inputFields) {
          logger.warn('No input fields to update')
          return
        }
        return this.updateContentfulEntry(
          i.entry,
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

  private updateContentfulEntry = (
    entry: Entry,
    contentFields: Array<ContentFields<KeyValueMap>>,
    inputFields: Array<{ key: string; value: unknown }>,
  ) => {
    let hasChanges = false
    for (const inputField of inputFields) {
      if (contentFields.find((ctf) => ctf.id === inputField.key)) {
        if (entry.fields[inputField.key][LOCALE] !== inputField.value) {
          hasChanges = true
          entry.fields[inputField.key][LOCALE] = inputField.value
        }
      } else {
        logger.info(`Field ${inputField.key} not found`)
        Promise.reject(`Invalid field in input fields: ${inputField.key}`)
      }
    }
    if (hasChanges) {
      logger.debug('Updating values')
      return entry.update()
    }

    logger.debug('Values unchanged, aborting update')
    return Promise.resolve(undefined)
  }
}
