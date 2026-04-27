import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

const MOBILE = `screen and (max-width: ${theme.breakpoints.md}px)`

export const header = style({
  padding: '10px 0 10px 0',
  backgroundColor: theme.color.blue100,
  borderBottom: `1px solid ${theme.border.color.blue200}`,
})

export const tableWrapper = style({
  width: '100%',
  '@media': {
    [MOBILE]: {
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch',
    },
  },
})
