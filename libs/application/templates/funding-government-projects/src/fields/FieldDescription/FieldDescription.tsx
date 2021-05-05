import React, { FC } from 'react'
import { Stack, Box, Text } from '@island.is/island-ui/core'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { MessageDescriptor } from 'react-intl'
import { useLocale } from '@island.is/localization'

type FieldDescriptionProps = FieldBaseProps & {
  field: {
    props?: {
      description?: MessageDescriptor
    }
  }
}

export const FieldDescription: FC<FieldDescriptionProps> = ({
  field,
  application,
}) => {
  const { formatMessage } = useLocale()
  const { props = {} } = field

  return props.description ? (
    <Box marginTop={2}>
      <Text variant="h4">
        {formatText(props.description, application, formatMessage)}
      </Text>
    </Box>
  ) : null
}
