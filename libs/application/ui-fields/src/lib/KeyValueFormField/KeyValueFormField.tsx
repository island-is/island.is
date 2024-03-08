import React, { FC } from 'react'

import { formatText } from '@island.is/application/core'
import { Application, KeyValueField } from '@island.is/application/types'
import { Box, Divider, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

export const KeyValueFormField: FC<
  React.PropsWithChildren<{
    field: KeyValueField
    application: Application
  }>
> = ({ field, application }) => {
  const { formatMessage } = useLocale()
  const values = formatText(field.value, application, formatMessage)

  return (
    <>
      <Box
        paddingY={field.paddingY}
        paddingX={field.paddingX}
        display={field.display === 'flex' ? 'flex' : 'block'}
        justifyContent="spaceBetween"
      >
        <Box
          display="flex"
          alignItems="center"
          style={field.display === 'flex' ? { flex: 1 } : undefined}
        >
          <Text variant="h4" as="h4">
            {formatText(field.label, application, formatMessage)}
          </Text>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          style={field.display === 'flex' ? { flex: 1 } : undefined}
        >
          {Array.isArray(values) ? (
            (values as string[]).map((value) => (
              <Text key={value}>{value}</Text>
            ))
          ) : (
            <Text>{values}</Text>
          )}
        </Box>
      </Box>
      {field.divider && <Divider />}
    </>
  )
}
