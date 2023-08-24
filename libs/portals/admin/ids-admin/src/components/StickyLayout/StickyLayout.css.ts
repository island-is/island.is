import { zIndex } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const shadow = style({
  background:
    'linear-gradient(270deg, rgba(0, 97, 255, 0) 0%, rgba(0, 97, 255, 0.16) 50%, rgba(0, 97, 255, 0) 100%);',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: zIndex.below,
  position: 'absolute',
  height: '30px',
  filter: 'blur(30px)',
  pointerEvents: 'none',
  transition: 'opacity 0.3s ease',
})
