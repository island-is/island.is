import { style } from 'treat'
import { zIndex } from '@island.is/service-portal/constants'

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
  '@keyframes': {
    '0%': {
      transform: 'scale(1.05)',
      opacity: 0,
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 1,
    },
  },
  animation: '@keyframes ease-in 200ms forwards',
})
