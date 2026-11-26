import { ReactNode } from 'react'

import { Box } from '@island.is/island-ui/core'

export const StepButtons = ({
  back,
  forward,
}: {
  back: ReactNode
  forward: ReactNode
}) => (
  <Box
    display="flex"
    justifyContent="spaceBetween"
    flexWrap="wrap"
    columnGap={2}
    rowGap={2}
    marginTop={5}
  >
    {back}
    {forward}
  </Box>
)
