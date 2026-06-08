import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const currencySelect = style({
  minWidth: '180px',
})

export const buttonContainer = style({
  width: '288px',
})

export const productSearchInput = style({
  height: '80px',
})

export const description = style({})

globalStyle(`${description} a`, {
  color: theme.color.blue400,
  textDecoration: 'underline',
})

export const chevronForward = style({
  width: '14px',
  height: '14px',
  marginLeft: '6px',
  marginRight: '6px',
})

export const categoryOption = style({
  ':hover': {
    backgroundColor: theme.color.blue100,
  },
})
