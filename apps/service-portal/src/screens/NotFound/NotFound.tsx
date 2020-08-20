import React, { FC } from 'react'
import { Box, Typography } from '@island.is/island-ui/core'

const NotFound: FC<{}> = () => {
  return (
    <Box display="flex" justifyContent="center" margin={12}>
      <Typography variant="h2">404, síða fannst ekki</Typography>
    </Box>
  )
}

export default NotFound
