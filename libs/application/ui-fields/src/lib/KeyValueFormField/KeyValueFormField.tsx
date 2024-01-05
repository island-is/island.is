import React, { FC } from 'react'

import { formatText } from '@island.is/application/core'
import { KeyValueField, Application } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'

export const KeyValueFormField: FC<
  React.PropsWithChildren<{
    field: KeyValueField
    application: Application
  }>
> = ({ field, application }) => {
  const { formatMessage } = useLocale()
  const values = formatText(field.value, application, formatMessage)

  return (
    <Box
      display={field.display === 'flex' ? 'flex' : 'block'}
      justifyContent="spaceBetween"
    >
      <Text variant="h4" as="h4">
        {formatText(field.label, application, formatMessage)}
      </Text>

      {Array.isArray(values) ? (
        (values as string[]).map((value) => <Text key={value}>{value}</Text>)
      ) : (
        <Text>{values}</Text>
      )}
    </Box>
  )
}
