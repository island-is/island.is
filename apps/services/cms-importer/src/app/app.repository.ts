import { Inject, Injectable } from '@nestjs/common'
import {
  createClient as createManagementClient,
  ClientAPI,
  Organization,
  Entry,
} from 'contentful-management'
import { CmsGrant } from './app.types'
import { isDefined } from '@island.is/shared/utils'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'

const SPACE_ID = '8k0h54kbe6bj'
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master'
const CONTENT_TYPE = 'grant'

@Injectable()
export class AppRepository {
  constructor(@Inject(LOGGER_PROVIDER) private readonly logger: Logger) {}

  private managementClient!: ClientAPI

  private getManagementClient() {
    if (!this.managementClient)
      this.managementClient = createManagementClient({
        accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN as string,
      })
    return this.managementClient
  }

  getGrants = async (): Promise<Array<CmsGrant>> => {
    const client = this.getManagementClient()
    if (!client) {
      this.logger.warn('no client found')
      return []
    }

    const collection: Array<{ id: string; applicationId: string }> =
      await client
        .getSpace(SPACE_ID)
        .then((space) => space.getEnvironment(ENVIRONMENT))
        .then((environment) =>
          environment.getEntries({
            content_type: CONTENT_TYPE,
            select:
              'sys.id,fields.grantApplicationId,grantDateFrom,grantDateTo,grantIsOpen',
          }),
        )
        .then((entry) => {
          return entry.items
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
                id: e.sys.id,
                applicationId,
                dateFrom,
                dateTo,
                isOpen,
              }
            })
            .filter(isDefined)
        })
    return collection
  }

  updateGrant = async (
    id: string,
    inputFields: Array<{ key: string; value: unknown }>,
  ): Promise<{ ok: 'success' | 'error'; message?: string }> => {
    const client = this.getManagementClient()
    if (!client) {
      return { ok: 'error', message: 'no client gotten' }
    }

    const collection: Array<{ id: string; applicationId: string }> =
      await client
        .getSpace(SPACE_ID)
        .then((space) => space.getEnvironment(ENVIRONMENT))
        .then((environment) =>
          environment.getEntries({
            content_type: CONTENT_TYPE,
            select: 'sys.id,fields.grantApplicationId',
          }),
        )
        .then((entry) => {
          return entry.items
            .map((e) => {
              const applicationId =
                e.fields?.['grantApplicationId']?.['is-IS'] ?? -1
              if (applicationId < 0) {
                return
              }
              return {
                id: e.sys.id,
                applicationId,
              }
            })
            .filter(isDefined)
        })
    this.logger.warn('collection', collection)

    return { ok: 'success', message: 'hello frends' }
    /*
    const environment = await client
      .getSpace(SPACE_ID)
      .then((space) => space.getEnvironment(ENVIRONMENT))
      .catch(() => null)

    if (!environment) {
      return {
        ok: 'error',
        message: `error while fetching contentful environment`,
      }
    }

    const contentType = await environment
      .getContentType(CONTENT_TYPE)
      .catch(() => null)

    if (!contentType) {
      return {
        ok: 'error',
        message: `error while fetching contentful content type`,
      }
    }

    const contentTypeFields = contentType?.fields

    let entry: Entry | null
    try {
      entry = await environment.getEntry(id)
    } catch (e) {
      return {
        ok: 'error',
        message: `error while fetching contentful entry ${id}`,
      }
    }

    if (!entry) {
      return { ok: 'error', message: `no entry found for ${id}` }
    }
    for (const inputField of inputFields) {
      if (contentTypeFields.find((ctf) => ctf.name === inputField.key)) {
        entry.fields[inputField.key] = inputField.value
      }
    }

    try {
      entry.update()
    } catch (e) {
      return { ok: 'error', message: e.message }
    }
    return { ok: 'success', message: JSON.stringify(entry) } */
  }
}
