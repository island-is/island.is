import React, { FC, useMemo } from 'react'

import { formatTextWithLocale } from '@island.is/application/core'
import { Application, DescriptionField } from '@island.is/application/types'
import { Box, Text, Tooltip } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Markdown } from '@island.is/shared/components'
import { Locale } from '@island.is/shared/types'
import { useFormContext } from 'react-hook-form'

export const DescriptionFormField: FC<
  React.PropsWithChildren<{
    application: Application
    field: DescriptionField
    showFieldName: boolean
  }>
> = ({ application, field, showFieldName }) => {
  const { space: paddingTop = 2, marginBottom, marginTop } = field
  const { formatMessage, lang: locale } = useLocale()
  const { getValues } = useFormContext()
  const values = getValues()

  const updatedApplication = useMemo(() => {
    return {
      ...application,
      answers: {
        ...application.answers,
        ...values,
      },
    }
  }, [application, values])

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
            updatedApplication,
            locale as Locale,
            formatMessage,
          )}
          {field.titleTooltip && (
            <Box component="span" marginLeft={1} display="inlineBlock">
              <Tooltip
                placement="top"
                text={formatTextWithLocale(
                  field.titleTooltip,
                  updatedApplication,
                  locale as Locale,
                  formatMessage,
                )}
              />
            </Box>
          )}
        </Text>
      )}
      {(field.description || field.tooltip) && (
        <Box component="div">
          {field.description && (
            <Markdown>
              {formatTextWithLocale(
                field.description,
                updatedApplication,
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
                updatedApplication,
                locale as Locale,
                formatMessage,
              )}
            />
          )}
        </Box>
      )}
    </Box>
  )
}
