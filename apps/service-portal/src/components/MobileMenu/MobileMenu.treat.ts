import { theme } from '@island.is/island-ui/theme'
import {
  SERVICE_PORTAL_HEADER_HEIGHT_SM,
  zIndex,
} from '@island.is/service-portal/constants'
import { style } from 'treat'

export const wrapper = style({
  top: SERVICE_PORTAL_HEADER_HEIGHT_SM,
  zIndex: zIndex.mobileMenu,
  maxHeight: `calc(100vh - ${SERVICE_PORTAL_HEADER_HEIGHT_SM}px - 74px)`,
  overflowY: 'auto',
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

export const figure = style({
  width: '100%',
  height: '26vw',
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
