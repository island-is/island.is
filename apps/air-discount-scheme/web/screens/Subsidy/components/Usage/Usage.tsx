import React from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

import { Box, Typography } from '@island.is/island-ui/core'

interface PropTypes {
  misc: string
}

function Usage({ misc }: PropTypes) {
  return (
    <Box marginBottom={6} paddingTop={6}>
      <Box marginBottom={3}>
        <Typography variant="h3">Notkun á núverandi tímabili</Typography>
      </Box>
    </Box>
  )
}

export default Usage
