import { style } from '@vanilla-extract/css'

export const link = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 96,
  width: 96,
  ':hover': {
    textDecoration: 'none',
  },
})

export const tooltip = style({
  position: 'absolute',
  top: 1,
  right: -1,
})
