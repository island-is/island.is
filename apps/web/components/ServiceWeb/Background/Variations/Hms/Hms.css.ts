import { style } from '@vanilla-extract/css'

import { DESKTOP_HEADER_HEIGHT } from '../../../constants'

export const bg = style({
  position: 'absolute',
  top: '0',
  left: '0',
  bottom: '0',
  right: '0',
  background:
    'linear-gradient(90deg,rgba(156, 203, 208, 1),rgba(215, 241, 244, 1))',
})

export const bgImageLeft = style({
  position: 'absolute',
  top: DESKTOP_HEADER_HEIGHT,
  left: 0,
  bottom: 0,
  right: '60%',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'top right',
  backgroundSize: 'auto',
})

export const bgImageRight = style({
  position: 'absolute',
  top: DESKTOP_HEADER_HEIGHT,
  left: '70%',
  bottom: 0,
  right: '-70%',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'left center',
  backgroundSize: 'auto',
})
