import { FC } from 'react'
import {
  Application,
  InteractiveTableHeaderCell,
  StaticText,
} from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Icon,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { formatText } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import * as styles from './InteractiveTableFormField.css'
import { openBffDocument } from './openBffDocument'

type ExpandedTable = {
  header: InteractiveTableHeaderCell[]
  rows: StaticText[][]
}

const isHeaderColumnConfig = (
  headerCell: InteractiveTableHeaderCell,
): headerCell is Exclude<InteractiveTableHeaderCell, StaticText> =>
  typeof headerCell === 'object' && headerCell !== null && 'label' in headerCell

interface Props extends Partial<ExpandedTable> {
  info?: StaticText
  application: Application
}

export const hasExpandedTable = (
  table: Partial<ExpandedTable>,
): table is ExpandedTable =>
  !!table.header && !!table.rows && table.rows.length > 0

const visibleColumnIndexes = (table: ExpandedTable): number[] =>
  table.header
    .map((_, index) => index)
    .filter((index) => {
      const headerCell = table.header[index]
      if (!isHeaderColumnConfig(headerCell) || !headerCell.link) {
        return true
      }
      return table.rows.some((row) => !!row[index])
    })

export const InteractiveTableFormFieldExpandedRow: FC<Props> = ({
  header,
  rows,
  info,
  application,
}) => {
  const { formatMessage } = useLocale()
  const table = { header, rows }
  const hasTable = hasExpandedTable(table)
  const columnIndexes = hasTable ? visibleColumnIndexes(table) : []

  return (
    <Box marginRight={2} marginBottom={3}>
      {hasTable && (
        <Box className={styles.expandedTable}>
          <T.Table>
            <T.Head>
              <T.Row>
                {columnIndexes.map((cellIndex) => {
                  const headerCell = table.header[cellIndex]
                  const label = isHeaderColumnConfig(headerCell)
                    ? headerCell.label
                    : headerCell
                  const width = isHeaderColumnConfig(headerCell)
                    ? headerCell.width
                    : undefined
                  const isLinkColumn =
                    isHeaderColumnConfig(headerCell) && !!headerCell.link
                  return (
                    <T.HeadData
                      key={`expanded-header-${cellIndex}`}
                      box={{ borderBottomWidth: undefined }}
                      align={isLinkColumn ? 'center' : undefined}
                      style={width ? { width } : undefined}
                    >
                      {formatText(label, application, formatMessage)}
                    </T.HeadData>
                  )
                })}
              </T.Row>
            </T.Head>
            <T.Body>
              {table.rows.map((row, rowIndex) => (
                <T.Row key={`expanded-row-${rowIndex}`}>
                  {columnIndexes.map((cellIndex) => {
                    const cell = row[cellIndex]
                    const headerCell = table.header[cellIndex]
                    const isLinkColumn =
                      isHeaderColumnConfig(headerCell) && !!headerCell.link
                    const url = typeof cell === 'string' ? cell : undefined

                    return (
                      <T.Data
                        key={`expanded-row-${rowIndex}-cell-${cellIndex}`}
                        box={{ background: 'white' }}
                      >
                        {isLinkColumn
                          ? url && (
                              <button
                                type="button"
                                className={styles.invoiceLinkButton}
                                aria-label={formatText(
                                  isHeaderColumnConfig(headerCell)
                                    ? headerCell.label
                                    : headerCell,
                                  application,
                                  formatMessage,
                                )}
                                onClick={() => openBffDocument(url)}
                              >
                                <Icon
                                  icon="open"
                                  type="outline"
                                  size="small"
                                  color="blue400"
                                />
                              </button>
                            )
                          : formatText(cell, application, formatMessage)}
                      </T.Data>
                    )
                  })}
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
