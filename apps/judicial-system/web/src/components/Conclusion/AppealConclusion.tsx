import React from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'

import BlueBox from '../BlueBox/BlueBox'
import { conclusion as strings } from './Conclusion.strings'

interface Props {
  conclusionText?: string
}

const AppealConclusion: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const { formatMessage } = useIntl()
  const { conclusionText } = props

  return conclusionText ? (
    <BlueBox>
      <Box marginBottom={2} textAlign="center">
        <Text as="h3" variant="h3">
          {formatMessage(strings.appealTitle)}
        </Text>
      </Box>
      <Box marginBottom={3}>
        <Box marginTop={1}>
          <Text variant="intro">{conclusionText}</Text>
        </Box>
      </Box>
    </BlueBox>
  ) : null
}

export default AppealConclusion
