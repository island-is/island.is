import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

import { formatText } from '@island.is/application/core'
import { FieldBaseProps, TextField } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import {
  InputController,
  FieldDescription,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

import { getDefaultValue } from '../../getDefaultValue'

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
    title,
    description,
    placeholder,
    backgroundColor,
    format,
    variant = 'text',
    suffix,
    rows,
    required,
    readOnly,
    maxLength,
    dataTestId,
    rightAlign,
    onChange = () => undefined,
  } = field
  const { clearErrors } = useFormContext()
  const { formatMessage } = useLocale()

  return (
    <div>
      {description && (
        <FieldDescription
          description={formatText(description, application, formatMessage)}
        />
      )}

      <Box paddingTop={2}>
        <InputController
          disabled={disabled}
          readOnly={readOnly}
          id={id}
          dataTestId={dataTestId}
          placeholder={formatText(
            placeholder || '',
            application,
            formatMessage,
          )}
          label={
            showFieldName
              ? formatText(title, application, formatMessage)
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
          suffix={suffix}
          defaultValue={getDefaultValue(field, application)}
          backgroundColor={backgroundColor}
          rows={rows}
          required={required}
          rightAlign={rightAlign}
        />
      </Box>
    </div>
  )
}
