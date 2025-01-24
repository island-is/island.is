import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const container = style({
  borderRadius: '50%',
  width: 90,
  height: 90,
  color: theme.color.blue400,
  backgroundColor: theme.color.blue100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const clickable = style({
  cursor: 'pointer',
})

export const image = style({
  maxWidth: '45%',
  maxHeight: '55%',
  width: 'auto',
  height: 'auto',
})

export const red = style({
  color: theme.color.red400,
  backgroundColor: theme.color.red100,
})

export const gradient = style({
  background:
    'linear-gradient(68.06deg, #0161FD -18.22%, #3F46D2 28.44%, #812EA4 76.96%, #C21578 125.49%, #FD0050 168.41%)',
})

export const small = style({
  width: 48,
  height: 48,
})

export const center = style({
  margin: '0 auto',
})
