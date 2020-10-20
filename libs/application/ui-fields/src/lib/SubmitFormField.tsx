import React, { FC, useMemo } from 'react'
import { SubmitField, FieldBaseProps } from '@island.is/application/core'
import { Text, Box } from '@island.is/island-ui/core'
import { RadioController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

interface Props extends FieldBaseProps {
  field: SubmitField
}

const SubmitFormField: FC<Props> = ({ field, error }) => {
  const { id, name, actions, placement } = field
  const { formatMessage } = useLocale()
  const actionsAsOptions = useMemo(() => {
    return actions.map((a) => {
      return { label: formatMessage(a.name), value: a.event as string }
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
      <Text variant="h4">{name}</Text>
      <Box paddingTop={1}>
        <RadioController id={id} options={actionsAsOptions} error={error} />
      </Box>
    </Box>
  )
}

export default SubmitFormField
