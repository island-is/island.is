import React, { FC } from 'react'
import { Text, Table as T, Column, Columns } from '@island.is/island-ui/core'

interface GridItem {
  title: string
  value: string
}

interface Props {
  tables?: {
    header: GridItem
    rows: GridItem[][]
  }[]
  title?: string
}

const AssetGrid: FC<Props> = ({ tables, title }) => {
  return (
    <>
      <Text variant="h3" as="h2" marginBottom={4}>
        {title}
      </Text>
      {tables?.map((table, i) => (
        <T.Table box={i > 0 ? { marginTop: 'containerGutter' } : undefined}>
          <T.Head>
            <T.Row>
              <T.HeadData colSpan={4}>
                <Text variant="eyebrow" as="span">
                  {table.header.title}
                </Text>{' '}
                <Text variant="small" as="span">
                  {table.header.value}
                </Text>
              </T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {table.rows.map((row) => (
              <T.Row>
                {row.map((rowitem) => (
                  <T.Data colSpan={2}>
                    <Columns>
                      <Column>
                        <Text variant="eyebrow" as="span">
                          {rowitem.title}
                        </Text>
                      </Column>
                      <Column>{rowitem.value}</Column>
                    </Columns>
                  </T.Data>
                ))}
              </T.Row>
            ))}
          </T.Body>
        </T.Table>
      ))}
    </>
  )
}

export default AssetGrid
