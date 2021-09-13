import React, { FC } from 'react'
import { Text, Table as T } from '@island.is/island-ui/core'

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
        <T.Table
          key={`table-unit-${i}`}
          box={i > 0 ? { marginTop: 'containerGutter' } : undefined}
        >
          <T.Head>
            <T.Row>
              {table.header.map((header, ii) => (
                <T.HeadData key={`head-${ii}`}>
                  <Text variant="eyebrow">{header}</Text>
                </T.HeadData>
              ))}
            </T.Row>
          </T.Head>
          <T.Body>
            {table.rows.map((row, iii) => (
              <T.Row key={`trow-${iii}`}>
                {row.map((rowitem, iiii) => (
                  <T.Data key={`tdata-${iiii}`}>{rowitem}</T.Data>
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
