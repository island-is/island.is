import React, { FC } from 'react'

import { Box } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'

const AdvancedLicense: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  console.log('application', application)
  return <Box marginBottom={4}>bla</Box>
}

export { AdvancedLicense }
