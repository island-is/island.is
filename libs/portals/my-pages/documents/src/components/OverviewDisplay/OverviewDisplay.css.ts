import { theme, themeUtils } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'
import { SERVICE_PORTAL_HEADER_HEIGHT_SM as hheight } from '@island.is/portals/my-pages/constants'
import { StyleWithSelectors } from '@vanilla-extract/css/dist/declarations/src/types'

export const modalBase = style({
  width: '100%',
  height: '100%',
  background: theme.color.white,
  position: 'relative',
  top: -theme.spacing[1],
  zIndex: 100,
})

const modalHeaderSidesBase: StyleWithSelectors = {
  content: '""',
  position: 'absolute',
  top: -1,
  height: '3.5rem',
  width: 16,
  backgroundColor: theme.color.white,
}
export const modalHeader = style({
  height: '3.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: theme.color.white,
  position: 'sticky',
  zIndex: 1500,
  top: 0,
  '::before': {
    ...modalHeaderSidesBase,
    left: -16,
  },
  '::after': {
    ...modalHeaderSidesBase,
    right: -16,
  },
  transition: 'top 250ms ease',
  transitionDelay: '100ms',
})

export const modalHeaderScrollingUp = style({
  top: hheight - 1,
})

export const docWrap = style({
  ...themeUtils.responsiveStyle({
    md: {
      minHeight: `67%`,
      width: '100%',
    },
  }),
})

export const modalContent = style({
  paddingBottom: theme.spacing[2],
  ...themeUtils.responsiveStyle({
    md: {
      padding: '1.5rem 1rem',
    },
  }),
})

globalStyle(`${modalHeader} > div`, {
  marginLeft: 'auto',
})

globalStyle(`${modalHeader} button`, {
  padding: '0.5rem',
  height: 40,
  width: 40,
})

globalStyle(`${modalHeader} > div:first-child`, {
  margin: 'unset',
})

export const reveal = style({
  position: 'fixed',
  bottom: 20,
  right: 20,
  padding: 10,
  background: theme.color.dark400,
  color: theme.color.white,
  borderRadius: theme.border.radius.large,
  opacity: 0,
  borderWidth: 1,
  outline: 0,
  textDecoration: 'none',
  borderStyle: 'solid',
  borderColor: theme.color.blue200,
  overflow: 'hidden',
  zIndex: 1,
  '@media': {
    [`screen and (max-width: 991px)`]: {
      borderRadius: 0,
      border: 'none',
    },
  },
  transition: 'transform 150ms ease',
  transform: `translateY(calc(100% + 20px))`,
  ':focus-within': {
    transform: `translateY(0)`,
    opacity: 1,
  },
})
