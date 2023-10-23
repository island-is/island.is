import { theme, themeUtils } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'
import { SERVICE_PORTAL_HEADER_HEIGHT_SM as hheight } from '@island.is/service-portal/constants'

export const modalBase = style({
  width: '100vw',
  height: `calc(100vh - ${hheight}px)`,
  background: theme.color.white,
  position: 'absolute',
  top: 'calc(-0.5rem + 1px)',
  left: '-1rem',
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
      minHeight: `650px`,
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
