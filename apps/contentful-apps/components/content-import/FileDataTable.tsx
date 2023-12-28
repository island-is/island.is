import { useMemo, useState } from 'react'
import { Box, Button, Flex, Table } from '@contentful/f36-components'

import { FileData } from './utils'

const ROW_COUNT_INCREMENT = 100

export const getTableData = (data: FileData) => {
  const headCells = data?.[0] ?? []
  const bodyRows =
    data?.slice(1).filter((row) => row?.some((text) => text)) ?? []

  let longestRowLength = 0
  for (const row of bodyRows) {
    if (row.length > longestRowLength) {
      longestRowLength = row.length
    }
  }

  // Make sure we have as many head cells as we have fields in rows
  if (headCells.length > longestRowLength) {
    headCells.length = longestRowLength
  }

  return {
    headCells,
    bodyRows,
  }
}

interface FileDataTableProps {
  data: FileData
  successfulRowIndexes: number[]
  publishFailedRowIndexes: number[]
  failedRowIndexes: number[]
}

export const FileDataTable = ({
  data,
  failedRowIndexes,
  publishFailedRowIndexes,
  successfulRowIndexes,
}: FileDataTableProps) => {
  const { headCells, bodyRows } = useMemo(() => getTableData(data), [data])
  const [displayedRowCount, setDisplayedRowCount] =
    useState(ROW_COUNT_INCREMENT)

  if (headCells.length === 0) return null

  return (
    <Box
      style={{
        width: '100%',
        display: 'block',
        overflowX: 'scroll',
      }}
    >
      <Table>
        <Table.Head>
          <Table.Row>
            {headCells.map((text, index) => (
              <Table.Cell key={index}>{text}</Table.Cell>
            ))}
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {bodyRows.slice(0, displayedRowCount).map((row, index) => {
            let backgroundColor = undefined
            if (successfulRowIndexes.includes(index)) {
              backgroundColor = 'rgba(0, 255, 0, 0.2)'
            } else if (publishFailedRowIndexes.includes(index)) {
              backgroundColor = 'rgba(255, 255, 120, 0.2)'
            } else if (failedRowIndexes.includes(index)) {
              backgroundColor = 'rgba(255, 0, 0, 0.2)'
            }
            return (
              <Table.Row key={index}>
                {(row ?? []).map((text, index) => {
                  return (
                    <Table.Cell
                      key={index}
                      style={{
                        backgroundColor,
                      }}
                    >
                      {text}
                    </Table.Cell>
                  )
                })}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>

      {displayedRowCount < bodyRows.length && (
        <Flex fullWidth justifyContent="center">
          <Button
            onClick={() => {
              setDisplayedRowCount((prev) => prev + ROW_COUNT_INCREMENT)
            }}
          >
            Show {ROW_COUNT_INCREMENT} more (
            {bodyRows.length - displayedRowCount})
          </Button>
        </Flex>
      )}
    </Box>
  )
}
