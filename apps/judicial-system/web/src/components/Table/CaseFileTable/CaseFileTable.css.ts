import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const linkButton = style({ cursor: 'pointer', wordBreak: 'break-all' })

export const noWrapColumn = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      whiteSpace: 'nowrap',
    },
  },
})
