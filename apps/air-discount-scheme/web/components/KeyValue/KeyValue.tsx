import React from 'react'

import { Typography, Box } from '@island.is/island-ui/core'

interface PropTypes {
  label: string | number
  value: string | number
  size?: 'h1' | 'h2' | 'h3'
  color?: 'red400'
}

function KeyValue({ label, value, color, size = 'h3' }: PropTypes) {
  return (
    <Box textAlign="left" marginRight={[2, 6]} marginBottom={2}>
      <Typography variant="pSmall">{label}</Typography>
      <Typography variant={size} as="h5" color={color}>
        {value}
      </Typography>
    </Box>
  )
}

export default KeyValue
