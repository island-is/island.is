import React, { FC } from 'react'
import { FieldBaseProps, TextField } from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import Description from './components/Description'

interface Props extends FieldBaseProps {
  field: TextField
}
const TextFormField: FC<Props> = ({
  autoFocus,
  error,
  field,
  showFieldName,
}) => {
  const { id, disabled, name, description } = field
  const { clearErrors } = useFormContext()
  const { formatMessage } = useLocale()

  return (
    <div>
      {description && <Description description={formatMessage(description)} />}

      <Box paddingTop={2}>
        <InputController
          disabled={disabled}
          id={id}
          label={showFieldName ? (formatMessage(name) as string) : undefined}
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
