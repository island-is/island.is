import React, { FC, useMemo } from 'react'

import {
  FieldBaseProps,
  formatText,
  SubmitField,
} from '@island.is/application/core'
import { Box,Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { RadioController } from '@island.is/shared/form-fields'

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
