import React, { FC } from 'react'

import { DividerField } from '@island.is/application/types'
import { Box, Divider } from '@island.is/island-ui/core'

export const DividerFormField: FC<
  React.PropsWithChildren<{
    field: DividerField
  }>
> = ({ field }) => {
  const { useDividerLine, marginTop, marginBottom } = field

  return (
    <Box
      paddingTop={useDividerLine ? 2 : 0}
      paddingBottom={useDividerLine ? 2 : 0}
      marginTop={marginTop}
      marginBottom={marginBottom}
    >
      {useDividerLine && <Divider />}
    </Box>
  )
}
