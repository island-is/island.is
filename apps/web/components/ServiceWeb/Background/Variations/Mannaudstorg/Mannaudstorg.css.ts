import { style } from '@vanilla-extract/css'

import { DESKTOP_HEADER_HEIGHT } from '../../../constants'

export const bg = style({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
})

export const foreground = style({
  position: 'absolute',
  top: DESKTOP_HEADER_HEIGHT,
  left: 0,
  bottom: 0,
  right: 0,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
})
