import React from 'react'

import { Box, Typography } from '@island.is/island-ui/core'

import { Loader } from '@island.is/gjafakort-web/components'

interface PropTypes {
  label: string
  value: number | string
  loading: boolean
}

function Value({ label, value, loading }: PropTypes) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" paddingX={4}>
      <Typography variant="h1" color="blue400">
        {loading ? <Loader /> : value.toLocaleString('de-DE')}
      </Typography>
      <Typography variant="pSmall">{label}</Typography>
    </Box>
  )
}

export default Value
