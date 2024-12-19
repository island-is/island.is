import { Box, SkeletonLoader, Stack } from '@island.is/island-ui/core'
import { useIsMobile } from '@island.is/portals/my-pages/core'
import React from 'react'

interface Props {
  amount?: number
}
export const Loader = ({ amount = 3 }: Props) => {
  const { isMobile } = useIsMobile()
  const length = isMobile ? 200 : 500
  const loaderItem = (
    <Box
      display="flex"
      alignItems="center"
      paddingY={[4, 3, 4]}
      paddingX={[2, 3, 4]}
      border="standard"
      borderRadius="large"
    >
      <div>
        <SkeletonLoader display="block" width={length} height={24} />
      </div>
    </Box>
  )
  return (
    <Stack space={2}>
      {Array.from({ length: amount }).map((_, i) => (
        <React.Fragment key={i}>{loaderItem}</React.Fragment>
      ))}
    </Stack>
  )
}
