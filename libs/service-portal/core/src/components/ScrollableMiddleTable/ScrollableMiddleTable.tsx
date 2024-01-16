import { Box, Table as T, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
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

export const ScrollableMiddleTable = ({
  header,
  rows,
  footer,
  nested = false,
}: ScrollableMiddleTableProps) => {
  const { width } = useWindowSize()

  const breakpointWidth = getBreakpointWidth(width)

  return (
    <Box overflow="auto" width="full">
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
              }}
            >
              <Text variant="small" fontWeight="medium">
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
                  backgroundColor:
                    rowIdx % 2 === 0 ? theme.color.white : theme.color.blue100,
                }}
              >
                {r.first}
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
                  fontWeight: 'bolder',
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
