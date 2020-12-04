import { useRef, useState } from 'react'
import { createClient } from 'contentful-management'
import {
  accessToken,
  ContentfulLocale,
  createFieldAPI,
  getAll,
  InternalEntry,
} from '@island.is/contentful-editor'
import { Collection } from 'contentful-management/dist/typings/common-types'
import {
  ContentType,
  ContentTypeProps,
} from 'contentful-management/dist/typings/entities/content-type'
import {
  Entry,
  EntryProp,
} from 'contentful-management/dist/typings/entities/entry'
import { Asset } from 'contentful-management/dist/typings/entities/asset'

import assets from '../fixtures/assets.json'
import entries from '../fixtures/entries.json'
import types from '../fixtures/types.json'

export type Types = Collection<ContentType, ContentTypeProps>
export type Entries = Collection<Entry, EntryProp>
export type Assets = Asset

interface UseContentfulClient {
  locale: ContentfulLocale
}

const env = {
  space: '8k0h54kbe6bj',
  environment: 'master',
}

export const contentfulUrl = `https://app.contentful.com/spaces/${env.space}/entries`

export const useContentfulClient = ({ locale }: UseContentfulClient) => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const client = useRef(createClient({ accessToken: accessToken }))

  const init = async () => {
    const space = await client.current.getSpace(env.space)
    const environment = await space.getEnvironment(env.environment)
    // const types = await getAll<Types>('getContentTypes', await environment())
    // const entries = await getAll<Entries>('getEntries', await environment());
    // const assets = await getAll<Assets>('getAssets', await environment());

    const array: InternalEntry[] = entries.map((entry) => {
      if (!entry) {
        return console.error(
          `Error with this entry ${entry.sys.contentType.sys.id}`,
        )
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

    setLoading(false)

    return array
  }

  const saveEntry = async (id: string, fields: Record<string, any>) => {
    setSaving(true)

    try {
      const space = await client.current.getSpace(env.space)
      const environment = await space.getEnvironment(env.environment)
      const entryToSave = await environment.getEntry(id)

      entryToSave.fields = fields
      entryToSave.update()

      setSaving(false)

      return true
    } catch (e) {
      console.log(`Error while trying to save the entry ${e.message}`)
      setSaving(false)

      return false
    }
  }

  return {
    loading,
    saving,
    client,
    init,
    saveEntry,
  }
}
