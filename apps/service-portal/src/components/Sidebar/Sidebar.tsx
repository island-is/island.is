/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import { Box, Typography, Stack, Divider } from '@island.is/island-ui/core'

export const Sidebar: FC<{}> = () => {
  return (
    <Box background="purple100" padding={4}>
      <Stack space={[1, 1, 2]}>
        <Typography variant="h4" as="h4">
          Sidebar
        </Typography>
        <Divider />
      </Stack>
    </Box>
  )
}

export default Sidebar
