import { Box, Table as T } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useCallback, useEffect, useRef } from 'react'
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
  scrollPos?: number
  onScroll?: (scrollPosition: number) => void
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
  nested = false,
  onScroll,
  scrollPos,
}: ScrollableMiddleTableProps) => {
  const { width } = useWindowSize()

  const breakpointWidth = getBreakpointWidth(width)
  const ref = useRef<HTMLElement>(null)

  const handleScroll = useCallback(() => {
    if (ref?.current && onScroll) {
      const scrollLeft = ref?.current.scrollLeft
      onScroll(scrollLeft)
    }
  }, [onScroll])

  useEffect(
    () => ref.current?.addEventListener('scroll', handleScroll),
    [handleScroll, onScroll, ref],
  )

  useEffect(() => {
    if (ref.current && scrollPos) {
      ref.current.scrollLeft = scrollPos
    }
  }, [scrollPos])

  return (
    <Box overflow="auto" width="full" ref={ref}>
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
              {header.first}
            </T.HeadData>
            {header.scrollableMiddle.map((val, index) => (
              <T.HeadData key={`nested-table-header-col-${index}`}>
                {val}
              </T.HeadData>
            ))}
            <T.HeadData
              style={{
                position: 'sticky',
                right: 0,
                backgroundColor: theme.color.blue100,
              }}
            >
              {header.last}
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
                  backgroundColor: theme.color.white,
                }}
              >
                {r.first}
              </T.Data>
              {r.scrollableMiddle.map((val, idx) => (
                <T.Data key={`nested-table-row-${rowIdx}-cell-${idx}`}>
                  {val}
                </T.Data>
              ))}
              <T.Data
                style={{
                  position: 'sticky',
                  right: 0,
                  backgroundColor: theme.color.white,
                }}
              >
                {r.last}
              </T.Data>
            </T.Row>
          ))}
        </T.Body>
      </T.Table>
    </Box>
  )
}
