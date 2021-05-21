import React, { FC } from 'react'
import { Box, LoadingDots } from '@island.is/island-ui/core'

export const SubmitFormStep: FC = () => {
  return (
    <Box display="flex" justifyContent="center" paddingY={15}>
      <LoadingDots large />
    </Box>
  )
}
