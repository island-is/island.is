import mitt, { Emitter, Handler } from 'mitt'
import {
  FieldAPI,
  BaseExtensionSDK,
} from 'contentful-ui-extensions-sdk/typings'
import { Entry } from 'contentful-management/dist/typings/entities/entry'
import { ContentType } from 'contentful-management/dist/typings/entities/content-type'
import { Space } from 'contentful-management/dist/typings/entities/space'
import {
  createSdk,
  Types,
  Entries,
  Assets,
  ContentfulLocale,
} from '@island.is/contentful-editor'

export interface InternalFieldAPI extends FieldAPI {
  _sdk: BaseExtensionSDK
  _emitter: Emitter
}

export interface InternalEntry {
  _id: string
  _slug?: string
  _contentType: string
  _entry: Entry
  fields?: InternalFieldAPI[]
}

export const createFieldAPI = (
  { entry, type }: { entry: Entry; type: ContentType },
  {
    entries,
    assets,
    types,
    space,
    locale,
  }: {
    types: Types
    entries: Entries
    assets: Assets
    space: Space
    locale: ContentfulLocale
  },
): InternalEntry => ({
  // Internal 🔽
  _id: entry.sys.id,
  _slug: entry.fields?.slug?.[locale],
  _contentType: type.sys.id,
  _entry: entry,
  // For contentful renderer 🔽
  fields: Array.from(type.fields).map((field) => {
    const emitter: Emitter = mitt()

    return {
      // Internal 🔽
      _sdk: createSdk(entry, entries, assets, types, space),
      _emitter: emitter,
      // General SDK API 🔽
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
  }),
})
