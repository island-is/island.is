import { StyleSheet } from 'react-native'
import * as color from './colors'

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
  21: UNIT * 21,
  22: UNIT * 22,
  23: UNIT * 23,
  24: UNIT * 24,
  25: UNIT * 25,
  26: UNIT * 26,
  27: UNIT * 27,
  28: UNIT * 28,
  29: UNIT * 29,
  30: UNIT * 30,
  none: 0,
  smallGutter: UNIT * 0.5,
  gutter: UNIT * 2,
  containerGutter: UNIT * 6,
  auto: 'auto',
  p1: 8,
  p2: 12,
  p3: 14,
  p4: 16,
  p5: 18,
}

export const theme = {
  mode: 'light',
  light: color,
  dark: color,
  breakpoints: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1440,
  },
  contentWidth: {
    small: 774,
    medium: 940,
    large: 1440,
  },
  touchableSize: 10,
  typography: {
    fontFamily: `"IBM Plex Sans", San Francisco, Segoe UI, sans-serif`,
    light: 300,
    regular: 400,
    medium: 500,
    semiBold: 600,
    headingsFontWeight: 600,
    baseFontSize: 18,
    baseLineHeight: 1.5,
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
    style: {
      solid: 'solid',
    },
    radius: {
      standard: '4px',
      large: '8px',
      extraLarge: '16px',
      full: '100px',
    },
    width: {
      hairline: StyleSheet.hairlineWidth,
      standard: 1,
      large: 2,
      xl: 3,
    },
    color: {
      standard: color.blue200,
      focus: color.red200,
      ...color,
    },
  },
  shadows: {
    small:
      '0 2px 4px 0px rgba(28,28,28,.1), 0 2px 2px -2px rgba(28,28,28,.1), 0 4px 4px -4px rgba(28,28,28,.2)',
    medium:
      '0 2px 4px 0px rgba(28,28,28,.1), 0 8px 8px -4px rgba(28,28,28,.1), 0 12px 12px -8px rgba(28,28,28,.2)',
    large:
      '0 2px 4px 0px rgba(28,28,28,.1), 0 12px 12px -4px rgba(28,28,28,.1), 0 20px 20px -12px rgba(28,28,28,.2)',
    subtle: '0px 4px 30px #F2F7FF',
  },
  color,
  grid: {
    gutter: { desktop: 24, mobile: 12 },
  },
}

export type Theme = typeof theme
export type Colors = keyof typeof color
export type Spacing = keyof typeof spacing
