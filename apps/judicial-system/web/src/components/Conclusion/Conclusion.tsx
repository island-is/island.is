import React from 'react'

import { Box, Text } from '@island.is/island-ui/core'

import BlueBox from '../BlueBox/BlueBox'

interface Props {
  title: string
  conclusionText?: string
  judgeName?: string
}

const Conclusion: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const { conclusionText, judgeName, title } = props

  return conclusionText ? (
    <BlueBox>
      <Box marginBottom={2} textAlign="center">
        <Text as="h3" variant="h3">
          {title}
        </Text>
      </Box>
      <Box marginBottom={3}>
        <Box marginTop={1}>
          <Text variant="intro" textAlign="justify">
            {conclusionText}
          </Text>
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
