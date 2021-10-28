import { theme } from '@island.is/island-ui/theme'
import {
  SERVICE_PORTAL_HEADER_HEIGHT_SM,
  zIndex,
} from '@island.is/service-portal/constants'
import { keyframes, style } from '@vanilla-extract/css'

const wrapperAnimation = keyframes({
  '0%': {
    transform: 'scale(1.05)',
    opacity: 0,
  },
  '100%': {
    transform: 'scale(1)',
    opacity: 1,
  },
})

export const wrapper = style({
  top: SERVICE_PORTAL_HEADER_HEIGHT_SM,
  zIndex: zIndex.mobileMenu,
  maxHeight: `calc(100vh - ${SERVICE_PORTAL_HEADER_HEIGHT_SM}px)`,
  overflowY: 'auto',
  animation: `${wrapperAnimation} ease-in 200ms forwards`,
})

export const figureCard = style({
  boxShadow: '0px 4px 70px rgba(0, 97, 255, 0.1)',
})

export const figure = style({
  width: '42%',
  paddingTop: '95%',
  margin: '0 auto',
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '50% 50%',
})

export const icon = style({
  width: 48,
  height: 48,
})

export const link = style({
  display: 'block',
  height: '100%',
  paddingBottom: theme.spacing['1'],
})
