import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const tabBar = style({
  display: 'inline-flex',
  background: theme.color.blue100,
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)`]: {
      height: 0,
      overflow: 'hidden',
      display: 'none',
    },
  },
})

export const alternativeTabDivider = style({
  height: '90%',
  margin: 'auto',
  inset: 0,
  width: '1px',
  background: theme.color.blue200,
})
