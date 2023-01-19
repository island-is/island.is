import { style } from '@vanilla-extract/css'

export const container = style({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  backgroundRepeat: 'no-repeat',
  backgroundPositionX: 'center',
  backgroundPositionY: 'top',
  backgroundSize: 'cover',
})
