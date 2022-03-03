import React, { FC, useMemo } from 'react'
import HtmlParser from 'react-html-parser'

import {
  buildFieldOptions,
  FieldBaseProps,
  formatText,
  getValueViaPath,
  RadioField,
} from '@island.is/application/core'
import { Box,Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  FieldDescription,
  RadioController,
} from '@island.is/shared/form-fields'

import { getDefaultValue } from '../../getDefaultValue'

interface Props extends FieldBaseProps {
  field: RadioField
}

export const RadioFormField: FC<Props> = ({
  showFieldName = false,
  field,
  error,
  application,
}) => {
  const {
    disabled,
    id,
    title,
    description,
    options,
    width,
    largeButtons,
    backgroundColor,
  } = field
  const { formatMessage } = useLocale()

  const finalOptions = useMemo(
    () => buildFieldOptions(options, application, field),
    [options, application],
  )

  return (
    <Box paddingTop={field.space}>
      {showFieldName && (
        <Text variant="h4" as="h4">
          {formatText(title, application, formatMessage)}
        </Text>
      )}

      {description && (
        <FieldDescription
          description={formatText(description, application, formatMessage)}
        />
      )}

      <Box marginTop={3}>
        <RadioController
          largeButtons={largeButtons}
          backgroundColor={backgroundColor}
          id={id}
          disabled={disabled}
          error={error}
          split={width === 'half' ? '1/2' : '1/1'}
          name={id}
          defaultValue={
            (getValueViaPath(application.answers, id) as string[]) ??
            getDefaultValue(field, application)
          }
          options={finalOptions.map(({ label, tooltip, ...o }) => ({
            ...o,
            label: HtmlParser(formatText(label, application, formatMessage)),
            ...(tooltip && {
              tooltip: HtmlParser(
                formatText(tooltip, application, formatMessage),
              ),
            }),
          }))}
          onSelect={field.onSelect}
        />
      </Box>
    </Box>
  )
}
