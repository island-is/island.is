import React, { FC } from 'react'
import { Box, Typography, Icon, Divider } from '@island.is/island-ui/core'

const ApplicationList: FC<{}> = () => {
  return (
    <>
      <Box border="standard" padding={4}>
        <Box display="flex" alignItems="center" marginBottom={2}>
          <Icon type="info" width={18} />
          <Box marginLeft={2}>
            <Typography variant="h3" as="h3">
              Umsókn um ökuskírteini
            </Typography>
          </Box>
        </Box>
        <Typography variant="p" as="p" color="dark400">
          Þú hefur ekki klárað umsóknarferlið fyrir ökuskirteini
        </Typography>
        <Box marginY={3}>
          <Divider weight="alternate" />
        </Box>
      </Box>
    </>
  )
}

export default ApplicationList
