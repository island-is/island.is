import { Box, Button, Table as T, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useRef } from 'react'
import { useWindowSize } from 'react-use'
import cn from 'classnames'
import * as styles from './ScrollableMiddleTable.css'
import ScrollableMiddleTableRow from './ScrollableMiddleTableRow'

interface Columns {
  first: string
  scrollableMiddle: Array<string>
  last: string
}

interface ExpandableColumns extends Columns {
  nested: Array<Columns>
}

interface ColumnOptions {
  sticky?: boolean
  width?: number
  shadow?: boolean
}

export interface ScrollableMiddleTableProps {
  header: Columns
  rows?: Array<ExpandableColumns>
  footer?: Columns
  nested?: boolean
  options?: {
    firstColumn: ColumnOptions
    lastColumn: ColumnOptions
  }
}

const getBreakpointWidth = (width: number) => {
  if (width < theme.breakpoints.sm) {
    return '350%'
  }
  if (width < theme.breakpoints.lg) {
    return '300%'
  }

  if (width < theme.breakpoints.xl) {
    return '250%'
  }
  return '200%'
}

//Magic numbers
const FIRST_COLUMN_WIDTH = 256
const LAST_COLUMN_WIDTH = 120
const ICON_WIDTH = theme.spacing[6]

export const ScrollableMiddleTable = ({
  header,
  rows,
  footer,
  nested = false,
  options,
}: ScrollableMiddleTableProps) => {
  const { width } = useWindowSize()

  const breakpointWidth = getBreakpointWidth(width)

  const tableRef = useRef<HTMLDivElement>(null)

  const isMobile = width < theme.breakpoints.md

  const handleScroll = (type: 'backward' | 'forward') => {
    if (tableRef?.current) {
      if (type === 'backward') {
        tableRef.current.scrollLeft -= LAST_COLUMN_WIDTH / 2
      } else {
        tableRef.current.scrollLeft += LAST_COLUMN_WIDTH / 2
      }
    }
  }

  return (
    <Box overflow="auto" width="full" ref={tableRef}>
      {!isMobile && (
        <>
          <Box
            position="absolute"
            style={{
              left: `${FIRST_COLUMN_WIDTH - ICON_WIDTH / 2}px`,
              top: '45%',
              zIndex: '20',
              opacity: 0.8,
            }}
          >
            <Button
              circle
              colorScheme="light"
              icon={'arrowBack'}
              iconType="filled"
              onClick={() => handleScroll('backward')}
              size="medium"
              type="button"
              variant="primary"
            />
          </Box>
          <Box
            position="absolute"
            style={{
              right: `${LAST_COLUMN_WIDTH - ICON_WIDTH / 2}px`,
              top: '45%',
              zIndex: '20',
              opacity: 0.8,
            }}
          >
            <Button
              circle
              colorScheme="light"
              icon={'arrowForward'}
              iconType="filled"
              onClick={() => handleScroll('forward')}
              size="medium"
              type="button"
              variant="primary"
            />
          </Box>
        </>
      )}
      <T.Table
        box={{
          className: styles.table,
          overflow: 'initial',
        }}
        style={{
          tableLayout: nested ? 'fixed' : 'auto',
          width: nested ? breakpointWidth : 'initial',
        }}
      >
        <T.Head>
          <T.Row>
            <T.HeadData
              box={{
                className: cn(styles.row, styles.header, styles.expandColumn, {
                  [styles.sticky]: options?.firstColumn.sticky,
                }),
              }}
            />
            <T.HeadData
              box={{
                className: cn(styles.firstColumn, styles.header, styles.row, {
                  [styles.sticky]: options?.firstColumn.sticky,
                }),
              }}
            >
              <Text variant="small" fontWeight="medium">
                {header.first}
              </Text>
            </T.HeadData>
            {header.scrollableMiddle.map((val, index) => (
              <T.HeadData
                box={{
                  className: styles.header,
                }}
                key={`nested-table-header-col-${index}`}
              >
                <Text variant="small" fontWeight="medium">
                  {val}
                </Text>
              </T.HeadData>
            ))}
            <T.HeadData
              style={{
                width: isMobile ? 'initial' : LAST_COLUMN_WIDTH,
              }}
              box={{
                className: cn(styles.lastColumn, styles.header, styles.row, {
                  [styles.lastColumnSticky]: options?.firstColumn.sticky,
                }),
              }}
            >
              <Text textAlign="right" variant="small" fontWeight="medium">
                {header.last}
              </Text>
            </T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {rows?.map((r, rowIdx) => {
            const backgroundColor = rowIdx % 2 === 0 ? 'white' : undefined

            return (
              <ScrollableMiddleTableRow
                key={`nested-table-row-${rowIdx}`}
                backgroundColor={backgroundColor}
                data={[
                  {
                    value: <Text variant="small">{r.first}</Text>,
                    first: true,
                  },
                  ...r.scrollableMiddle.map((b) => ({
                    value: <Text variant="small">{b}</Text>,
                  })),
                  {
                    value: <Text variant="small">{r.last}</Text>,
                    last: true,
                  },
                ]}
                dataToExpand={r.nested.map((n) => {
                  console.log(n)
                  return [
                    {
                      value: <Text variant="small">{'FIRST'}</Text>,
                      first: true,
                    },
                    ...n.scrollableMiddle.map((b) => ({
                      value: <Text variant="small">{b}</Text>,
                    })),
                    {
                      value: <Text variant="small">{'LAST'}</Text>,
                      last: true,
                    },
                  ]
                })}
              />
            )
          })}
          {footer && (
            <T.Row>
              <T.Data
                box={{
                  className: cn(styles.expandColumn, {
                    [styles.sticky]: options?.firstColumn.sticky,
                  }),
                }}
              />
              <T.Data
                box={{
                  className: cn(styles.firstColumn, {
                    [styles.sticky]: options?.firstColumn.sticky,
                  }),
                }}
              >
                <Text variant="small" fontWeight="medium">
                  {footer.first}
                </Text>
              </T.Data>
              {footer.scrollableMiddle.map((val, index) => (
                <T.Data key={`nested-table-footer-col-${index}`}>
                  <Text variant="small" fontWeight="medium">
                    {val}
                  </Text>
                </T.Data>
              ))}
              <T.Data
                box={{
                  className: cn(styles.lastColumn, {
                    [styles.lastColumnSticky]: options?.lastColumn.sticky,
                  }),
                }}
              >
                <Text variant="small" fontWeight="medium">
                  {footer.last}
                </Text>
              </T.Data>
            </T.Row>
          )}
        </T.Body>
      </T.Table>
    </Box>
  )
}
