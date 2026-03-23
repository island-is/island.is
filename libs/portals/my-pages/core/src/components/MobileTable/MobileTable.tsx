import { Box, LoadingDots, Text } from '@island.is/island-ui/core'
import React from 'react'
import MobileTableRow, { TableRow } from './MobileTableRow'

interface Props {
  rows: TableRow[]
  header?: string
  inner?: boolean
  loading?: boolean
}

export const MobileTable: React.FC<Props> = ({
  rows,
  header,
  inner,
  loading,
}) => {
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        margin={4}
        width="full"
      >
        <LoadingDots />
      </Box>
    )
  }

  return (
    <Box marginTop={2}>
      {/* Table Header */}
      {header && <Text>{header}</Text>}

      {rows.map((tableRow, index) => (
        <MobileTableRow
          key={index}
          tableRow={tableRow}
          inner={inner}
          background={inner ? (index % 2 === 0 ? 'white' : 'blue') : undefined}
          first={index === 0}
        />
      ))}
    </Box>
  )
}
