import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const tabBar = style({
  display: 'inline-flex',
  //background: `linear-gradient(to bottom, ${theme.color.white} 50%, ${theme.color.blue100} 50%)`,
  background: theme.color.blue100,
  height: `${theme.spacing[7]}px`,
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)`]: {
      height: 0,
      overflow: 'hidden',
      display: 'none',
    },
  },
})
