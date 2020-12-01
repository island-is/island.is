import mitt, { Emitter, Handler } from 'mitt'
import { ContentFields } from 'contentful-management/dist/typings/entities/content-type-fields'

import { getSdk } from './sdk'

export const createFieldAPI = (
  { entry, type }: { entry: any; type: any },
  { entries, assets, types, space, locale }: { entries: any; assets: any; types: any; space: any; locale: string },
) => {
  if (!entry) {
    return
  }

  return Array.from(type.fields).map((field: any) => {
    const emitter: Emitter = mitt()

    return {
      _contentType: type.sys.id, // Internal
      _sdk: getSdk(entry, entries, assets, space, types, locale), // Internal
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
}
