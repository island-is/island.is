import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const sidebarWrapper = style({
  // Sticky sidebars are sensitive to their containers
  // so we can't wrap Hidden around it.
  display: 'none',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'block',
    },
  },
})
