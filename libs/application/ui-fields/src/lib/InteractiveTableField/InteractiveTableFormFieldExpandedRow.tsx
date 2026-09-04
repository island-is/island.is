import { FC } from 'react'
import { Application, StaticText } from '@island.is/application/types'
import { Box, Table as T } from '@island.is/island-ui/core'
import { formatText } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import * as styles from './InteractiveTableFormField.css'

interface Props {
  header: StaticText[]
  rows: StaticText[][]
  application: Application
}

export const InteractiveTableFormFieldExpandedRow: FC<Props> = ({
  header,
  rows,
  application,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box className={styles.expandedTable} marginRight={2} marginBottom={3}>
      <T.Table>
        <T.Head>
          <T.Row>
            {header.map((cell, cellIndex) => (
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
          {rows.map((row, rowIndex) => (
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
  )
}
