import React, { FC } from 'react'
import { CheckboxField } from '@island.is/application/template'
import { CheckboxController, Typography, Box } from '@island.is/island-ui/core'
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

  return (
    <div>
      {showFieldName && <Typography variant="p">{name}</Typography>}
      <Box paddingTop={2}>
        <CheckboxController
          id={id}
          disabled={disabled}
          name={`${id}`}
          defaultValue={getValueViaPath(formValue, id, [])}
          error={error}
          options={options}
        />
      </Box>
    </div>
  )
}

export default CheckboxFormField
