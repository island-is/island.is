import { FC, PropsWithChildren } from 'react'

import { Box } from '@island.is/island-ui/core'

const TagContainer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box display="flex" columnGap={1} rowGap={1} flexWrap="wrap">
      {children}
    </Box>
  )
}

export default TagContainer
