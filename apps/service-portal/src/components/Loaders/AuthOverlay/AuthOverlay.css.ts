import { keyframes, style } from '@vanilla-extract/css'
import { zIndex } from '@island.is/service-portal/constants'

const overlayAnimation = keyframes({
  '0%': {
    transform: 'scale(1.05)',
    opacity: 0,
  },
  '100%': {
    transform: 'scale(1)',
    opacity: 1,
  },
})

export const overlay = style({
  position: 'fixed',
  top: 0,
  left: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  zIndex: zIndex.authOverlay,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  animation: `${overlayAnimation} ease-in 200ms forwards`,
})
