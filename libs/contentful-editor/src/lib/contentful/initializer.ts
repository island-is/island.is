import mitt from 'mitt'
import type { Emitter, Handler } from 'mitt'
import { ContentType } from 'contentful-management/dist/typings/entities/content-type'
import { Space } from 'contentful-management/dist/typings/entities/space'
import { Collection } from 'contentful-management/dist/typings/common-types'
import { Entry, EntryProp } from 'contentful-management/dist/typings/entities/entry'
import { BaseExtensionSDK, FieldAPI } from 'contentful-ui-extensions-sdk/typings'
import { Environment } from 'contentful-management/dist/typings/entities/environment'
import { Asset, AssetProps } from 'contentful-management/dist/typings/entities/asset'

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
  _sdk: BaseExtensionSDK
  fields: FieldAPI[]
}

const getAllAssets = async (client: Environment, stats: {
  length: number
  remainingToFetch: number
  items: Asset[]
}) => {
  const res = await client.getAssets({ skip: stats.length });
  const { total, skip } = res;
  const remainingToFetch = total - skip;

  if (remainingToFetch > 0) {
    stats.length = stats.length + res.items.length;
    stats.remainingToFetch = remainingToFetch;
    stats.items = stats.items.concat(res.items)

    return await getAllAssets(client, stats);
  }

  return stats.items;
};

export const initializer = async ({
  slug,
  contentType,
  locale,
  env,
}: InitializerProps) => {
  const { env: client, space } = await createContentfulClient(env)

  // We get the entry content
  const entry = await client.getEntries({
    content_type: contentType,
    'fields.slug': slug,
    locale,
  })
  const firstEntry = entry.items?.[0]
  console.log('-firstEntry', firstEntry);

  // We get the entry contentType
  const type = await client.getContentType(contentType)
  console.log('-type', type);

  // We get all the assets of the space
  const stats = { length: 0, remainingToFetch: 0, items: [] }
  const assets = await getAllAssets(client, stats);
  console.log('-assets', assets);

  // const assets = await client.getAssets({ skip: 234 }) // Very temporary
  // console.log('-assets', assets);

  // We get the data for SDK
  const sdk = getSdk(firstEntry, assets, space, type)

  // We merge both objects together to fit the contentful fields API
  const fields = type.fields
    .map((field) => {
      const emitter: Emitter = mitt()

      return {
        id: field.id,
        locale,
        type: field.type,
        required: field.required,
        validations: field.validations as Object[], // Miss-type between `contentful-management` and `contentful-ui-extensions-sdk`
        items: field.items,
        getValue: () => {
          const entryFields = firstEntry?.fields
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
