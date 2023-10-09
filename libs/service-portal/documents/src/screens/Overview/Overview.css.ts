import { theme, themeUtils } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'
import { SERVICE_PORTAL_HEADER_HEIGHT_SM as hheight } from '@island.is/service-portal/constants'
export const loading = style({
  minHeight: 200,
})

export const loadingContainer = style({
  height: '100vh',
})

export const btn = style({})

export const modalBase = style({
  width: '100vw',
  height: `calc(100vh - ${hheight}px)`,
  background: theme.color.white,
  position: 'absolute',
  top: 'calc(-0.5rem + 1px)',
  left: '-1rem',
  zIndex: 100,
})

export const bullet = style({
  height: 4,
  width: 4,
  backgroundColor: theme.color.blue400,
})

export const modalHeader = style({
  height: '3.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 1rem',
  borderBlock: `0.0625rem solid ${theme.color.blue200}`,
})

export const checkboxWrap = style({
  width: 48,
  display: 'flex',
  justifyContent: 'center',
})

export const docWrap = style({
  ...themeUtils.responsiveStyle({
    md: {
      minHeight: `calc(50vh - ${hheight}px)`,
    },
  }),
})

export const filterActionButtons = style({})

globalStyle(`${filterActionButtons} button:hover`, {
  backgroundColor: theme.color.white,
})

globalStyle(`${checkboxWrap} label > div`, {
  marginRight: 0,
})

export const pdfPage = style({
  background: theme.color.blue100,
})

export const modalContent = style({
  padding: '1.5rem 1rem',
})

globalStyle(`${btn} > span, ${btn} > h1`, {
  boxShadow: 'none',
})

globalStyle(`${modalHeader} > div`, {
  display: 'flex',
})

globalStyle(`${modalHeader} button`, {
  padding: '0.5rem',
  height: 40,
  width: 40,
})
