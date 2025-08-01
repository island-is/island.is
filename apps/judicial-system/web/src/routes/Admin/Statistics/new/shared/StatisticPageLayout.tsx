import { FC, PropsWithChildren } from 'react'

import { Box } from '@island.is/island-ui/core'

const StatisticPageLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box paddingX={[2, 2, 4]}>
      <Box
        display="flex"
        justifyContent="center"
        marginX={'auto'}
        marginY={[4, 4, 12]}
      >
        {children}
      </Box>
    </Box>
  )
}

export default StatisticPageLayout
