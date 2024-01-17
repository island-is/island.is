import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

const IMAGE_WIDTH = 75
const leftPadding = IMAGE_WIDTH + theme.spacing[4]

export const border = style({
  borderColor: theme.color.white,
  borderBottomWidth: theme.border.width.standard,
})

export const footer = style({
  background: '#951A23',
})

export const alignItems = style({
  paddingLeft: `${leftPadding}px`,
})

globalStyle(`${footer} a`, {
  wordBreak: 'break-all',
  textDecoration: 'underline',
  textUnderlineOffset: '5px',
})

globalStyle(`${footer} a:hover`, {
  textDecorationThickness: '2px',
})
