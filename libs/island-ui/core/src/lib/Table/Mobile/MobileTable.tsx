import { Box } from '../../Box/Box'
import { Text } from '../../Text/Text'
import React from 'react'
import MobileTableRow, { TableRow } from './MobileTableRow'

interface Props {
  header: string
  rows: TableRow[]
}

const MobileTable: React.FC<Props> = ({ header, rows }) => {
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

export default MobileTable
