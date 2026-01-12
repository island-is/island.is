import { useState } from 'react'
import { Box, Button, Flex } from '@contentful/f36-components'
import { Table } from '@contentful/f36-table'

import { CONTENTFUL_ENVIRONMENT } from '../../constants'
import { FileData } from './utils'

const ROW_COUNT_INCREMENT = 100

export const getTableData = (data: FileData) => {
  const headCells = data?.[0] ?? []
  const bodyRows = (
    data?.slice(1).filter((row) => row?.some((text) => text)) ?? []
  ).map((row) => ({
    row: row.map((text) =>
      typeof text === 'number' ? Math.round(text) : text,
    ) as string[],
  }))

  let longestRowLength = 0
  for (const { row } of bodyRows) {
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
  headCells: string[]
  bodyRows: { row: string[]; id?: string; errorMessage?: string }[]
}

export const FileDataTable = ({ headCells, bodyRows }: FileDataTableProps) => {
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
            {bodyRows.some(({ errorMessage }) => Boolean(errorMessage)) && (
              <Table.Cell>Error message</Table.Cell>
            )}
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {bodyRows.slice(0, displayedRowCount).map((item, index) => {
            const href = item?.id
              ? `https://app.contentful.com/spaces/8k0h54kbe6bj/environments/${CONTENTFUL_ENVIRONMENT}/entries/${item.id}`
              : undefined
            return (
              <Table.Row key={index}>
                {(item?.row ?? []).map((text, index) => {
                  return (
                    <Table.Cell key={index}>
                      <a rel="noreferrer" target="_blank" href={href}>
                        {text}
                      </a>
                    </Table.Cell>
                  )
                })}
                <Table.Cell>{item.errorMessage}</Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>

      {displayedRowCount < bodyRows.length && (
        <Flex fullWidth justifyContent="center" paddingTop="spacingM">
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
