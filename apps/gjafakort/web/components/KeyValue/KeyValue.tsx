import React from 'react'

import { Box, Typography } from '@island.is/island-ui/core'

interface PropTypes {
  label: string | number
  value: string | number
  size?: 'h1' | 'h2' | 'h3' | 'p'
  color?: 'blue400' | 'red600'
}

function KeyValue({ label, value, color, size = 'h3' }: PropTypes) {
  return (
    <Box
      textAlign={isNaN(Number(value)) ? 'left' : 'right'}
      marginRight={[2, 6]}
      marginBottom={2}
    >
      <Typography variant="pSmall">{label}</Typography>
      <Typography variant={size} as="h5" color={color}>
        {value}
      </Typography>
    </Box>
  )
}

export default KeyValue
