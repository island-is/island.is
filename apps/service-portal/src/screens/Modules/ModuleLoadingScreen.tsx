import React, { FC } from 'react'
import { Box, Typography } from '@island.is/island-ui/core'

interface Props {
  name: string
}

const ModuleLoadingScreen: FC<Props> = ({ name }) => {
  return (
    <Box padding={8}>
      <Typography variant="h2" as="h2">
        Sæki {name}
      </Typography>
    </Box>
  )
}

export default ModuleLoadingScreen
