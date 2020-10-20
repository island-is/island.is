import { theme } from '@island.is/island-ui/theme'
import { style } from 'treat'

export const icon = style({
  position: 'relative',
  display: 'inline-block',
  top: '-4px',
  left: 'calc(50% - 4px)',
})

export const bullet = style({
  display: 'inline-block',
  width: '32px',
})

export const name = style({
  whiteSpace: 'nowrap',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      whiteSpace: 'inherit',
    },
  },
})
