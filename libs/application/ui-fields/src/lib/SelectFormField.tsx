import React, { FC } from 'react'
import {
  FieldBaseProps,
  formatText,
  SelectField,
} from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import { SelectController, Description } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

interface Props extends FieldBaseProps {
  field: SelectField
}
const SelectFormField: FC<Props> = ({ application, error, field }) => {
  const { id, name, description, options, placeholder, disabled } = field
  const { formatMessage } = useLocale()

  return (
    <div>
      {description && (
        <Description
          description={formatText(description, application, formatMessage)}
        />
      )}

      <Box paddingTop={2}>
        <SelectController
          label={formatText(name, application, formatMessage)}
          name={id}
          disabled={disabled}
          error={error}
          id={id}
          options={options.map(({ label, tooltip, ...o }) => ({
            ...o,
            label: formatText(label, application, formatMessage),
            ...(tooltip && {
              tooltip: formatText(tooltip, application, formatMessage),
            }),
          }))}
          placeholder={
            placeholder !== undefined
              ? formatText(placeholder as string, application, formatMessage)
              : undefined
          }
        />
      </Box>
    </div>
  )
}

export default SelectFormField
