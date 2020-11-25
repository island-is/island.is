import React, { FC } from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { SingleLineEditor } from '@contentful/field-editor-single-line'
import { RichTextEditor } from '@contentful/field-editor-rich-text'
import { FieldAPI } from 'contentful-ui-extensions-sdk/typings'

import { MagicType } from '../../utils/buildContentTypeAndData'
import { locales } from '../../contentful/locales'
import { getSdk } from '../../contentful/sdk'
import { ContentfulEnv } from '../../contentful/client'

import * as styles from './Sidebar.treat'

interface SidebarProps {
  env: ContentfulEnv
  entry: MagicType
  fields: any
  locale: string
  loading: boolean
  onChange(field: string, value: string): void
}

export const Sidebar: FC<SidebarProps> = ({
  env,
  entry,
  fields,
  locale,
  loading,
  onChange,
}) => {
  const handleChange = (field: string, value: string) => {
    console.log('-field', field)
    console.log('-value', value)

    onChange(field, value)
  }

  const renderFields = (field: FieldAPI) => {
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

      case 'RichText':
        const sdk = getSdk(field, env)
        console.log('-sdk', sdk)

        return (
          <RichTextEditor
            key={field.id}
            sdk={sdk}
            isInitiallyDisabled={false}
          />
        )

      default:
        console.warn(`${field.type} is not supported yet.`)
        return null
    }
  }

  return (
    <>
      <Box className={styles.wrapper}>
        <Text as="h3" variant="h3" fontWeight="semiBold">
          Contentful editor mode
        </Text>

        {loading && <Text marginTop={2}>Loading...</Text>}

        {!loading &&
          (entry?.fields ?? []).map((field) => (
            <Box
              key={field.id}
              paddingY={3}
              borderBottomWidth="standard"
              borderColor="dark200"
            >
              <Text variant="eyebrow" marginBottom={1}>
                {field.id}
              </Text>

              {renderFields(field)}
            </Box>
          ))}
      </Box>

      <Box className={styles.overlay} />
    </>
  )
}
