import React, { FC } from 'react'
import {
  CheckboxField,
  FieldBaseProps,
  getValueViaPath,
} from '@island.is/application/core'
import { Text, Box } from '@island.is/island-ui/core'
import { CheckboxController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import Description from './components/Description'

interface Props extends FieldBaseProps {
  field: CheckboxField
}
const CheckboxFormField: FC<Props> = ({
  error,
  showFieldName = false,
  field,
  formValue,
}) => {
  const { id, name, description, options, disabled } = field
  const { formatMessage } = useLocale()

  return (
    <div>
      {showFieldName && <Text>{formatMessage(name)}</Text>}

      {description && <Description description={formatMessage(description)} />}

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
