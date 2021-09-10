import React, { FC } from 'react'
import {
  Text,
  Box,
  Stack,
  GridRow,
  GridColumn,
  ActionCard,
  Table as T,
  Column,
  Columns,
} from '@island.is/island-ui/core'

interface Props {
  tables?: {
    header: string[]
    rows: string[][]
  }[]
  title?: string
}

const TableUnits: FC<Props> = ({ tables, title }) => {
  return (
    <>
      <Text variant="h3" as="h2" marginBottom={4}>
        {title}
      </Text>
      {tables?.map((table, i) => (
        <T.Table box={i > 0 ? { marginTop: 'containerGutter' } : undefined}>
          <T.Head>
            <T.Row>
              {table.header.map((header) => (
                <T.HeadData>
                  <Text variant="eyebrow">{header}</Text>
                </T.HeadData>
              ))}
            </T.Row>
          </T.Head>
          <T.Body>
            {table.rows.map((row) => (
              <T.Row>
                {row.map((rowitem) => (
                  <T.Data>{rowitem}</T.Data>
                ))}
              </T.Row>
            ))}
          </T.Body>
        </T.Table>
      ))}
    </>
  )
}

export default TableUnits
