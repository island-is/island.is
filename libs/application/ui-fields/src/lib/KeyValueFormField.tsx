import React, { FC } from 'react'

import {
  KeyValueField,
  formatText,
  Application,
} from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'

const KeyValueFormField: FC<{
  field: KeyValueField
  application: Application
}> = ({ field, application }) => {
  const { formatMessage } = useLocale()
  const values = formatText(field.value as string, application, formatMessage)

  return (
    <Box>
      <Text variant="h4">{field.label}</Text>
      {Array.isArray(values) ? (
        values.map((value) => <Text>{value}</Text>)
      ) : (
        <Text>{values}</Text>
      )}
    </Box>
  )
}

export default KeyValueFormField
