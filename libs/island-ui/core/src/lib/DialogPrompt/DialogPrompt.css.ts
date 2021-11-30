import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

const spacing = theme.spacing[2]

export const content = style({
  filter: `drop-shadow(0 4px 70px rgba(0, 97, 255, 0.1))`,
})

export const close = style({
  position: 'absolute',
  top: spacing,
  right: spacing,
  lineHeight: 0,
  padding: spacing,
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
  margin: '32px auto',
  maxWidth: 888,
})
