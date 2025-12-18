import { FC, useMemo } from 'react'
import HtmlParser from 'react-html-parser'

import {
  formatText,
  getValueViaPath,
  buildFieldOptions,
  formatTextWithLocale,
} from '@island.is/application/core'
import { FieldBaseProps, RadioField } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { Text, Box } from '@island.is/island-ui/core'
import {
  RadioController,
  FieldDescription,
} from '@island.is/shared/form-fields'

import { getDefaultValue } from '../../getDefaultValue'
import { Locale } from '@island.is/shared/types'
import { Markdown } from '@island.is/shared/components'

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
    title = '',
    description,
    options,
    width,
    largeButtons,
    backgroundColor,
    required,
    hasIllustration,
    widthWithIllustration,
    marginTop,
    marginBottom,
    clearOnChange,
    clearOnChangeDefaultValue,
  } = field
  const { formatMessage, lang: locale } = useLocale()

  const finalOptions = useMemo(
    () => buildFieldOptions(options, application, field, locale),
    [options, application, locale],
  )

  const paddingTop = field.space ?? 2

  return (
    <Box
      marginTop={marginTop}
      marginBottom={marginBottom}
      paddingTop={paddingTop}
      role="region"
      aria-labelledby={id + 'title'}
    >
      {showFieldName && (
        <Text variant="h4" as="h4" id={id + 'title'}>
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

      <Box>
        <RadioController
          largeButtons={largeButtons}
          backgroundColor={backgroundColor}
          id={id}
          disabled={disabled}
          error={error}
          split={
            widthWithIllustration
              ? widthWithIllustration
              : width === 'half'
              ? '1/2'
              : '1/1'
          }
          name={id}
          defaultValue={
            ((getValueViaPath(application.answers, id) as string[]) ??
              getDefaultValue(field, application, locale)) ||
            (required ? '' : undefined)
          }
          options={finalOptions.map(({ label, subLabel, tooltip, ...o }) => ({
            ...o,
            label: (
              <Markdown>
                {formatText(label, application, formatMessage)}
              </Markdown>
            ),
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
          hasIllustration={hasIllustration}
          paddingBottom={0}
          paddingTop={2}
          clearOnChange={clearOnChange}
          clearOnChangeDefaultValue={clearOnChangeDefaultValue}
        />
      </Box>
    </Box>
  )
}
