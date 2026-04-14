import { StyleSheet } from 'react-native'
import * as color from './colors'
import { fontByWeight, fontByWeightItalic, lineHeightByFontSize } from './font'

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
  smallGutter: UNIT * 0.5,
  gutter: UNIT * 2,
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
  shade: {
    background: '#FFFFFF',
    foreground: '#00003C',
    shade700: '#8A8A8A',
    shade600: '#BFC1C0',
    shade500: '#CCCCD8',
    shade400: '#E4E3E2',
    shade300: '#EBEBEB',
    shade200: '#F2F2F5',
    shade100: '#FBFBFB',
  },
  spacing,
  border: {
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
  },
  color,

  // Helper Functions
  fontByWeight,
  fontByWeightItalic,
  lineHeightByFontSize,
}

export type Theme = typeof theme
export type Colors = keyof typeof color
export type Spacing = keyof typeof spacing
export type Shade = typeof theme.shade
export type Color = typeof theme.color
