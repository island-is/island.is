import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import ResidenceHistoryTable from './ResidenceHistoryTable'

export const ResidenceHistory: FC<FieldBaseProps> = ({ application }) => {
  return (
    <Box paddingBottom={6}>
      <ResidenceHistoryTable application={application} />
    </Box>
  )
}

export default ResidenceHistory
