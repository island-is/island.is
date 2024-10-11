import { style } from '@vanilla-extract/css'
import { themeUtils, theme } from '@island.is/island-ui/theme'

export const headerBg = style({
  background: 'linear-gradient(rgba(242, 247, 255, 0), rgba(242, 247, 255, 1))',
  ...themeUtils.responsiveStyle({
    xs: {
      height: 425,
    },
    sm: {
      height: 460,
    },
    md: {
      height: 475,
    },
    lg: {
      height: 255,
    },
  }),
})

export const contentContainer = style({
  maxWidth: 1440,
  width: '100%',
  height: 255,
  position: 'absolute',
  left: '50%',
  transform: 'translate(-50%, 0)',
  paddingLeft: 48,
  paddingRight: 48,
})

export const innerContentContainer = style({
  width: '100%',
  height: '100%',
  margin: '0 auto',
  position: 'relative',
})

export const contentBoxContainer = style({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'unset',
  rowGap: theme.spacing.gutter,

  ...themeUtils.responsiveStyle({
    lg: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      columnGap: theme.spacing.containerGutter,
      rowGap: 'unset',
    },
  }),
})

export const image = style({
  ...themeUtils.responsiveStyle({
    xs: {
      maxHeight: 150,
      maxWidth: 330,
    },
    sm: {
      maxHeight: 225,
      maxWidth: 500,
    },
    lg: {
      maxHeight: 255,
    },
  }),
})

export const headerTitle = style({
  textAlign: 'center',

  ...themeUtils.responsiveStyle({
    lg: {
      textAlign: 'unset',
    },
  }),
})

export const logoContainer = style({
  width: 136,
  height: 136,
  boxShadow: '0px 4px 30px rgba(0, 97, 255, 0.08)',
  display: 'grid',
  placeItems: 'center',
  margin: '0 auto',
  marginBottom: 4,
  borderRadius: theme.border.radius.circle,
  background: theme.color.white,

  ...themeUtils.responsiveStyle({
    lg: {
      marginBottom: 'unset',
      margin: 'unset',
      position: 'absolute',
      bottom: -32,
      left: '7%',
    },
  }),
})

export const logo = style({
  width: 70,
  height: 70,
})
