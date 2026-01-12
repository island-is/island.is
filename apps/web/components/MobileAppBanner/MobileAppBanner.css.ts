import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const container = style({
  position: 'relative',
  padding: '12px 24px',
  marginBottom: '-8px',
  boxShadow: '0px 4px 30px rgba(0, 97, 255, 0.16)',
})

export const buttonWrapper = style({})

export const closeBtn = style({
  position: 'absolute',
  background: 'transparent',
  top: theme.spacing[1],
  left: theme.spacing[1],
})

globalStyle(`${buttonWrapper} button, ${buttonWrapper} button:hover`, {
  background: '#fff',
})
