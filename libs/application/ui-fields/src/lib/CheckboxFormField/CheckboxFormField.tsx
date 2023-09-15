import React, { FC, useMemo } from 'react'
import HtmlParser from 'react-html-parser'

import {
  formatText,
  getValueViaPath,
  buildFieldOptions,
} from '@island.is/application/core'
import { CheckboxField, FieldBaseProps } from '@island.is/application/types'
import { Text, Box } from '@island.is/island-ui/core'
import {
  CheckboxController,
  FieldDescription,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

import { getDefaultValue } from '../../getDefaultValue'

interface Props extends FieldBaseProps {
  field: CheckboxField
}

export const CheckboxFormField: FC<React.PropsWithChildren<Props>> = ({
  error,
  showFieldName = false,
  field,
  application,
}) => {
  const {
    id,
    title,
    description,
    options,
    disabled,
    large,
    strong,
    backgroundColor,
    width,
    required,
    onSelect,
  } = field
  const { formatMessage } = useLocale()

  const finalOptions = useMemo(
    () => buildFieldOptions(options, application, field),
    [options, application],
  )

  return (
    <div>
      {showFieldName && (
        <Text variant="h4">
          {formatText(title, application, formatMessage)}
        </Text>
      )}

      {description && (
        <FieldDescription
          description={formatText(description, application, formatMessage)}
        />
      )}

      <Box paddingTop={2}>
        <CheckboxController
          id={id}
          disabled={disabled}
          large={large}
          name={`${id}`}
          onSelect={onSelect}
          split={width === 'half' ? '1/2' : '1/1'}
          backgroundColor={backgroundColor}
          defaultValue={
            ((getValueViaPath(application.answers, id) as string[]) ??
              getDefaultValue(field, application)) ||
            (required ? [] : undefined)
          }
          strong={strong}
          error={error}
          options={finalOptions?.map(({ label, subLabel, tooltip, ...o }) => ({
            ...o,
            label: HtmlParser(formatText(label, application, formatMessage)),
            subLabel:
              subLabel &&
              HtmlParser(formatText(subLabel, application, formatMessage)),
            ...(tooltip && {
              tooltip: HtmlParser(
                formatText(tooltip, application, formatMessage) as string,
              ),
            }),
          }))}
        />
      </Box>
    </div>
  )
}
