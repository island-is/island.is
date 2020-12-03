import React from 'react'
import { Text } from '@island.is/island-ui/core'
import { SingleLineEditor } from '@contentful/field-editor-single-line'
import {
  SingleEntryReferenceEditor,
  SingleMediaEditor,
} from '@contentful/field-editor-reference'
import { RichTextEditor } from '@contentful/field-editor-rich-text'
import {
  FieldAPI,
  FieldExtensionSDK,
} from 'contentful-ui-extensions-sdk/typings'

import { locales } from './locales'

/**
 * TODO
 * - Integer
 * - Number
 * - Date
 * - Boolean
 * - Location
 * - Array
 * - Object
 */
export const renderer = (field: FieldAPI, sdk: FieldExtensionSDK) => {
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

    case 'Link':
      const hasImage = !!(field.validations ?? []).find(
        (item) => (item as Record<string, any>)?.linkMimetypeGroup,
      )
      const hasContent = !!(field.validations ?? []).find(
        (item) => (item as Record<string, any>)?.linkContentType,
      )

      if (hasImage) {
        return (
          <SingleMediaEditor
            viewType="card"
            sdk={{ ...sdk, field }}
            isInitiallyDisabled={false}
            parameters={{
              instance: {
                showCreateEntityAction: true,
                showLinkEntityAction: true,
              },
            }}
          />
        )
      } else if (hasContent) {
        return (
          <SingleEntryReferenceEditor
            viewType="card"
            sdk={{ ...sdk, field }}
            isInitiallyDisabled={false}
            hasCardEditActions={true}
            parameters={{
              instance: {
                showCreateEntityAction: true,
                showLinkEntityAction: true,
              },
            }}
          />
        )
      }

      console.warn(`${field.type} is not supported yet.`)

      return null

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
