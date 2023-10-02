import { FC, useMemo } from 'react'
import HtmlParser from 'react-html-parser'

import {
  formatText,
  getValueViaPath,
  buildFieldOptions,
} from '@island.is/application/core'
import { FieldBaseProps, RadioField } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { Text, Box } from '@island.is/island-ui/core'
import {
  RadioController,
  FieldDescription,
} from '@island.is/shared/form-fields'

import { getDefaultValue } from '../../getDefaultValue'

interface Props extends FieldBaseProps {
  field: RadioField
}

export const RadioFormField: FC<React.PropsWithChildren<Props>> = ({
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
    required,
  } = field
  const { formatMessage } = useLocale()

  const finalOptions = useMemo(
    () => buildFieldOptions(options, application, field),
    [options, application],
  )

  console.debug(
    `Radio title ${JSON.stringify(title)}, and formatted: ${formatText(
      title,
      application,
      formatMessage,
    )}`,
  )

  return (
    <Box paddingTop={field.space} role="region" aria-labelledby={id + 'title'}>
      {showFieldName && (
        <Text variant="h4" as="h4" id={id + 'title'}>
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
            ((getValueViaPath(application.answers, id) as string[]) ??
              getDefaultValue(field, application)) ||
            (required ? '' : undefined)
          }
          options={finalOptions.map(({ label, subLabel, tooltip, ...o }) => ({
            ...o,
            label: HtmlParser(formatText(label, application, formatMessage)),
            subLabel:
              subLabel &&
              HtmlParser(formatText(subLabel, application, formatMessage)),
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
