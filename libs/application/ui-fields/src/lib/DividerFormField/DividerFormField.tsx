import React, { FC } from 'react'

import { DividerField, Application } from '@island.is/application/types'
import { Box, Divider } from '@island.is/island-ui/core'

export const DividerFormField: FC<
  React.PropsWithChildren<{
    field: DividerField
    application: Application
  }>
> = ({ field }) => {
  const { marginTop, marginBottom } = field

  return (
    <Box
      paddingTop={2}
      paddingBottom={2}
      marginTop={marginTop}
      marginBottom={marginBottom}
    >
      <Divider />
    </Box>
  )
}
