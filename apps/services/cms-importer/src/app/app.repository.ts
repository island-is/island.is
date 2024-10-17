import { Inject, Injectable } from '@nestjs/common'
import { CmsGrant } from './app.types'
import { isDefined } from '@island.is/shared/utils'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { ManagementClientService } from './modules/managementClient/managementClient.service'
import { ContentFields, Entry, KeyValueMap } from 'contentful-management'
import { CONTENT_TYPE, LOCALE } from './modules/managementClient/constants'

@Injectable()
export class AppRepository {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly managementClient: ManagementClientService,
  ) {}

  getGrants = async (): Promise<Array<CmsGrant>> => {
    const entryResponse = await this.managementClient.getEntries({
      content_type: CONTENT_TYPE,
    })

    if (entryResponse.ok) {
      return entryResponse.data.items
        .map((e) => {
          const applicationId =
            e.fields?.['grantApplicationId']?.['is-IS'] ?? -1
          const dateFrom = e.fields?.['grantDateFrom']?.['is-IS'] ?? -1
          const dateTo = e.fields?.['grantDateTo']?.['is-IS'] ?? -1
          const isOpen = e.fields?.['grantIsOpen']?.['is-IS'] ?? undefined

          if (applicationId < 0) {
            return
          }
          return {
            entry: e,
            id: e.sys.id,
            applicationId,
            dateFrom,
            dateTo,
            isOpen,
          }
        })
        .filter(isDefined)
    } else {
      this.logger.warn(`cms service failed to fetch grants`, {
        error: entryResponse.error,
      })
      return []
    }
  }

  updateGrants = async (
    grantsToUpdate: Array<{
      applicationId: string
      inputFields: Array<{ key: string; value: unknown }>
    }>,
  ) => {
    const applicationIds = grantsToUpdate.map((g) => g.applicationId)
    const entriesResponse = await this.getGrants()

    if (!entriesResponse.length) {
      this.logger.warn('no entries to update')
      return {
        ok: false,
      }
    }

    const contentTypeResponse = await this.managementClient.getContentType(
      CONTENT_TYPE,
    )

    if (!contentTypeResponse.ok) {
      this.logger.warn('cms content type fetch failed', {
        error: contentTypeResponse.error,
      })
      return {
        ok: false,
      }
    }

    const promises = entriesResponse
      .filter((i) => applicationIds.includes(i.applicationId))
      .map((i) => {
        const grant = grantsToUpdate.find(
          (g) => g.applicationId === i.applicationId,
        )
        if (!grant?.inputFields) {
          this.logger.warn('No input fields to update')
          return
        }
        return this.updateEntry(
          i.entry,
          contentTypeResponse.data?.fields,
          grant?.inputFields,
        )
          .then((entry) => {
            return { ok: true as const, entry }
          })
          .catch((error) => {
            this.logger.warn('Entry update failed', {
              id: grant.applicationId,
              error,
            })
            return { ok: false as const }
          })
      })
      .filter(isDefined)

    const promiseRes = await Promise.all(promises)

    if (promiseRes.some((pr) => !pr.ok)) {
      this.logger.warn('Some updates failed')
    }

    this.logger.debug('update successful')
    return promiseRes
  }

  private updateEntry = (
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
      }
    }
    if (hasChanges) {
      this.logger.debug('Updating values')
      return entry.update()
    }

    this.logger.debug('Values unchanged, aborting update')
    return Promise.resolve(entry)
  }
}
