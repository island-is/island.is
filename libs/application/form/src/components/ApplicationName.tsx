import React, { FC } from 'react'
import { Box, Typography } from '@island.is/island-ui/core'

const ApplicationName: FC<{ name: string }> = ({ name }) => (
  <Box paddingTop={4} paddingBottom={4} paddingLeft={10} border="standard">
    <Typography variant="h4">{name}</Typography>
  </Box>
)

export default ApplicationName
