import { Box, Divider, Text } from '@island.is/island-ui/core'
import React from 'react'
import MobileTableRow, { TableRow } from './MobileTableRow'

interface Props {
  rows: TableRow[]
  header?: string
  inner?: boolean
}

const MobileTable: React.FC<Props> = ({ rows, header, inner }) => {
  return (
    <Box>
      {/* Table Header */}
      {header && <Text>{header}</Text>}
      {inner && (
        <Box paddingTop={2} paddingBottom={3}>
          <Divider />
        </Box>
      )}
      {rows.map((tableRow, index) => (
        <MobileTableRow
          key={index}
          tableRow={tableRow}
          inner={inner}
          background={inner ? (index % 2 === 0 ? 'white' : 'blue') : undefined}
        />
      ))}
    </Box>
  )
}

export default MobileTable
