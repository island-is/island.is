import { Box } from '@island.is/island-ui/core'
import React from 'react'

interface Props {
  size?: 'small' | 'large'
}

const BlueBox: React.FC<Props> = (props) => {
  const { children, size = 'large' } = props

  return (
    <Box
      background="blue100"
      paddingX={3}
      paddingY={size === 'small' ? 2 : 3}
      borderRadius="large"
    >
      {children}
    </Box>
  )
}

export default BlueBox
