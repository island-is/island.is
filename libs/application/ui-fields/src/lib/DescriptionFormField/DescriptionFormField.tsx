import React, { FC } from 'react'

import { formatText } from '@island.is/application/core'
import { Application, DescriptionField } from '@island.is/application/types'
import { Text, Tooltip, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Markdown } from '@island.is/shared/components'

export const DescriptionFormField: FC<
  React.PropsWithChildren<{
    application: Application
    field: DescriptionField

    showFieldName: boolean
  }>
> = ({ application, field, showFieldName }) => {
  const { formatMessage } = useLocale()

  return (
    <Box paddingTop={field.space} marginBottom={field.marginBottom}>
      {showFieldName && (
        <Text variant={field.titleVariant}>
          {formatText(field.title, application, formatMessage)}
          {field.titleTooltip && (
            <>
              {' '}
              <Tooltip
                placement="top"
                text={formatText(
                  field.titleTooltip,
                  application,
                  formatMessage,
                )}
              />
            </>
          )}
        </Text>
      )}
      {(field.description || field.tooltip) && (
        <Text>
          {field.description && (
            <Markdown>
              {formatText(field.description, application, formatMessage)}
            </Markdown>
          )}
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
      )}
    </Box>
  )
}
