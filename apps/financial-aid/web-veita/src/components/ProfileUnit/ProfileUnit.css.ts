import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  display: 'grid',
  gridColumn: '1/-1',
  gridTemplateColumns: 'repeat(4, 1fr)',
  width: '100%',
  columnGap: theme.spacing[3],
  rowGap: theme.spacing[4],
  paddingBottom: theme.spacing[4],
  marginBottom: theme.spacing[3],
  overflowX: 'scroll',
})

export const headings = style({
  gridColumn: '1/-1',
})

export const button = style({
  color: theme.color.blue400,
  selectors: {
    '&:hover': {
      color: theme.color.blueberry400,
    },
  },
})
