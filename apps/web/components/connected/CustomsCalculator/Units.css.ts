import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const buttonContainer = style({
  width: '288px',
  maxWidth: '100%',
})

// The fluid button is 100% wide on top of its padding, which makes it
// overflow the container unless the padding is included in the width
globalStyle(`${buttonContainer} button`, {
  boxSizing: 'border-box',
})

export const link = style({
  color: theme.color.blue400,
  textDecoration: 'underline',
})
