import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const htmlContainer = style({})

globalStyle(`${htmlContainer} * a`, {
  color: theme.color.blue400,
  textDecoration: 'underline',
  textUnderlineOffset: '0.2em',
})

globalStyle(`${htmlContainer} a:hover`, {
  backgroundColor: 'transparent',
  boxShadow: `inset 0 -2px 0 0 ${theme.color.blueberry400}`,
  color: `${theme.color.blueberry400}`,
  transition: `box-shadow .25s, color .25s, background-color .25s`,
})
