import React, { FC } from 'react'
import {
  FieldBaseProps,
  DateField,
  formatText,
} from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import {
  DatePickerController,
  FieldDescription,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

interface Props extends FieldBaseProps {
  field: DateField
}
const DateFormField: FC<Props> = ({ application, error, field }) => {
  const { id, disabled, name, description, placeholder } = field
  const { formatMessage } = useLocale()

  return (
    <div>
      {description && (
        <FieldDescription
          description={formatText(description, application, formatMessage)}
        />
      )}

      <Box paddingTop={2}>
        <DatePickerController
          disabled={disabled}
          id={id}
          name={`${id}`}
          label={formatText(name, application, formatMessage)}
          placeholder={
            placeholder
              ? formatText(placeholder, application, formatMessage)
              : undefined
          }
          error={error}
        />
      </Box>
    </div>
  )
}

export default DateFormField
