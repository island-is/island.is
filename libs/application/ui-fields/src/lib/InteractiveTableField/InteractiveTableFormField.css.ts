import { globalStyle, style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

const TABLE_MIN_WIDTH = 700

export const tableWrapper = style({})

globalStyle(`${tableWrapper} table`, {
  tableLayout: 'fixed',
  width: '100%',
  minWidth: TABLE_MIN_WIDTH,
})

globalStyle(`${tableWrapper} th`, {
  height: 56,
  padding: 16,
})

globalStyle(`${tableWrapper} td`, {
  height: 56,
  padding: '12px 16px',
  overflowWrap: 'break-word',
})

globalStyle(`${tableWrapper} [data-column-index="0"]:not(:first-child)`, {
  paddingLeft: 8,
})

globalStyle(`${tableWrapper} input:not([type="checkbox"])`, {
  fontSize: 12,
  padding: 8,
  ...themeUtils.responsiveStyle({
    md: {
      fontSize: 14,
    },
  }),
})

globalStyle(`${tableWrapper} div:has(> input:not([type="checkbox"]))`, {
  padding: 0,
})

globalStyle(`${tableWrapper} div:has(> div > input:not([type="checkbox"]))`, {
  background: theme.color.white,
})

export const truncatedText = style({
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const checkboxColumnStyle = { width: 56 }
export const inputColumnHeaderStyle = { width: 155 }

export const footerRowTestId = 'interactive-table-footer-row'

globalStyle(`${tableWrapper} tr[data-testid="${footerRowTestId}"] td`, {
  borderBottomWidth: 0,
})

export const line = style({
  borderLeft: `2px solid ${theme.color.blue400}`,
  width: 0,
  height: 'calc(100% + 1px)',
  left: 0,
  top: 0,
  zIndex: 10,
  position: 'absolute',
})

export const expandedTable = style({})

globalStyle(`${tableWrapper} ${expandedTable} table`, {
  tableLayout: 'auto',
  width: '100%',
  minWidth: TABLE_MIN_WIDTH,
})

const expandedCell = {
  height: 'auto',
  padding: '12px 16px',
  fontSize: 14,
  lineHeight: '18px',
} as const

globalStyle(`${tableWrapper} ${expandedTable} th`, {
  ...expandedCell,
  fontWeight: theme.typography.semiBold,
})

globalStyle(`${tableWrapper} ${expandedTable} td`, {
  ...expandedCell,
  fontWeight: theme.typography.regular,
})

globalStyle(`${tableWrapper} ${expandedTable} tbody tr:last-child td`, {
  borderBottomWidth: 0,
})
