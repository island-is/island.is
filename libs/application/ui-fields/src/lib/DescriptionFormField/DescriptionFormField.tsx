import React, { FC } from 'react'

import { formatTextWithLocale } from '@island.is/application/core'
import { Application, DescriptionField } from '@island.is/application/types'
import { Text, Tooltip, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Markdown } from '@island.is/shared/components'
import { Locale } from '@island.is/shared/types'
export const DescriptionFormField: FC<
  React.PropsWithChildren<{
    application: Application
    field: DescriptionField

    showFieldName: boolean
  }>
> = ({ application, field, showFieldName }) => {
  const { formatMessage, lang: locale } = useLocale()

  const { space: paddingTop = 2, marginBottom, marginTop } = field

  return (
    <Box
      paddingTop={paddingTop}
      marginBottom={marginBottom}
      marginTop={marginTop}
    >
      {showFieldName && (
        <Text variant={field.titleVariant}>
          {formatTextWithLocale(
            field.title ?? '',
            application,
            locale as Locale,
            formatMessage,
          )}
          {field.titleTooltip && (
            <Tooltip
              placement="top"
              text={formatTextWithLocale(
                field.titleTooltip,
                application,
                locale as Locale,
                formatMessage,
              )}
            />
          )}
        </Text>
      )}
      {(field.description || field.tooltip) && (
        <Text>
          {field.description && (
            <Markdown>
              {formatTextWithLocale(
                field.description,
                application,
                locale as Locale,
                formatMessage,
              )}
            </Markdown>
          )}
          {field.tooltip && (
            <Tooltip
              placement="top"
              text={formatTextWithLocale(
                field.tooltip,
                application,
                locale as Locale,
                formatMessage,
              )}
            />
          )}
        </Text>
      )}
    </Box>
  )
}
