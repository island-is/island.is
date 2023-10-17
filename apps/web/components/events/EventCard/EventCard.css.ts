import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const imageContainer = style({
  paddingRight: 15,
  paddingLeft: 15,
})

export const image = style({
  width: 'auto',
  height: 'auto',
  maxWidth: 300,
  maxHeight: 300,
})

export const wrapper = style({
  display: 'flex',
  justifyContent: 'space-between',
  background: theme.color.white,
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
})
