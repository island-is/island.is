import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const container = style({
  overflowY: 'auto',
  overflowX: 'hidden',
  width: '80%',
  height: '100%',
  maxWidth: '305px',
  marginLeft: 'auto',
  background: theme.color.white,
  padding: '37px 24px',
  boxShadow: '-5px 4px 10px 4px rgba(0, 0, 0, 0.2)',
})

export const icon = style({
  marginRight: '20px',
})

export const mobileContent = style({
  marginTop: '40px',
})

export const links = style({
  paddingLeft: '10px',
  paddingRight: '10px',
})
