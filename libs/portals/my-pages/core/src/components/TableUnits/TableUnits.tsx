import React, { FC } from 'react'
import { ExcludesFalse, tableStyles } from '../../utils/utils'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { Text, Box, Button, Table as T } from '@island.is/island-ui/core'
type Tables = {
  header: string[]
  rows: (string | number)[][]
  paginate?: any
}

interface Props {
  tables?: Array<Tables | null>
  title?: string
  paginateCallback?: () => void
}

export const TableUnits: FC<React.PropsWithChildren<Props>> = ({
  tables,
  title,
  paginateCallback,
}) => {
  const { formatMessage } = useLocale()
  const getMoreItems = () => {
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
      {tables?.filter(Boolean as unknown as ExcludesFalse)?.map((table, i) => (
        <T.Table
          key={`table-unit-${i}`}
          box={i > 0 ? { marginTop: 'containerGutter' } : undefined}
        >
          <T.Head>
            <T.Row>
              {table.header.map((header, ii) => (
                <T.HeadData key={`head-${ii}`} style={tableStyles}>
                  <Text variant="medium" fontWeight="semiBold">
                    {header}
                  </Text>
                </T.HeadData>
              ))}
            </T.Row>
          </T.Head>
          <T.Body>
            {table.rows.map((row, iii) => (
              <T.Row key={`trow-${iii}`}>
                {row.map((rowitem, iiii) => (
                  <T.Data key={`tdata-${iiii}`} style={tableStyles}>
                    <Text variant="medium">{rowitem}</Text>
                  </T.Data>
                ))}
              </T.Row>
            ))}
            {table.paginate ? (
              <T.Row>
                <T.Data borderColor="white" colSpan={5} style={tableStyles}>
                  <Box
                    alignItems="center"
                    justifyContent="center"
                    display="flex"
                  >
                    <Button
                      size="small"
                      variant="text"
                      onClick={() => getMoreItems()}
                    >
                      {formatMessage(m.fetchMore)}
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
