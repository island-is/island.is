import React from 'react'

import { Box, Text } from '@island.is/island-ui/core'

interface Props {
  title: string
}
const PageTitle: React.FC<Props> = ({ title }) => (
  <Box marginBottom={7}>
    <Text as="h1" variant="h1">
      {title}
    </Text>
  </Box>
)

export default PageTitle
