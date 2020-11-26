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
  BaseExtensionSDK,
  FieldAPI,
} from 'contentful-ui-extensions-sdk/typings'

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
  _sdk: any // TODO
  fields: FieldAPI[]
}

export const initializer = async ({
  slug,
  contentType,
  locale,
  env,
}: InitializerProps) => {
  const { env: client, space } = await createContentfulClient(env)
  const emitter: Emitter = mitt()

  // We get the entry content
  const entry = await client.getEntries({
    content_type: contentType,
    'fields.slug': slug,
    locale,
  })

  // We get the entry contentType
  const type = await client.getContentType(contentType)

  // We get the data for SDK
  const sdk = getSdk(space, type)

  // We merge both objects together to fit the contentful fields API
  const fields = type.fields
    .filter(
      (field) =>
        field.id === 'title' || field.id === 'intro' || field.id === 'content',
    ) // TEMP
    .map((field) => {
      return {
        id: field.id,
        locale,
        type: field.type,
        required: field.required,
        validations: field.validations,
        items: field.items,
        getValue: () => {
          const entryFields = entry.items?.[0].fields
          const fieldName = Object.keys(entryFields).find(
            (entryField) => entryField === field.id,
          )

          console.log('-entryFields', entryFields)
          console.log('-fieldName', fieldName)

          if (!fieldName) {
            return undefined
          }

          const obj = entryFields?.[fieldName]?.[locale]
          console.log('-obj', obj)

          if (obj?.nodeType === 'document') {
            // console.log('-obj', obj);
            return obj
          }

          return obj
        },
        // setValue: (value: any) => Promise<any>,
        setValue: (value: string) => {
          console.log('-value', value)

          emitter.emit('setValue', value)
          emitter.emit('onValueChanged', value)

          return Promise.resolve()
        },
        // removeValue: () => Promise<void>,
        removeValue: () => null,
        // setInvalid: (value: boolean) => void,
        setInvalid: () => null,
        // onValueChanged: (callback: (value: any) => void) => () => void,
        onValueChanged: () => () => null,
        // onIsDisabledChanged: (callback: (isDisabled: boolean) => void) => () => void,
        onIsDisabledChanged: () => () => null,
        // onSchemaErrorsChanged: (callback: (errors: Error[]) => void) => () => void,
        onSchemaErrorsChanged: () => () => null,
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
