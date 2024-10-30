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
    spacing,
  } = field
  const { formatMessage, lang: locale } = useLocale()

  const finalOptions = useMemo(
    () => buildFieldOptions(options, application, field, locale),
    [options, application, locale],
  )

  return (
    <div>
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
              label: HtmlParser(formatText(label, application, formatMessage)),
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
        />
      </Box>
    </div>
  )
}
