import { FC } from 'react'
import { Application, StaticText } from '@island.is/application/types'
import { AlertMessage, Box, Table as T, Text } from '@island.is/island-ui/core'
import { formatText } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import * as styles from './InteractiveTableFormField.css'

type ExpandedTable = {
  header: StaticText[]
  rows: StaticText[][]
}

interface Props extends Partial<ExpandedTable> {
  info?: StaticText
  application: Application
}

export const hasExpandedTable = (
  table: Partial<ExpandedTable>,
): table is ExpandedTable =>
  !!table.header && !!table.rows && table.rows.length > 0

export const InteractiveTableFormFieldExpandedRow: FC<Props> = ({
  header,
  rows,
  info,
  application,
}) => {
  const { formatMessage } = useLocale()
  const table = { header, rows }
  const hasTable = hasExpandedTable(table)

  return (
    <Box marginRight={2} marginBottom={3}>
      {hasTable && (
        <Box className={styles.expandedTable}>
          <T.Table box={{ overflow: 'visible' }}>
            <T.Head>
              <T.Row>
                {table.header.map((cell, cellIndex) => (
                  <T.HeadData
                    key={`expanded-header-${cellIndex}`}
                    box={{ borderBottomWidth: undefined }}
                  >
                    {formatText(cell, application, formatMessage)}
                  </T.HeadData>
                ))}
              </T.Row>
            </T.Head>
            <T.Body>
              {table.rows.map((row, rowIndex) => (
                <T.Row key={`expanded-row-${rowIndex}`}>
                  {row.map((cell, cellIndex) => (
                    <T.Data
                      key={`expanded-row-${rowIndex}-cell-${cellIndex}`}
                      box={{ background: 'white' }}
                    >
                      {formatText(cell, application, formatMessage)}
                    </T.Data>
                  ))}
                </T.Row>
              ))}
            </T.Body>
          </T.Table>
        </Box>
      )}
      {info && (
        <Box marginTop={hasTable ? 2 : 0}>
          <AlertMessage
            type="info"
            message={
              <Box flexGrow={1}>
                <Text variant="small" whiteSpace="preLine">
                  {formatText(info, application, formatMessage)}
                </Text>
              </Box>
            }
          />
        </Box>
      )}
    </Box>
  )
}
