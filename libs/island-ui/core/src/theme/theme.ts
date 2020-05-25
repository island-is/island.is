import { makeThemeUtils } from '../themeUtils'
import * as color from '../theme/colors'

export const UNIT = 8
const spacing = {
  0: UNIT * 0,
  1: UNIT * 1,
  2: UNIT * 2,
  3: UNIT * 3,
  4: UNIT * 4,
  5: UNIT * 5,
  6: UNIT * 6,
  7: UNIT * 7,
  8: UNIT * 8,
  9: UNIT * 9,
  10: UNIT * 10,
  12: UNIT * 12,
  15: UNIT * 15,
  20: UNIT * 20,
  none: UNIT * 0,
  smallGutter: UNIT * 0.5,
  gutter: UNIT * 2,
  containerGutter: UNIT * 6,
}

export const theme = {
  breakpoints: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
  },
  contentWidth: {
    medium: 940,
    large: 1440,
  },
  touchableSize: 10,
  typography: {
    fontFamily: `"IBM Plex Sans", sans-serif`,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightSemiBold: 600,
    baseFontWeight: 400,
    headingsFontWeight: 500,
    eyebrowFontWeight: 500,
    h1FontSize: 42,
    h1LineHeight: 1.238095,
    h2FontSize: 34,
    h2LineHeight: 1.294118,
    h3FontSize: 24,
    h3LineHeight: 1.416667,
    h4FontSize: 20,
    h4LineHeight: 1.5,
    h5FontSize: 18,
    h5LineHeight: 1.555556,
    eyebrowFontSize: 14,
    eyebrowLineHeight: 1.142857,
    introFontSize: 24,
    introLineHeight: 1.416667,
    baseFontSize: 18,
    baseLineHeight: 1.555556,
    smallFontWeight: 400,
    smallFontSize: 15,
    smallLineHeight: 1.666667,

    // Typography mobile
    h1FontSizeMobile: 32,
    h2FontSizeMobile: 26,
    h3FontSizeMobile: 20,
    h4FontSizeMobile: 18,
    h5FontSizeMobile: 15,
    introFontSizeMobile: 20,
    baseFontSizeMobile: 15,
    smallFontSizeMobile: 12,
    eyebrowFontSizeMobile: 12,
  },
  spacing,
  transforms: {
    touchable: 'scale(0.98)',
  },
  transitions: {
    fast: 'transform .125s ease, opacity .125s ease',
    touchable: 'transform 0.2s cubic-bezier(0.02, 1.505, 0.745, 1.235)',
  },
  border: {
    radius: {
      standard: '4px',
      circle: '50%',
    },
    width: {
      standard: 1,
      large: 2,
    },
    color: {
      standard: color.blue200,
      focus: color.red200,
    },
  },
  shadows: {
    small:
      '0 2px 4px 0px rgba(28,28,28,.1), 0 2px 2px -2px rgba(28,28,28,.1), 0 4px 4px -4px rgba(28,28,28,.2)',
    medium:
      '0 2px 4px 0px rgba(28,28,28,.1), 0 8px 8px -4px rgba(28,28,28,.1), 0 12px 12px -8px rgba(28,28,28,.2)',
    large:
      '0 2px 4px 0px rgba(28,28,28,.1), 0 12px 12px -4px rgba(28,28,28,.1), 0 20px 20px -12px rgba(28,28,28,.2)',
  },
  color,
}

export type Theme = typeof theme

export const themeUtils = makeThemeUtils(theme)
