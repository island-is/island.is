import { theme, themeUtils } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'
import { SERVICE_PORTAL_HEADER_HEIGHT_SM as hheight } from '@island.is/portals/my-pages/constants'

export const modalBase = style({
  width: '100%',
  height: `calc(100vh - ${hheight}px)`,
  background: theme.color.white,
  position: 'relative',
  top: 'calc(-0.5rem + 1px)',
  zIndex: 100,
})

export const modalHeader = style({
  height: '3.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 1rem',
  borderBlock: `0.0625rem solid ${theme.color.blue200}`,
})

export const docWrap = style({
  ...themeUtils.responsiveStyle({
    md: {
      minHeight: `67%`,
    },
  }),
})

export const modalContent = style({
  padding: '1.5rem 1rem',
})

globalStyle(`${modalHeader} > div`, {
  display: 'flex',
})

globalStyle(`${modalHeader} button`, {
  padding: '0.5rem',
  height: 40,
  width: 40,
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
