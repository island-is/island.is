import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const relative = style({
  position: 'relative',
})

globalStyle(`${relative} a`, {
  textDecoration: 'none',
})

export const subLink = style({
  width: 'fit-content',
})

export const fill = style({
  width: '100%',
})

export const linkContainer = style({
  ':hover': {
    borderColor: theme.color.purple400,
  },
})
