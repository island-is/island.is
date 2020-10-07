import React, { FC } from 'react'
import { FieldBaseProps, SelectField } from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import { SelectController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

interface Props extends FieldBaseProps {
  field: SelectField
}
const SelectFormField: FC<Props> = ({
  error,
  showFieldName = false,
  field,
}) => {
  const { id, name, options, placeholder, disabled } = field
  const { formatMessage } = useLocale()

  return (
    <div>
      <Box paddingTop={2}>
        <SelectController
          label={formatMessage(name) as string}
          name={id}
          disabled={disabled}
          error={error}
          id={id}
          options={options.map(({ label, tooltip, ...o }) => ({
            ...o,
            label: formatMessage(label) as string,
            ...(tooltip && { tooltip: formatMessage(tooltip) as string }),
          }))}
          placeholder={placeholder}
        />
      </Box>
    </div>
  )
}

export default SelectFormField
