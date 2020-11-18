import React, { FC } from 'react'
import { Box, Input, Text } from '@island.is/island-ui/core'
import { FieldItem, RichTextContent } from 'contentful'

import * as styles from './Sidebar.treat'

interface SidebarProps {
  fields: any
  onChange(field: string, value: string): void
}

export const Sidebar: FC<SidebarProps> = ({ fields, onChange }) => {
  console.log('-fields', fields)

  const handleChange = (field: string, value: string) => {
    console.log('-field', field)
    console.log('-value', value)

    onChange(field, value)
  }

  return (
    <Box className={styles.wrapper}>
      <Text as="h3" variant="h3" fontWeight="semiBold">
        Contentful editor mode
      </Text>

      {Object.keys(fields ?? [])
        // .filter((field) => field !== 'title' && field !== 'slug')
        .filter((field) => field === 'title' || field === 'intro')
        .map((field, index) => {
          /*
        const getContent = () => {
          const data = fields[field]?.['is-IS'] as {
            sys: FieldItem
            content: RichTextContent[]
          }

          if (typeof data === 'string') {
            return data
          }

          // Not for now
          if (
            data?.sys?.linkType === 'Asset' ||
            data?.sys?.linkType === 'Entry'
          ) {
            return
          }

          return (data?.content ?? []).map((text) => {
            return {
              nodeType: text.nodeType,
            }
          })
        }
        */

          return (
            <Box
              key={`${field}-${index}`}
              paddingY={3}
              borderBottomWidth="standard"
              borderColor="dark200"
            >
              <Text variant="eyebrow" marginBottom={1}>
                {field}
              </Text>

              <Input
                name={field}
                placeholder={field}
                size="sm"
                defaultValue={fields[field]?.['is-IS'] ?? ''}
                onChange={(event) => handleChange(field, event.target.value)}
              />
            </Box>
          )
        })}
    </Box>
  )
}
