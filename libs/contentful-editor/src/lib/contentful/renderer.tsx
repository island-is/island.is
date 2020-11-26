import React from 'react'
import { Text } from '@island.is/island-ui/core'
import { SingleLineEditor } from '@contentful/field-editor-single-line'
import { SingleMediaEditor } from '@contentful/field-editor-reference'
import { RichTextEditor } from '@contentful/field-editor-rich-text'
import { FieldAPI } from 'contentful-ui-extensions-sdk/typings'

import { locales } from './locales'

export const renderer = (field: FieldAPI, sdk: any) => {
  console.log('-field.type', field.type)

  switch (field.type) {
    case 'Text':
    case 'Symbol':
      return (
        <SingleLineEditor
          key={field.id}
          field={field}
          locales={locales}
          isInitiallyDisabled={false}
        />
      )

    /*
    case 'Link':
      return (
        <SingleMediaEditor
          viewType="card"
          sdk={{ ...sdk, field }}
          isInitiallyDisabled={false}
          parameters={{
            instance: {
              canCreateEntity: true,
              canLinkEntity: true,
            },
          }}
        />
      )
      */

    case 'RichText':
      return (
        <RichTextEditor
          key={field.id}
          sdk={{ ...sdk, field }}
          isInitiallyDisabled={false}
        />
      )

    default:
      console.warn(`${field.type} is not supported yet.`)

      return (
        <Text color="red600" fontWeight="medium">
          {field.type} is not supported yet.
        </Text>
      )
  }
}
