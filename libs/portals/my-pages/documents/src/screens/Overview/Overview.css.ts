import { theme, themeUtils } from '@island.is/island-ui/theme'
import { SERVICE_PORTAL_HEADER_HEIGHT_SM } from '@island.is/portals/my-pages/constants'
import { globalStyle, style } from '@vanilla-extract/css'

export const btn = style({})

export const checkboxWrap = style({
  width: 48,
  display: 'flex',
  justifyContent: 'center',
})

export const bullet = style({
  height: 4,
  width: 4,
  marginTop: 2,
  backgroundColor: theme.color.blue400,
  ...themeUtils.responsiveStyle({
    xs: {
      marginTop: 4,
    },
  }),
})

export const loading = style({
  minHeight: 200,
})
export const gridContainer = style({
  ...themeUtils.responsiveStyle({
    xs: {
      position: 'absolute',
      height: `calc(100vh - ${SERVICE_PORTAL_HEADER_HEIGHT_SM}px)`,
    },
    md: {
      height: 'inherit',
      position: 'unset',
    },
  }),
})

export const gridRow = style({
  ...themeUtils.responsiveStyle({
    xs: {
      height: '100%',
    },
    md: {
      height: 'inherit',
    },
  }),
})

export const documentDisplayGridColumn = style({
  ...themeUtils.responsiveStyle({
    xs: {
      overflow: 'hidden',
    },
    md: {
      overflow: 'visible',
    },
  }),
})

globalStyle(`${checkboxWrap} label > div`, {
  marginRight: 0,
})

globalStyle(`${btn} > span, ${btn} > h1`, {
  boxShadow: 'none',
  cursor: 'pointer',
  marginTop: 4,
  transition: 'color .2s, box-shadow .2s',
  ...themeUtils.responsiveStyle({
    md: { marginTop: 3 },
  }),
})

globalStyle(`${btn} > h1:hover`, {
  color: theme.color.blueberry400,
  boxShadow: `inset 0 -2px 0 0 ${theme.color.blueberry400}`,
})
