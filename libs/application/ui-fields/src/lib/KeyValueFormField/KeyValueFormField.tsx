import React, { FC } from 'react'

import {
  Application,
  formatText,
  KeyValueField,
} from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

export const KeyValueFormField: FC<{
  field: KeyValueField
  application: Application
}> = ({ field, application }) => {
  const { formatMessage } = useLocale()
  const values = formatText(field.value, application, formatMessage)

  return (
    <Box>
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
