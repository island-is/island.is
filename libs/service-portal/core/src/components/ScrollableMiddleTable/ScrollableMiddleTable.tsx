import { Box, Button, Table as T, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useRef } from 'react'
import { useWindowSize } from 'react-use'

export interface Columns {
  first: string
  scrollableMiddle: Array<string>
  last: string
}

export interface ScrollableMiddleTableProps {
  header: Columns
  rows?: Array<Columns>
  footer?: Columns
  nested?: boolean
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
const FIRST_COLUMN_WIDTH = theme.spacing[23]
const LAST_COLUMN_WIDTH = theme.spacing[20]
const ICON_WIDTH = theme.spacing[6]

export const ScrollableMiddleTable = ({
  header,
  rows,
  footer,
  nested = false,
}: ScrollableMiddleTableProps) => {
  const { width } = useWindowSize()

  const breakpointWidth = getBreakpointWidth(width)

  const tableRef = useRef<HTMLDivElement>(null)

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
      <T.Table
        style={{
          tableLayout: nested ? 'fixed' : 'auto',
          width: nested ? breakpointWidth : 'initial',
          textOverflow: 'ellipsis',
        }}
      >
        <T.Head>
          <T.Row>
            <T.HeadData
              style={{
                position: 'sticky',
                left: 0,
                backgroundColor: theme.color.blue100,
                width: `${FIRST_COLUMN_WIDTH}px`,
                borderRight: `1px solid ${theme.border.color.blue200}`,
                boxShadow: `4px 0px 8px -2px ${theme.border.color.blue200}`,
              }}
            >
              <Text variant="small" fontWeight="medium">
                {header.first}
              </Text>
            </T.HeadData>
            {header.scrollableMiddle.map((val, index) => (
              <T.HeadData key={`nested-table-header-col-${index}`}>
                <Text variant="small" fontWeight="medium">
                  {val}
                </Text>
              </T.HeadData>
            ))}
            <T.HeadData
              style={{
                position: 'sticky',
                right: 0,
                backgroundColor: theme.color.blue100,
                width: `${LAST_COLUMN_WIDTH}px`,
                borderLeft: `1px solid ${theme.border.color.blue200}`,
                boxShadow: `-4px 0px 8px -2px ${theme.border.color.blue200}`,
              }}
            >
              <Text textAlign="right" variant="small" fontWeight="medium">
                {header.last}
              </Text>
            </T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {rows?.map((r, rowIdx) => (
            <T.Row key={`nested-table-row-${rowIdx}`}>
              <T.Data
                style={{
                  position: 'sticky',
                  left: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  borderRight: `1px solid ${theme.border.color.blue200} `,
                  boxShadow: `4px 0px 8px -2px ${theme.border.color.blue200}`,
                  backgroundColor:
                    rowIdx % 2 === 0 ? theme.color.white : theme.color.blue100,
                }}
              >
                <Text variant="small">{r.first}</Text>
              </T.Data>
              {r.scrollableMiddle.map((val, idx) => (
                <T.Data
                  style={{
                    backgroundColor:
                      rowIdx % 2 === 0
                        ? theme.color.white
                        : theme.color.blue100,
                  }}
                  key={`nested-table-row-${rowIdx}-cell-${idx}`}
                >
                  {val}
                </T.Data>
              ))}
              <T.Data
                style={{
                  position: 'sticky',
                  right: 0,
                  borderLeft: `1px solid ${theme.border.color.blue200}`,
                  boxShadow: `-4px 0px 8px -2px ${theme.border.color.blue200}`,
                  backgroundColor:
                    rowIdx % 2 === 0 ? theme.color.white : theme.color.blue100,
                }}
              >
                {r.last}
              </T.Data>
            </T.Row>
          ))}
          {footer && (
            <T.Row>
              <T.Data
                style={{
                  position: 'sticky',
                  left: 0,
                  backgroundColor: theme.color.white,
                  borderRight: `1px solid ${theme.border.color.blue200}`,
                  boxShadow: `4px 0px 6px -2px ${theme.border.color.blue200}`,
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
                style={{
                  position: 'sticky',
                  right: 0,
                  backgroundColor: theme.color.white,
                  borderLeft: `1px solid ${theme.border.color.blue200}`,
                  boxShadow: `-4px 0px 8px -2px ${theme.border.color.blue200}`,
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
