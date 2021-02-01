import React, { FC } from 'react'
import {
  FieldBaseProps,
  formatText,
  TextField,
} from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import {
  InputController,
  FieldDescription,
} from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { useDefaultValue } from '../useDefaultValue'

interface Props extends FieldBaseProps {
  field: TextField
}
const TextFormField: FC<Props> = ({
  autoFocus,
  application,
  error,
  field,
  showFieldName,
}) => {
  const {
    id,
    disabled,
    description,
    label,
    title,
    placeholder,
    rows,
    backgroundColor,
    format,
    variant = 'text',
    suffix,
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
          id={id}
          placeholder={formatText(
            placeholder || '',
            application,
            formatMessage,
          )}
          rows={rows}
          label={
            showFieldName
              ? formatText(title, application, formatMessage)
              : undefined
          }
          autoFocus={autoFocus}
          error={error}
          onChange={() => {
            if (error) {
              clearErrors(id)
            }
          }}
          textarea={variant === 'textarea'}
          currency={variant === 'currency'}
          type={
            variant !== 'textarea' && variant !== 'currency' ? variant : 'text'
          }
          format={format}
          suffix={suffix}
          defaultValue={useDefaultValue(field, application)}
          backgroundColor={backgroundColor}
        />
      </Box>
    </div>
  )
}

export default TextFormField
