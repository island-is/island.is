import { Injectable } from '@nestjs/common'
import { createClient as createManagementClient } from 'contentful-management'
import { ClientAPI } from 'contentful-management/dist/typings/create-contentful-api'

const SPACE_ID = '8k0h54kbe6bj'
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master'
const CONTENT_TYPE = 'grant'
const LIMIT = 10

@Injectable()
export class AppRepository {
  private managementClient!: ClientAPI

  private getManagementClient() {
    if (!this.managementClient) {
      this.managementClient = createManagementClient({
        accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN as string,
      })
      return this.managementClient
    }
  }

  async getGrants() {
    const client = this.getManagementClient()
    if (!client) {
      return
    }

    const entries = client
      .getSpace(SPACE_ID)
      .then((space) => space.getEnvironment(ENVIRONMENT))
      .then((environment) =>
        environment.getEntries({ content_type: CONTENT_TYPE, limit: LIMIT }),
      )

    return entries
  }

  async getGrant(id: string) {
    const client = this.getManagementClient()
    if (!client) {
      return
    }

    const entry = await client
      .getSpace(SPACE_ID)
      .then((space) => space.getEnvironment(ENVIRONMENT))
      .then((environment) => environment.getEntry(id))

    return entry
  }

  async updateGrant(getEntry: string) {}

  async createGrant(
    data: Array<{ field: string; value: { en: string; 'is-IS': string } }>,
  ) {
    const client = this.getManagementClient()
    if (!client) {
      return
    }

    const environment = await client
      .getSpace(SPACE_ID)
      .then((space) => space.getEnvironment(ENVIRONMENT))

    const contentType = await environment.getContentType(CONTENT_TYPE)
    const inputFields = contentType.fields.map((f) => f.name)

    const validInput = data.filter((d) => inputFields.includes(d.field))

    const entry = await environment.createEntry(CONTENT_TYPE, {
      fields: {
        ...validInput,
      },
    })

    return entry
  }
}
