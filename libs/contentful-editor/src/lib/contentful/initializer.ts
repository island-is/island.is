import {
  ContentType,
  ContentTypeProps,
} from 'contentful-management/dist/typings/entities/content-type'
import { Collection } from 'contentful-management/dist/typings/common-types'
import {
  Entry,
  EntryProp,
} from 'contentful-management/dist/typings/entities/entry'
import { Asset } from 'contentful-management/dist/typings/entities/asset'
import { createClient } from 'contentful-management'
import {
  ContentfulLocale,
  createFieldAPI,
  getAll,
  InternalEntry,
} from '@island.is/contentful-editor'

import assets from '../fixtures/assets.json'
import entries from '../fixtures/entries.json'
import types from '../fixtures/types.json'

export type Types = Collection<ContentType, ContentTypeProps>[]
export type Entries = Collection<Entry, EntryProp>[]
export type Assets = Asset[]

export interface ContentfulEnv {
  managementAccessToken: string
  space: string
  environment: string
}

interface InitializerProps {
  locale: ContentfulLocale
}

export const env = {
  managementAccessToken: '',
  space: '8k0h54kbe6bj',
  environment: 'master',
}

export const initializer = async ({
  locale,
}: InitializerProps): Promise<InternalEntry[]> => {
  const client = createClient({ accessToken: env.managementAccessToken })
  const space = await client.getSpace(env.space)
  const environment = await space.getEnvironment(env.environment)

  // 1. We get all types
  // const types = await getAll<Collection<ContentType, ContentTypeProps>>('getContentTypes', environment);
  console.log('-fixtures types', types)

  // 2. We get all entries
  // const entries = await getAll<Collection<Entry, EntryProp>>('getEntries', environment);
  console.log('-fixtures entries', entries)

  // 3. We get all assets
  // const assets = await getAll<Asset>('getAssets', environment);
  console.log('-fixtures assets', assets)

  // 4. We have everything we need to initialize the SDK API, we now merge objects together
  return entries.map((entry) => {
    if (!entry) {
      throw new Error(`Error with this entry ${entry.sys.contentType.sys.id}`)
    }

    const entryContentType = entry.sys.contentType.sys.id
    const type = types.find((type) => type.sys.id === entryContentType)

    return createFieldAPI(
      { entry, type },
      {
        types,
        entries,
        assets,
        space,
        locale,
      },
    )
  })
}
