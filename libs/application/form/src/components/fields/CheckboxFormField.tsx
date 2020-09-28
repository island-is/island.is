import React, { FC } from 'react'
import { CheckboxField } from '@island.is/application/template'
import { CheckboxController, Typography, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '../../types'

import { getValueViaPath } from '../../utils'

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
