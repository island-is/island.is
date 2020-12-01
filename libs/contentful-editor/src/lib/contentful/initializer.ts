import mitt from 'mitt'
import type { Emitter, Handler } from 'mitt'
import { ContentType } from 'contentful-management/dist/typings/entities/content-type'
import { Space } from 'contentful-management/dist/typings/entities/space'
import { Collection } from 'contentful-management/dist/typings/common-types'
import {
  Entry,
  EntryProp,
} from 'contentful-management/dist/typings/entities/entry'
import {
  FieldExtensionSDK,
  FieldAPI,
} from 'contentful-ui-extensions-sdk/typings'
import { Environment } from 'contentful-management/dist/typings/entities/environment'
import {
  Asset,
} from 'contentful-management/dist/typings/entities/asset'

import assets from './assets.fixtures.json'
import entries from './entries.fixtures.json'

import { ContentfulEnv, createContentfulClient } from '../contentful/client'
import { getSdk } from '../contentful/sdk'

interface InitializerProps {
  slug: string
  contentType: string
  locale: 'en' | 'is-IS'
  env: ContentfulEnv
}

export interface MagicType {
  _entry: Collection<Entry, EntryProp>
  _space: Space
  _type: ContentType
  _sdk: FieldExtensionSDK
  fields: FieldAPI[]
}

const getAllEntries = async (
  client: Environment,
  stats: {
    length: number
    remainingToFetch: number
    items: Entry[]
  },
): Promise<Entry[]> => {
  const res = await client.getEntries({ skip: stats.length })
  const { total, skip } = res
  const remainingToFetch = total - skip

  if (remainingToFetch > 0) {
    stats.length = stats.length + res.items.length
    stats.remainingToFetch = remainingToFetch
    stats.items = stats.items.concat(res.items)

    await getAllEntries(client, stats)
  }

  return stats.items
}

const getAllAssets = async (
  client: Environment,
  stats: {
    length: number
    remainingToFetch: number
    items: Asset[]
  },
): Promise<Asset[]> => {
  const res = await client.getAssets({ skip: stats.length })
  const { total, skip } = res
  const remainingToFetch = total - skip

  if (remainingToFetch > 0) {
    stats.length = stats.length + res.items.length
    stats.remainingToFetch = remainingToFetch
    stats.items = stats.items.concat(res.items)

    await getAllAssets(client, stats)
  }

  return stats.items
}

/**
 * TODO:
 * We need to get all the entries and assets to be able to create the sdk object for contentful fields.
 * move this logic into a single/cached method somewhere so it's not fetched every time we use the edit mode
 */
export const initializer = async ({
  slug,
  contentType,
  locale,
  env,
}: InitializerProps) => {
  const { env: client, space } = await createContentfulClient(env)

  // We get the entry contentType
  const type = await client.getContentType(contentType)
  console.log('-type', type)

  // We get all the assets of the space
  // const assets = await getAllAssets(client, { length: 0, remainingToFetch: 0, items: [] })
  console.log('-assets', assets);

  // We get all the entries
  // const entries = await getAllEntries(client, { length: 0, remainingToFetch: 0, items: [] })
  console.log('-entries', entries);

  // We get the entry we want to edit from all the entries
  // TODO handle if no entry is found?
  const testEntry = entries.find(entry => entry.fields?.slug?.[locale] === slug)
  console.log('-testEntry', testEntry);

  // We get the entry content
  const entryResults = await client.getEntries({
    content_type: contentType,
    'fields.slug': slug,
    locale,
  })
  const entry = entryResults.items?.[0]
  console.log('-entry', entry)

  const yo = await client.getEntry('1kpDxialbp55AWa0ukPmud')

  // We get the data for SDK
  const sdk = getSdk(entry, entries, assets, space, type, locale, yo)

  // We merge both objects together to fit the contentful fields API
  const fields = type.fields.map((field) => {
    const emitter: Emitter = mitt()

    return {
      id: field.id,
      locale,
      type: field.type,
      required: field.required,
      validations: field.validations as Object[], // Miss-type between `contentful-management` and `contentful-ui-extensions-sdk`
      items: field.items,
      getValue: () => {
        const entryFields = entry?.fields
        const fieldName = Object.keys(entryFields).find(
          (entryField) => entryField === field.id,
        )

        if (!fieldName) {
          return undefined
        }

        return entryFields?.[fieldName]?.[locale]
      },
      setValue: (value: string) => {
        emitter.emit('setValue', value)
        emitter.emit('onValueChanged', value)

        return Promise.resolve()
      },
      removeValue: () => {
        emitter.emit('removeValue')
        emitter.emit('onValueChanged', undefined)

        return Promise.resolve()
      },
      setInvalid: () => {
        emitter.emit('setInvalid')
      },
      onValueChanged: (...args: [string, Function] | [Function]) => {
        let fn: Function

        if (typeof args[0] === 'string') {
          fn = args[1] as Function
        } else {
          fn = args[0]
        }

        emitter.on('onValueChanged', fn as Handler)

        return () => {
          emitter.off('onValueChanged', fn as Handler)
        }
      },
      onIsDisabledChanged: (fn: Function) => {
        emitter.on('onIsDisabledChanged', fn as Handler)

        return () => {
          emitter.off('onIsDisabledChanged', fn as Handler)
        }
      },
      onSchemaErrorsChanged: (fn: Function) => {
        emitter.on('onSchemaErrorsChanged', fn as Handler)

        return () => {
          emitter.off('onSchemaErrorsChanged', fn as Handler)
        }
      },
    }
  })

  // We return the original objects + our modified object
  return {
    _entry: entry,
    _type: type,
    _space: space,
    _sdk: sdk,
    fields,
  }
}
