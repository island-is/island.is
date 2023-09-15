import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const repeaterButtons = style({})

globalStyle(`${repeaterButtons} button`, {
  flexGrow: 1,
  justifyContent: 'center',
  width: '100%',
})

globalStyle(`${repeaterButtons} button:first-child`, {
  marginRight: `${theme.spacing['1'] * 1.5}px`,
})
globalStyle(`${repeaterButtons} button:last-child`, {
  marginLeft: `${theme.spacing['1'] * 1.5}px`,
})
