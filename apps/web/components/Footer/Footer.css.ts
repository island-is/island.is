import { style } from '@vanilla-extract/css'

export const noWrap = style({
  display: 'flex',
  flexFlow: 'row nowrap',
})

export const fullWidth = style({
  width: '100%',
})
