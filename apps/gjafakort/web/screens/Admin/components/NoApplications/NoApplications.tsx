import React from 'react'

import { Box, Typography } from '@island.is/island-ui/core'

function NoApplications() {
  return (
    <Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Box marginBottom={2} marginLeft={1}>
          <Typography variant="h1" as="h1">
            <span role="img" aria-label="tada">
              🎉
            </span>
          </Typography>
        </Box>
        <Typography variant="h1" as="h1">
          Vel gert!
        </Typography>
        <Box marginTop={4}>
          <Typography variant="intro">
            Engar umsóknir eftir til yfirferðar.
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default NoApplications
