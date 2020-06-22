import React from 'react'

import { Box, Typography } from '@island.is/island-ui/core'

interface PropTypes {
  label: string
  value: number | string
}

function Value({ label, value }: PropTypes) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" paddingX={4}>
      <Typography variant="h1" color="blue400">
        {value.toLocaleString('de-DE')}
      </Typography>
      <Typography variant="pSmall">{label}</Typography>
    </Box>
  )
}

export default Value
