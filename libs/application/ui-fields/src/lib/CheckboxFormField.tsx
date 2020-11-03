import React, { FC, useMemo } from 'react'
import {
  CheckboxField,
  FieldBaseProps,
  formatText,
  getValueViaPath,
} from '@island.is/application/core'
import { Text, Box } from '@island.is/island-ui/core'
import {
  CheckboxController,
  FieldDescription,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { buildOptions } from '../utils'

interface Props extends FieldBaseProps {
  field: CheckboxField
}
const CheckboxFormField: FC<Props> = ({
  error,
  showFieldName = false,
  field,
  application,
}) => {
  const { id, name, description, options, disabled } = field
  const { formatMessage } = useLocale()

  const finalOptions = useMemo(() => buildOptions(options, application), [
    options,
    application,
  ])

  return (
    <div>
      {showFieldName && (
        <Text>{formatText(name, application, formatMessage)}</Text>
      )}

      {description && (
        <FieldDescription
          description={formatText(description, application, formatMessage)}
        />
      )}

      <Box paddingTop={2}>
        <CheckboxController
          id={id}
          disabled={disabled}
          name={`${id}`}
          defaultValue={
            getValueViaPath(application.answers, id, []) as string[]
          }
          error={error}
          options={finalOptions.map(({ label, tooltip, ...o }) => ({
            ...o,
            label: formatText(label, application, formatMessage),
            ...(tooltip && {
              tooltip: formatText(
                tooltip,
                application,
                formatMessage,
              ) as string,
            }),
          }))}
        />
      </Box>
    </div>
  )
}

export default CheckboxFormField
