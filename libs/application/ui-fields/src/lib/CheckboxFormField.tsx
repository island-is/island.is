import React, { FC } from 'react'
import {
  CheckboxField,
  FieldBaseProps,
  getValueViaPath,
} from '@island.is/application/core'
import { Typography, Box } from '@island.is/island-ui/core'
import { CheckboxController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

interface Props extends FieldBaseProps {
  field: CheckboxField
}
const CheckboxFormField: FC<Props> = ({
  error,
  showFieldName = false,
  field,
  formValue,
}) => {
  const { id, name, options, disabled } = field
  const { formatMessage } = useLocale()

  return (
    <div>
      {showFieldName && (
        <Typography variant="p">{formatMessage(name)}</Typography>
      )}
      <Box paddingTop={2}>
        <CheckboxController
          id={id}
          disabled={disabled}
          name={`${id}`}
          defaultValue={getValueViaPath(formValue, id, []) as string[]}
          error={error}
          options={options.map(({ label, tooltip, ...o }) => ({
            ...o,
            label: formatMessage(label) as string,
            ...(tooltip && { tooltip: formatMessage(tooltip) as string }),
          }))}
        />
      </Box>
    </div>
  )
}

export default CheckboxFormField
