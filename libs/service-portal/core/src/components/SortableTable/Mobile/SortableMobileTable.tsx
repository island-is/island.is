import { Box, Text } from '@island.is/island-ui/core'
import React from 'react'
import MobileTableRow, { TableRow } from './MobileTableRow'

interface Props {
  header: string
  rows: TableRow[]
}

const Table: React.FC<Props> = ({ header, rows }) => {
  console.log(rows)
  return (
    <Box>
      {/* Table Header */}
      <Text>{header}</Text>
      {rows.map((tableRow, index) => (
        <MobileTableRow key={index} tableRow={tableRow} />
      ))}
    </Box>
  )
}

export default Table
