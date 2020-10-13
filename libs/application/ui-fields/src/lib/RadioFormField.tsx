import React, { FC } from 'react'
import {
  FieldBaseProps,
  formatText,
  getValueViaPath,
  RadioField,
} from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { Text, Box } from '@island.is/island-ui/core'
import { RadioController } from '@island.is/shared/form-fields'
import Description from './components/Description'

interface Props extends FieldBaseProps {
  field: RadioField
}
const RadioFormField: FC<Props> = ({
  showFieldName = false,
  field,
  error,
  application,
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
        <Text>{formatText(name, application, formatMessage)}</Text>
      )}

      {description && (
        <Description
          description={formatText(description, application, formatMessage)}
        />
      )}

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
          defaultValue={getValueViaPath(application.answers, id) as string[]}
          options={options.map(({ label, tooltip, ...o }) => ({
            ...o,
            label: formatText(label, application, formatMessage) as string,
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

export default RadioFormField
