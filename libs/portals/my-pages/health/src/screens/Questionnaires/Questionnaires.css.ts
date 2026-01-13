import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const select = style({
  minWidth: 250,
  marginTop: 0,
  paddingTop: 0,
})

export const button = style({
  minWidth: 175, // minWidth from design
})

export const toggleBox = style({})

export const toggleButton = style({
  fontSize: 16,
  marginBottom: 0,
})

export const answeredContainer = style({
  maxWidth: theme.breakpoints.xl,
})

globalStyle(`${toggleBox} > p`, {
  fontSize: 16,
})
