import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const sidebarContent = style({
  display: 'none',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'block',
    },
  },
})
