import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const container = style({
  width: '100%',
  display: 'none',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      display: 'block',
    },
  },
})

export const sticky = style({
  position: 'sticky',
  top: '72px',
  borderRadius: '8px',
})

export const stickyInner = style({
  position: 'relative',
})
