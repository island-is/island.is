import { Inject, Injectable } from '@nestjs/common'
import {
  ClientAPI,
  Collection,
  ContentType,
  Entry,
  EntryProps,
  KeyValueMap,
  QueryOptions,
} from 'contentful-management'
import { ContentfulFetchResponse } from './managementClient.types'
import { SPACE_ID, ENVIRONMENT } from '../../../constants'
import { logger } from '@island.is/logging'

@Injectable()
export class ManagementClientService {
  constructor(
    @Inject('contentful-management-client')
    private readonly client: ClientAPI,
  ) {}

  getEntries = async (
    query?: QueryOptions,
  ): Promise<
    ContentfulFetchResponse<Collection<Entry, EntryProps<KeyValueMap>>>
  > => {
    const space = await this.client.getSpace(SPACE_ID)
    logger.warn('client', this.client)
    logger.warn('space', space)

    return this.client
      .getSpace(SPACE_ID)
      .then((space) => space.getEnvironment(ENVIRONMENT))
      .then((environment) => environment.getEntries(query))
      .then((entries) => ({ ok: true as const, data: entries }))
      .catch((e) => ({
        ok: false as const,
        error: e,
      }))
  }

  createEntry = async (
    contentTypeId: string,
    data: Omit<EntryProps, 'sys'>,
  ): Promise<ContentfulFetchResponse<Entry>> => {
    const space = await this.client.getSpace(SPACE_ID)
    logger.warn('client', this.client)
    logger.warn('space', space)

    return this.client
      .getSpace(SPACE_ID)
      .then((space) => space.getEnvironment(ENVIRONMENT))
      .then((env) => env.createEntry(contentTypeId, data))
      .then((entry) => ({ ok: true as const, data: entry }))
      .catch((e) => ({
        ok: false as const,
        error: e,
      }))
  }

  getEntry = async (entryId: string): Promise<ContentfulFetchResponse<Entry>> =>
    this.client
      .getSpace(SPACE_ID)
      .then((space) => space.getEnvironment(ENVIRONMENT))
      .then((environment) => environment.getEntry(entryId))
      .then((entry) => ({ ok: true as const, data: entry }))
      .catch((e) => ({
        ok: false as const,
        error: e,
      }))

  getContentType = async (
    contentType: string,
  ): Promise<ContentfulFetchResponse<ContentType>> =>
    this.client
      .getSpace(SPACE_ID)
      .then((space) => space.getEnvironment(ENVIRONMENT))
      .then((env) => env.getContentType(contentType))
      .then((contentType) => ({ ok: true as const, data: contentType }))
      .catch((e) => ({
        ok: false as const,
        error: e,
      }))
}
