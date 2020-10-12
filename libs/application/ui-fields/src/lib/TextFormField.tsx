import React, { FC } from 'react'
import {
  FieldBaseProps,
  formatText,
  TextField,
} from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import { InputController, Description } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'

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
  const { id, disabled, name, description } = field
  const { clearErrors } = useFormContext()
  const { formatMessage } = useLocale()

  return (
    <div>
      {description && (
        <Description
          description={formatText(description, application, formatMessage)}
        />
      )}

      <Box paddingTop={2}>
        <InputController
          disabled={disabled}
          id={id}
          label={
            showFieldName
              ? formatText(name, application, formatMessage)
              : undefined
          }
          autoFocus={autoFocus}
          error={error}
          onChange={() => {
            if (error) {
              clearErrors(id)
            }
          }}
        />
      </Box>
    </div>
  )
}

export default TextFormField
