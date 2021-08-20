import React, { FC } from 'react'
import Markdown from 'markdown-to-jsx'

import {
  Application,
  formatText,
  DescriptionField,
} from '@island.is/application/core'
import { Text, Tooltip, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

export const DescriptionFormField: FC<{
  application: Application
  field: DescriptionField
  showFieldName: boolean
}> = ({ application, field, showFieldName }) => {
  const { formatMessage } = useLocale()

  return (
    <Box paddingTop={field.space}>
      {showFieldName && (
        <Text variant={field.titleVariant}>
          {formatText(field.title, application, formatMessage)}
        </Text>
      )}
      <Text>
        <Markdown>
          {formatText(field.description, application, formatMessage)}
        </Markdown>
        {field.tooltip && (
          <>
            {' '}
            <Tooltip
              placement="top"
              text={formatText(field.tooltip, application, formatMessage)}
            />
          </>
        )}
      </Text>
    </Box>
  )
}
