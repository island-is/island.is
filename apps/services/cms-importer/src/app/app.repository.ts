import { Injectable } from '@nestjs/common'
import {
  Entry,
  createClient as createManagementClient,
} from 'contentful-management'
import { ClientAPI } from 'contentful-management/dist/typings/create-contentful-api'
import { CmsGrant } from './app.types'
import { GrantType } from './dto/grantType.dto'
import { isDefined } from '@island.is/shared/utils'

const SPACE_ID = '8k0h54kbe6bj'
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master'
const CONTENT_TYPE = 'grant'

@Injectable()
export class AppRepository {
  private managementClient!: ClientAPI

  private getManagementClient = () => {
    if (!this.managementClient) {
      this.managementClient = createManagementClient({
        accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN as string,
      })
      return this.managementClient
    }
  }

  getGrants = async (): Promise<Array<CmsGrant>> => {
    const client = this.getManagementClient()
    if (!client) {
      return []
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

    return collection
  }

  updateGrant = async (
    id: string,
    inputFields: Array<{ key: string; value: unknown }>,
  ): Promise<{ ok: 'success' | 'error'; message?: string }> => {
    console.log('Updating grant...')
    const client = this.getManagementClient()
    console.log(client)
    if (!client) {
      return { ok: 'error', message: 'no clinet gotten' }
    }

    const environment = await client
      .getSpace(SPACE_ID)
      .then((space) => space.getEnvironment(ENVIRONMENT))

    const contentTypeFields = (await environment.getContentType(CONTENT_TYPE))
      .fields

    let entry: Entry | null
    try {
      entry = await environment.getEntry(id)
    } catch (e) {
      entry = null
    }

    if (!entry) {
      return { ok: 'error' }
    }

    console.log(JSON.stringify(entry))

    for (const inputField of inputFields) {
      if (contentTypeFields.find((ctf) => ctf.name === inputField.key)) {
        entry.fields[inputField.key] = inputField.value
      }
    }

    try {
      entry.update()
    } catch (e) {
      console.error('Update failed:' + e.message)
      return { ok: 'error' }
    }
    return { ok: 'success' }
  }
}
