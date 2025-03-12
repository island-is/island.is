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

  private updateContentfulEntry = (
    grantReferenceId: string,
    entry: Entry,
    contentFields: Array<ContentFields<KeyValueMap>>,
    inputFields: Array<{ key: string; value: unknown }>,
  ): Promise<Entry | undefined> => {
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
      } else if (entry.fields[inputField.key][LOCALE] !== inputField.value) {
        hasChanges = true
        entry.fields[inputField.key][LOCALE] = inputField.value
      }
    }

    if (hasChanges) {
      logger.info('updating values', {
        id: entry.sys.id,
        referenceId: grantReferenceId,
      })
      return entry.update()
    }
    logger.info('Values unchanged, aborting update', {
      id: entry.sys.id,
      referenceId: grantReferenceId,
    })
    return Promise.resolve(undefined)
  }
}
