import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, Link } from '@island.is/island-ui/core'
import InfoScreen from '../../components/InfoScreen'
import { m } from '../../../forms/messages'

const ThankYouScreen: FC<FieldBaseProps> = ({ field, application }) => {
  return (
    <Box marginTop={[2, 3]}>
      <Box marginBottom={2}>
        <Text variant="h3">
          {m.firstThankYouScreenScreenSubTitle.defaultMessage}{' '}
        </Text>
      </Box>
      <Box marginBottom={2}>
        <Text>{m.firstThankYouScreenScreenMessage.defaultMessage}</Text>
      </Box>
      <InfoScreen message={m.testPhaseInfoScreenMessage.defaultMessage} />
    </Box>
  )
}

export default ThankYouScreen
