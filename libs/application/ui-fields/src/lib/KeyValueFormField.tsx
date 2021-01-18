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

  return (
    <Box>
      <Text variant="h4">{field.label}</Text>
      <Text>
        {formatText(field.value as string, application, formatMessage)}
      </Text>
    </Box>
  )
}

export default KeyValueFormField
