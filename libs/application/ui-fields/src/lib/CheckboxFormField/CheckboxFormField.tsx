import { useMemo } from 'react'
import HtmlParser from 'react-html-parser'

import {
  formatText,
  getValueViaPath,
  buildFieldOptions,
  formatTextWithLocale,
} from '@island.is/application/core'
import { CheckboxField, FieldBaseProps } from '@island.is/application/types'
import { Text, Box } from '@island.is/island-ui/core'
import {
  CheckboxController,
  FieldDescription,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

import { getDefaultValue } from '../../getDefaultValue'
import { Locale } from '@island.is/shared/types'
import { Markdown } from '@island.is/shared/components'

interface Props extends FieldBaseProps {
  field: CheckboxField
}

export const CheckboxFormField = ({
  error,
  showFieldName = false,
  field,
  application,
}: Props) => {
  const {
    id,
    title = '',
    description,
    options,
    disabled,
    large,
    strong,
    backgroundColor,
    width,
    required,
    onSelect,
    spacing,
    marginTop,
    marginBottom,
    clearOnChange,
  } = field
  const { formatMessage, lang: locale } = useLocale()

  const finalOptions = useMemo(
    () => buildFieldOptions(options, application, field, locale),
    [options, application, locale],
  )

  return (
    <Box marginTop={marginTop} marginBottom={marginBottom}>
      {showFieldName && (
        <Text variant="h4">
          {formatTextWithLocale(
            title,
            application,
            locale as Locale,
            formatMessage,
          )}
        </Text>
      )}

      {description && (
        <FieldDescription
          description={formatTextWithLocale(
            description,
            application,
            locale as Locale,
            formatMessage,
          )}
        />
      )}

      <Box paddingTop={2}>
        <CheckboxController
          id={id}
          disabled={disabled}
          large={large}
          name={`${id}`}
          split={width === 'half' ? '1/2' : '1/1'}
          onSelect={onSelect}
          backgroundColor={backgroundColor}
          defaultValue={
            ((getValueViaPath(application.answers, id) as string[]) ??
              getDefaultValue(field, application)) ||
            (required ? [] : undefined)
          }
          strong={strong}
          error={error}
          spacing={spacing}
          options={finalOptions?.map(
            ({ label, subLabel, rightContent, tooltip, ...o }) => ({
              ...o,
              label: (
                <Markdown>
                  {formatText(label, application, formatMessage)}
                </Markdown>
              ),
              rightContent,
              subLabel:
                subLabel &&
                HtmlParser(formatText(subLabel, application, formatMessage)),
              ...(tooltip && {
                tooltip: HtmlParser(
                  formatText(tooltip, application, formatMessage) as string,
                ),
              }),
            }),
          )}
          clearOnChange={clearOnChange}
        />
      </Box>
    </Box>
  )
}
