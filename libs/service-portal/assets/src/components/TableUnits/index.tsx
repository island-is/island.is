import React, { FC } from 'react'
import { Text, Box, Button, Table as T } from '@island.is/island-ui/core'

interface Props {
  tables?: {
    header: string[]
    rows: (string | number)[][]
    paginate?: any
  }[]
  title?: string
  paginateCallback?: () => void
}

const TableUnits: FC<Props> = ({ tables, title, paginateCallback }) => {
  const setThePage = () => {
    if (paginateCallback) {
      paginateCallback()
    }
  }

  return (
    <>
      {title ? (
        <Text variant="h3" as="h2" marginBottom={4}>
          {title}
        </Text>
      ) : null}
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
            {table.paginate ? (
              <T.Row>
                <T.Data borderColor="white" colSpan={5}>
                  <Box
                    alignItems="center"
                    justifyContent="center"
                    display="flex"
                  >
                    <Button
                      size="small"
                      variant="text"
                      onClick={() => setThePage()}
                    >
                      Sækja meira
                    </Button>
                  </Box>
                </T.Data>
              </T.Row>
            ) : null}
          </T.Body>
        </T.Table>
      ))}
    </>
  )
}

export default TableUnits
