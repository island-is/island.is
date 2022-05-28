import { Injectable } from '@nestjs/common'
import {
  createClient as createDeliveryClient,
  ContentfulClientApi,
} from 'contentful'
import { createClient as createManagementClient } from 'contentful-management'
import { ClientAPI } from 'contentful-management/dist/typings/create-contentful-api'
import { Entry } from './types'

const space = '8k0h54kbe6bj'
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN as string

@Injectable()
export class AppRepository {
  // https://www.contentful.com/developers/docs/references/content-delivery-api/
  private deliveryClient!: ContentfulClientApi

  // https://www.contentful.com/developers/docs/references/content-management-api/
  private managementClient!: ClientAPI

  getDeliveryClient() {
    if (!this.deliveryClient)
      this.deliveryClient = createDeliveryClient({
        space,
        accessToken,
        environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
        host: process.env.CONTENTFUL_HOST || 'preview.contentful.com',
      })
    return this.deliveryClient
  }
  getManagementClient() {
    if (!this.managementClient)
      this.managementClient = createManagementClient({
        accessToken,
      })
    return this.managementClient
  }

  tagEntry(entry: Entry) {
    return entry
  }
}
