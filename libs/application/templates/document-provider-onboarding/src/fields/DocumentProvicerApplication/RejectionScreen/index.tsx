import React, { FC } from 'react'

import {
  FieldBaseProps,
  formatText,
  getValueViaPath,
} from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../../forms/messages'

const RejectionScreen: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  return (
    <Box marginBottom={8}>
      <Text variant="h3">
        {formatText(m.rejectedSubHeading, application, formatMessage)}
      </Text>
      <Text marginTop={2}>
        {getValueViaPath(application.answers, 'rejectionReason') as string}
      </Text>
    </Box>
  )
}

export default RejectionScreen
