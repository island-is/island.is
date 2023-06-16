import React, { FC } from 'react'
import { Table } from '@island.is/application/ui-components'
import { FieldBaseProps } from '@island.is/application/types'
import { residenceHistoryTableData } from '../../lib/oldAgePensionUtils'
import { Box } from '@island.is/island-ui/core'

export const ResidenceHistoryTable: FC<FieldBaseProps> = ({ application }) => {
  const { data, columns } = residenceHistoryTableData(application)

  return (
    <Box paddingBottom={4}>
      <Table columns={columns} data={data} />
    </Box>
  )
}

export default ResidenceHistoryTable
