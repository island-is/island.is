import React, { FC } from 'react'
import { Box, LoadingIcon } from '@island.is/island-ui/core'

export const SubmitFormStep: FC = () => {
  return (
    <Box display="flex" justifyContent="center" paddingY={15}>
      <LoadingIcon animate size={40} />
    </Box>
  )
}
