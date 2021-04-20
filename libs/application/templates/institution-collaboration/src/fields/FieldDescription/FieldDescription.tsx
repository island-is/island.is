import React, { FC } from 'react'
import { Stack, Box, Text } from '@island.is/island-ui/core'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { MessageDescriptor } from 'react-intl'
import { useLocale } from '@island.is/localization'

type FieldDescriptionProps = FieldBaseProps & {
  field: {
    props?: {
      subTitle?: MessageDescriptor
      description?: MessageDescriptor
    }
  }
}

const FieldDescription: FC<FieldDescriptionProps> = ({
  field,
  application,
}) => {
  const { formatMessage } = useLocale()

  const { props = {} } = field

  return (
    <Stack space={1}>
      {props.subTitle && (
        <Box marginTop={5}>
          <Text variant="h4">
            {formatText(props.subTitle, application, formatMessage)}
          </Text>
        </Box>
      )}
      {props.description && (
        <Box marginBottom={2}>
          <Text>
            {formatText(props.description, application, formatMessage)}
          </Text>
        </Box>
      )}
    </Stack>
  )
}

export default FieldDescription
