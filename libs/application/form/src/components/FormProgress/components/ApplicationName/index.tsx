import React, { FC } from 'react'
import { Box, Typography } from '@island.is/island-ui/core'

const ApplicationName: FC<{ name: string; icon?: string }> = ({
  name,
  icon,
}) => {
  return (
    <Box display="flex" alignItems="center">
      {icon && <img src={icon} alt="application-icon" />}
      <Box marginLeft={icon ? 1 : 0}>
        <Typography variant="h4">{name}</Typography>
      </Box>
    </Box>
  )
}

export default ApplicationName
