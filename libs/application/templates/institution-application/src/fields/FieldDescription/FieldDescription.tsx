import React, { FC } from 'react'
import { Stack, Box, Text } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/core'

type FieldDescriptionProps = FieldBaseProps & {
  field: {
    props?: {
      title?: string
      subTitle?: string
      description?: string
    }
  }
}

const FieldDescription: FC<FieldDescriptionProps> = ({ field }) => {
  const { props = {} } = field

  return (
    <Box marginBottom={2} marginTop={5}>
      <Stack space={1}>
        {props.title && <Text variant="h2">{props.title}</Text>}
        {props.subTitle && <Text variant="h4">{props.subTitle}</Text>}
        {props.description && <Text>{props.description}</Text>}
      </Stack>
    </Box>
  )
}

export default FieldDescription
