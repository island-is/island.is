import { FC, Fragment } from 'react'
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
  mobile?: boolean
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
  mobile,
}) => {
  const { formatMessage } = useLocale()
  const table = { header, rows }
  const hasTable = hasExpandedTable(table)
  const columnIndexes = hasTable ? visibleColumnIndexes(table) : []

  const headerLabel = (headerCell: InteractiveTableHeaderCell) =>
    formatText(
      isHeaderColumnConfig(headerCell) ? headerCell.label : headerCell,
      application,
      formatMessage,
    )

  const isLinkColumn = (headerCell: InteractiveTableHeaderCell) =>
    isHeaderColumnConfig(headerCell) && !!headerCell.link

  const renderCell = (row: StaticText[], cellIndex: number) => {
    const cell = row[cellIndex]
    const headerCell = (header ?? [])[cellIndex]
    const url = typeof cell === 'string' ? cell : undefined

    return isLinkColumn(headerCell)
      ? url && (
          <button
            type="button"
            className={styles.invoiceLinkButton}
            aria-label={headerLabel(headerCell)}
            onClick={() => openBffDocument(url)}
          >
            <Icon icon="open" type="outline" size="small" color="blue400" />
          </button>
        )
      : formatText(cell, application, formatMessage)
  }

  return (
    <Box marginRight={mobile ? 0 : 2} marginBottom={mobile ? 0 : 3}>
      {hasTable &&
        mobile &&
        table.rows.map((row, rowIndex) => (
          <Box
            key={`expanded-row-${rowIndex}`}
            component="dl"
            className={styles.pairs}
            background="white"
            padding={2}
            borderTopWidth={rowIndex > 0 ? 'standard' : undefined}
            borderColor="blue200"
          >
            {columnIndexes
              .filter(
                (cellIndex) =>
                  !isLinkColumn(table.header[cellIndex]) || !!row[cellIndex],
              )
              .map((cellIndex) => (
                <Fragment key={`expanded-row-${rowIndex}-cell-${cellIndex}`}>
                  <dt>
                    <Text as="span" variant="medium" fontWeight="semiBold">
                      {headerLabel(table.header[cellIndex])}
                    </Text>
                  </dt>
                  <dd>
                    <Text as="span" variant="medium">
                      {renderCell(row, cellIndex)}
                    </Text>
                  </dd>
                </Fragment>
              ))}
          </Box>
        ))}
      {hasTable && !mobile && (
        <Box className={styles.expandedTable}>
          <T.Table>
            <T.Head>
              <T.Row>
                {columnIndexes.map((cellIndex) => {
                  const headerCell = table.header[cellIndex]
                  const width = isHeaderColumnConfig(headerCell)
                    ? headerCell.width
                    : undefined
                  return (
                    <T.HeadData
                      key={`expanded-header-${cellIndex}`}
                      box={{ borderBottomWidth: undefined }}
                      align={isLinkColumn(headerCell) ? 'center' : undefined}
                      style={width ? { width } : undefined}
                    >
                      {headerLabel(headerCell)}
                    </T.HeadData>
                  )
                })}
              </T.Row>
            </T.Head>
            <T.Body>
              {table.rows.map((row, rowIndex) => (
                <T.Row key={`expanded-row-${rowIndex}`}>
                  {columnIndexes.map((cellIndex) => (
                    <T.Data
                      key={`expanded-row-${rowIndex}-cell-${cellIndex}`}
                      box={{ background: 'white' }}
                    >
                      {renderCell(row, cellIndex)}
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
                {formatText(info, application, formatMessage)
                  .split(/\n\s*\n/)
                  .map((paragraph, index) => (
                    <Text
                      key={`info-paragraph-${index}`}
                      variant="small"
                      whiteSpace="preLine"
                    >
                      {paragraph.trim()}
                    </Text>
                  ))}
              </Box>
            }
          />
        </Box>
      )}
    </Box>
  )
}
