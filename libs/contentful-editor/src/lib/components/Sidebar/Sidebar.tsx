import React, { FC, useContext } from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { renderer, ContentfulContext } from '@island.is/contentful-editor'

import * as styles from './Sidebar.treat'

interface SidebarProps {
  onChange(field: string, value: string): void
}

export const Sidebar: FC<SidebarProps> = ({ onChange }) => {
  const { loading, entry } = useContext(ContentfulContext)
  console.log('-entry', entry)

  const handleChange = (field: string, value: string) => {
    console.log('-field', field)
    console.log('-value', value)

    onChange(field, value)
  }

  return (
    <>
      <Box className={styles.wrapper}>
        <Text as="h3" variant="h3" fontWeight="semiBold" marginBottom={3}>
          Contentful Editor Mode
        </Text>

        {loading && <Text marginTop={2}>Loading...</Text>}

        {!loading &&
          (entry?.fields ?? []).map((field) => (
            <Box
              key={field.id}
              padding={2}
              background="blue100"
              borderRadius="standard"
              marginBottom={2}
            >
              <Text variant="eyebrow" marginBottom={1}>
                {field.id}
              </Text>

              {renderer(field, field._sdk)}
            </Box>
          ))}
      </Box>

      <Box className={styles.overlay} />
    </>
  )
}
