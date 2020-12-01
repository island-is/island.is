import React, { FC } from 'react'
import { Box, Text } from '@island.is/island-ui/core'

import { MagicType } from '../../contentful/initializer'
import { renderer } from '../../contentful/renderer'

import * as styles from './Sidebar.treat'

interface SidebarProps {
  data: MagicType | undefined
  error?: string
  loading: boolean
  onChange(field: string, value: string): void
}

export const Sidebar: FC<SidebarProps> = ({
  wip,
  data,
  error,
  loading,
  onChange,
}) => {
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

        {!loading && error && (
          <Text fontWeight="medium" color="red600">
            {error}
          </Text>
        )}

        {loading && <Text marginTop={2}>Loading...</Text>}

        {!loading &&
          // (data?.fields ?? []).map((field) => (
          (wip ?? []).map((field) => {
            console.log('-field._sdk', field._sdk)

            return (
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

                {/* {renderer(field, data?._sdk)} */}
                {renderer(field, field?._sdk)}
              </Box>
            )
          })}
      </Box>

      <Box className={styles.overlay} />
    </>
  )
}
