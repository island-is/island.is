import React, { FC } from 'react'
import { FieldBaseProps, DateField } from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import { DatePickerController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

interface Props extends FieldBaseProps {
  field: DateField
}
const DateFormField: FC<Props> = ({ error, field }) => {
  const { id, disabled, name, placeholder } = field
  const { formatMessage } = useLocale()

  return (
    <Box paddingTop={2}>
      <DatePickerController
        disabled={disabled}
        id={id}
        name={`${id}`}
        label={formatMessage(name) as string}
        placeholder={
          placeholder ? (formatMessage(placeholder) as string) : undefined
        }
        error={error}
      />
    </Box>
  )
}

export default DateFormField
