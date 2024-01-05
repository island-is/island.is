import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'
import { getValueViaPath, formatText } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'

import { m } from '../../../forms/messages'

const RejectionScreen: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
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
