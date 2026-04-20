import { Inject, Injectable } from '@nestjs/common'
import {
  Asset,
  AssetProps,
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
    const queryWithLimit = { limit: 1000, ...query }

    return this.client
      .getSpace(SPACE_ID)
      .then((space) => space.getEnvironment(ENVIRONMENT))
      .then((environment) => environment.getEntries(queryWithLimit))
      .then((entries) => ({ ok: true as const, data: entries }))
      .catch((e) => ({
        ok: false as const,
        error: e,
      }))
  }

  getAssets = async (
    query?: QueryOptions,
    environment?: string,
  ): Promise<ContentfulFetchResponse<Collection<Asset, AssetProps>>> => {
    const queryWithLimit = { limit: 1000, ...query }

    return this.client
      .getSpace(SPACE_ID)
      .then((space) => space.getEnvironment(environment ?? ENVIRONMENT))
      .then((environment) => environment.getAssets(queryWithLimit))
      .then((assets) => ({ ok: true as const, data: assets }))
      .catch((e) => ({
        ok: false as const,
        error: e,
      }))
  }

  createEntry = async (
    contentTypeId: string,
    data: Omit<EntryProps, 'sys'>,
  ): Promise<ContentfulFetchResponse<Entry>> => {
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

  getEnvironments = async () =>
    this.client
      .getSpace(SPACE_ID)
      .then((space) => space.getEnvironments())
      .then((environments) => ({ ok: true as const, data: environments }))
      .catch((e) => ({
        ok: false as const,
        error: e,
      }))
}
