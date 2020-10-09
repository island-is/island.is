import React, { FC } from 'react'
import {
  FieldBaseProps,
  getValueViaPath,
  RadioField,
} from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { Typography, Box } from '@island.is/island-ui/core'
import { RadioController } from '@island.is/shared/form-fields'
import Description from './components/Description'

interface Props extends FieldBaseProps {
  field: RadioField
}
const RadioFormField: FC<Props> = ({
  showFieldName = false,
  field,
  error,
  formValue,
}) => {
  const {
    disabled,
    id,
    name,
    description,
    options,
    emphasize,
    largeButtons,
  } = field
  const { formatMessage } = useLocale()

  return (
    <div>
      {showFieldName && (
        <Typography variant="p">{formatMessage(name)}</Typography>
      )}

      {description && <Description description={formatMessage(description)} />}

      <Box
        background={emphasize ? 'blue100' : undefined}
        padding={emphasize ? 3 : undefined}
        marginTop={3}
      >
        <RadioController
          largeButtons={largeButtons}
          emphasize={emphasize}
          id={id}
          disabled={disabled}
          error={error}
          name={`${id}`}
          defaultValue={getValueViaPath(formValue, id) as string[]}
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

export default RadioFormField
