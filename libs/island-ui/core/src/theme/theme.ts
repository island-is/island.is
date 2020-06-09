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
    small: 774,
    medium: 940,
    large: 1440,
  },
  touchableSize: 10,
  typography: {
    fontFamily: `"IBM Plex Sans", sans-serif`,
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
    subtle: '0px 4px 30px #F2F7FF',
  },
  color,
}

export type Theme = typeof theme

export type Colors =
  | 'blue600'
  | 'blue400'
  | 'blue300'
  | 'blue200'
  | 'blue100'
  | 'dark400'
  | 'dark300'
  | 'dark200'
  | 'dark100'
  | 'red600'
  | 'red400'
  | 'red300'
  | 'red200'
  | 'red100'
  | 'white'
  | 'blueberry600'
  | 'blueberry400'
  | 'blueberry300'
  | 'blueberry200'
  | 'blueberry100'
  | 'purple600'
  | 'purple400'
  | 'purple300'
  | 'purple200'
  | 'purple100'
  | 'roseTinted600'
  | 'roseTinted400'
  | 'roseTinted300'
  | 'roseTinted200'
  | 'roseTinted100'
  | 'mint600'
  | 'mint400'
  | 'mint200'
  | 'mint300'
  | 'mint100'
  | 'yellow600'
  | 'yellow400'
  | 'yellow200'
  | 'yellow300'
  | 'yellow100'
  | 'transparent'

export const themeUtils = makeThemeUtils(theme)
