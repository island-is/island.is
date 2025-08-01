import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  buildFieldReadOnly,
  buildFieldRequired,
  formatTextWithLocale,
} from '@island.is/application/core'
import { FieldBaseProps, TextField } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import {
  InputController,
  FieldDescription,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

import { getDefaultValue } from '../../getDefaultValue'
import { Locale } from '@island.is/shared/types'

interface Props extends FieldBaseProps {
  field: TextField
}

export const TextFormField: FC<React.PropsWithChildren<Props>> = ({
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
    format,
    variant = 'text',
    thousandSeparator,
    suffix,
    rows,
    required,
    readOnly,
    maxLength,
    showMaxLength,
    dataTestId,
    rightAlign,
    max,
    min,
    step,
    marginBottom,
    marginTop,
    tooltip,
    onChange = () => undefined,
    clearOnChange,
    setOnChange,
  } = field
  const { clearErrors, watch } = useFormContext()
  const { formatMessage, lang: locale } = useLocale()
  const value = watch(id)

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
        <InputController
          tooltip={formatTextWithLocale(
            tooltip || '',
            application,
            locale as Locale,
            formatMessage,
          )}
          disabled={disabled}
          readOnly={buildFieldReadOnly(application, readOnly)}
          id={id}
          dataTestId={dataTestId}
          placeholder={formatTextWithLocale(
            placeholder || '',
            application,
            locale as Locale,
            formatMessage,
          )}
          label={
            showFieldName
              ? `${formatTextWithLocale(
                  title,
                  application,
                  locale as Locale,
                  formatMessage,
                )} ${
                  maxLength && showMaxLength
                    ? `(${
                        value && value?.length ? value.length : 0
                      }/${maxLength})`
                    : ''
                }`
              : undefined
          }
          autoFocus={autoFocus}
          error={error}
          onChange={(e) => {
            if (error) {
              clearErrors(id)
            }
            onChange(e)
          }}
          maxLength={maxLength}
          textarea={variant === 'textarea'}
          currency={variant === 'currency'}
          type={
            variant !== 'textarea' && variant !== 'currency' ? variant : 'text'
          }
          format={format}
          thousandSeparator={thousandSeparator}
          suffix={
            suffix &&
            formatTextWithLocale(
              suffix,
              application,
              locale as Locale,
              formatMessage,
            )
          }
          defaultValue={getDefaultValue(field, application)}
          backgroundColor={backgroundColor}
          rows={rows}
          required={buildFieldRequired(application, required)}
          rightAlign={rightAlign}
          max={max}
          min={min}
          step={step}
          clearOnChange={clearOnChange}
          setOnChange={
            typeof setOnChange === 'function'
              ? async (optionValue) =>
                  await setOnChange(optionValue, application)
              : setOnChange
          }
        />
      </Box>
    </Box>
  )
}
