import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  buildFieldReadOnly,
  buildFieldRequired,
  formatText,
  formatTextWithLocale,
} from '@island.is/application/core'
import { FieldBaseProps, PhoneField } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import {
  PhoneInputController,
  FieldDescription,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { getDefaultValue } from '../../getDefaultValue'
import { Locale } from '@island.is/shared/types'

interface Props extends FieldBaseProps {
  field: PhoneField
}

export const PhoneFormField: FC<React.PropsWithChildren<Props>> = ({
  autoFocus,
  application,
  error,
  field,
  showFieldName,
}) => {
  const {
    id,
    disabled,
    title = '',
    description,
    placeholder,
    backgroundColor,
    required,
    readOnly,
    dataTestId,
    allowedCountryCodes,
    enableCountrySelector = false,
    marginTop,
    marginBottom,
    onChange = () => undefined,
    clearOnChange,
  } = field
  const { control, clearErrors } = useFormContext()
  const { formatMessage, lang: locale } = useLocale()

  return (
    <Box marginTop={marginTop} marginBottom={marginBottom}>
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
        <PhoneInputController
          disabled={disabled}
          readOnly={buildFieldReadOnly(application, readOnly)}
          id={id}
          dataTestId={dataTestId}
          allowedCountryCodes={allowedCountryCodes}
          placeholder={formatText(
            placeholder || '',
            application,
            formatMessage,
          )}
          label={
            showFieldName
              ? formatTextWithLocale(
                  title,
                  application,
                  locale as Locale,
                  formatMessage,
                )
              : undefined
          }
          locale={locale as Locale}
          autoFocus={autoFocus}
          error={error}
          control={control}
          disableDropdown={!enableCountrySelector}
          onChange={(e) => {
            if (error) {
              clearErrors(id)
            }
            onChange(e)
          }}
          defaultValue={getDefaultValue(field, application, locale)}
          backgroundColor={backgroundColor}
          required={buildFieldRequired(application, required)}
          clearOnChange={clearOnChange}
        />
      </Box>
    </Box>
  )
}
