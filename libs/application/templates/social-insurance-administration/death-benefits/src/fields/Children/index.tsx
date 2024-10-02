import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import ChildrenTable from './ChildrenTable'

export const Children: FC<FieldBaseProps> = ({ application }) => {
  return (
    <Box paddingBottom={6}>
      <ChildrenTable application={application} />
    </Box>
  )
}

export default Children
