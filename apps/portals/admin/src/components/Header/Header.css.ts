import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const header = style({
  zIndex: theme.zIndex.header,
  display: 'flex',
  alignItems: 'center',
  height: theme.headerHeight.small,
  backgroundColor: theme.color.blue100,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      height: theme.headerHeight.large,
    },
  },
  transition: 'all 250ms ease-in-out',
})
