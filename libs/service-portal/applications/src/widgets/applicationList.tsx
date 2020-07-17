import React, { FC } from 'react'
import { Box, Typography } from '@island.is/island-ui/core'

const ApplicationList: FC<{}> = () => {
  return (
    <>
      <Typography variant="h3" as="h3">
        Umsóknir
      </Typography>
      <Box border="standard" padding={2} marginTop={1}>
        <Typography variant="h3" as="h3">
          Umsókn um ökuskírteini
        </Typography>
      </Box>
    </>
  )
}

export default ApplicationList
