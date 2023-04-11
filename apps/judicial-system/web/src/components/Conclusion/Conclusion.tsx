import React from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'

import BlueBox from '../BlueBox/BlueBox'
import { conclusion as strings } from './Conclusion.strings'

interface Props {
  conclusionText?: string
  judgeName?: string
}

const Conclusion: React.FC<Props> = (props) => {
  const { formatMessage } = useIntl()
  const { conclusionText, judgeName } = props

  return conclusionText ? (
    <BlueBox>
      <Box marginBottom={2} textAlign="center">
        <Text as="h3" variant="h3">
          {formatMessage(strings.title)}
        </Text>
      </Box>
      <Box marginBottom={3}>
        <Box marginTop={1}>
          <Text variant="intro">{conclusionText}</Text>
        </Box>
      </Box>
      {judgeName ? (
        <Box marginBottom={1} textAlign="center">
          <Text variant="h4">{judgeName}</Text>
        </Box>
      ) : null}
    </BlueBox>
  ) : null
}

export default Conclusion
