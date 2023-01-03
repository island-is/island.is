import React from 'react'

import { Text, Box } from '@island.is/island-ui/core'

interface PropTypes {
  label: string | number
  value: string | number
  size?: 'h1' | 'h2' | 'h3'
  color?: 'red400'
}

function KeyValue({ label, value, color, size = 'h3' }: PropTypes) {
  return (
    <Box textAlign="left" marginRight={[2, 6]} marginBottom={2}>
      <Text variant="small">{label}</Text>
      <Text variant={size} as="h5" color={color}>
        {value}
      </Text>
    </Box>
  )
}

export default KeyValue
