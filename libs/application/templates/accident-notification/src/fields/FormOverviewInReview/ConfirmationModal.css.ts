import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const background = style({
  filter: `drop-shadow(0 4px 70px rgba(0, 97, 255, 0.1))`,
})

export const close = style({
  position: 'absolute',
  top: theme.spacing[1],
  right: theme.spacing[4],
  lineHeight: 0,
  padding: theme.spacing[2],
  cursor: 'pointer',
  outline: 0,
  ':before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
})

export const dialog = style({
  margin: '0 auto',
  padding: '0 24px',
  maxWidth: 888,
  position: 'relative',
})

export const center = style({
  top: '25%',

  '@media': {
    [`screen and (max-width: ${theme.breakpoints.sm}px)`]: {
      top: '15%',
    },
  },
})
