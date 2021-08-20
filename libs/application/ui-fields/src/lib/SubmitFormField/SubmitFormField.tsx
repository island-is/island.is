import React, { FC, useMemo } from 'react'

import {
  SubmitField,
  FieldBaseProps,
  formatText,
} from '@island.is/application/core'
import { Text, Box } from '@island.is/island-ui/core'
import { RadioController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

interface Props extends FieldBaseProps {
  field: SubmitField
}

export const SubmitFormField: FC<Props> = ({ application, field, error }) => {
  const { id, title, actions, placement } = field
  const { formatMessage } = useLocale()
  const actionsAsOptions = useMemo(() => {
    return actions.map((a) => {
      return {
        label: formatText(a.name, application, formatMessage),
        value: a.event as string,
      }
    })
  }, [actions, formatMessage])

  if (placement === 'footer') {
    return null
  }

  return (
    <Box
      background="blue100"
      borderRadius="large"
      width="full"
      padding={4}
      marginTop={4}
    >
      <Text variant="h4">{formatText(title, application, formatMessage)}</Text>
      <Box paddingTop={1}>
        <RadioController id={id} options={actionsAsOptions} error={error} />
      </Box>
    </Box>
  )
}
