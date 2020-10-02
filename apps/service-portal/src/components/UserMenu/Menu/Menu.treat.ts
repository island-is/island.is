import { style } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'
import {
  SERVICE_PORTAL_HEADER_HEIGHT_SM,
  zIndex,
} from '@island.is/service-portal/constants'

export const menu = style({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: zIndex.userMenu,
  opacity: 0,
  overflowY: 'auto',
  visibility: 'hidden',
  transform: `0, -${theme.spacing['2']}px, 0)`,
  transition: 'opacity 300ms, transform 200ms',
  ...themeUtils.responsiveStyle({
    md: {
      top: theme.spacing['2'],
      left: 'auto',
      width: 360,
      transform: `translate3d(-${theme.spacing['15']}px, -${theme.spacing['2']}px, 0)`,
    },
  }),
})

export const overlay = style({
  opacity: 0,
  visibility: 'hidden',
  transition: 'opacity 300ms',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: zIndex.userMenu - 1,
})

export const isOpen = style({
  zIndex: 1,
  opacity: 1,
  visibility: 'visible',
  transform: `translate3d(0px, 0px, 0px)`,
  ...themeUtils.responsiveStyle({
    md: {
      transform: `translate3d(-${theme.spacing['15']}px, 0px, 0)`,
    },
  }),
})

export const overlayIsOpen = style({
  zIndex: 1,
  opacity: 1,
  visibility: 'visible',
})

export const avatar = style({
  width: 56,
  height: 56,
  marginRight: theme.spacing['3'],
  backgroundSize: 'cover',
  borderRadius: '100%',
})

export const closeButton = style({
  alignSelf: 'flex-start',
  marginLeft: 'auto',
  marginTop: -theme.spacing['1'],
  marginRight: -theme.spacing['1'],
  cursor: 'pointer',
  transition: 'transform 200ms',
  ':hover': {
    transform: 'scale(1.3)',
  },
})
