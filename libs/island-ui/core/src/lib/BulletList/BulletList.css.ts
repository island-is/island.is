import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  counterReset: 'section',
})

export const bullet = style({
  display: 'inline-block',
  width: '24px',
  ':before': {
    display: 'none',
    color: theme.color.red400,
    fontWeight: theme.typography.semiBold,
    counterIncrement: 'section',
    content: 'counter(section)',
  },
})

export const numbered = style({
  ':before': {
    display: 'inline-block',
  },
})

export const icon = style({
  position: 'relative',
  display: 'inline-block',
  top: '-2px',

  ':before': {
    content: ' ',
    display: 'block',
    width: theme.spacing[1],
    height: theme.spacing[1],
    backgroundColor: theme.color.red400,
    borderRadius: '50%',
  },
})
