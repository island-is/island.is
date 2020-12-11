import { Box } from '@island.is/island-ui/core'
import React from 'react'
const BlueBox: React.FC = ({ children }) => (
  <Box background="blue100" padding={3} borderRadius="large">
    {children}
  </Box>
)

export default BlueBox
