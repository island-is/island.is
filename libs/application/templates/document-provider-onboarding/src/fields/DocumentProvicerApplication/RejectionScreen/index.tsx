import React, { FC } from 'react'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../../../forms/messages'

const RejectionScreen: FC<FieldBaseProps> = ({ application }) => {
  return (
    <Box marginBottom={8}>
      <Text variant="h3">{m.rejectedSubHeading}</Text>
      <Text marginTop={2}>
        {getValueViaPath(application.answers, 'rejectionReason') as string}
      </Text>
    </Box>
  )
}

export default RejectionScreen
