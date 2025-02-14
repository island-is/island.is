import isEqual from 'lodash/isEqual'
import type { StyleRule } from '@vanilla-extract/css'
import omit from 'lodash/omit'
import * as color from './colors/colors'
import { font, spacing as spacingPrimitives, radius } from './tokens/tokens'
import { fontWeight, typographyValues } from './typography/typography'
import { figmaPrimitives } from './tokens/figmaPrimitives'

export const UNIT = 8

// TODO: spacing will be further updated in the followup PR
// mark as deprecated?
export const spacing = {
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
  13: UNIT * 13,
  14: UNIT * 14, // DEPRECATED
  15: UNIT * 15,
  20: UNIT * 20, // DEPRECATED
  21: UNIT * 21, // DEPRECATED
  22: UNIT * 22, // DEPRECATED
  23: UNIT * 23, // DEPRECATED
  24: UNIT * 24, // DEPRECATED
  28: UNIT * 28, // DEPRECATED
  30: UNIT * 30, // DEPRECATED
  200: UNIT * 25,
  none: UNIT * 0,
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

export const figmaSpacing = spacingPrimitives

export const zIndex = {
  below: -1,
  base: 0,
  above: 1,
  belowHeader: 9,
  header: 10,
  aboveHeader: 11,
  belowModal: 19,
  modal: 20,
  aboveModal: 21,
}

export const theme = {
  breakpoints: {
    xs: 0,
    sm: 576,
    md: 767,
    lg: 992,
    xl: 1440,
  },
  contentWidth: {
    small: 774,
    medium: 940,
    large: 1440,
  },
  headerHeight: {
    small: 80,
    large: 112,
  },
  zIndex,
  touchableSize: 10,
  typography: {
    fontFamily: `"${font.family.primary}", San Francisco, Segoe UI, sans-serif`,
    light: fontWeight.light,
    regular: fontWeight.regular,
    medium: fontWeight.medium,
    semiBold: fontWeight.semiBold,
    headingsFontWeight: fontWeight.semiBold,
    baseFontSize: typographyValues.desktop.paragraph.default.fontSize,
    baseLineHeight: `${typographyValues.desktop.paragraph.default.lineHeight} px`,
  },
  spacing,
  figmaSpacing,
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
      standard: `${radius.xs ?? 4}px`, // TODO: check with designers to keep as standard
      large: `${radius.default ?? 8}px`, // TODO: check with designers to keep as large
      md: `${radius.md ?? 12}px`,
      lg: `${radius.lg ?? 16}px`,
      full: `${radius.full ?? 9999}px`,
    },
    width: {
      standard: 1,
      large: 2,
      xl: 3,
    },
    color: {
      standard: color.blue200,
      focus: color.red200, // Ask designer what the border colors mean in sync with this?
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
    strong: '0px 4px 30px rgba(0, 97, 255, 0.16)',
    subtle: '0px 4px 30px #F2F7FF',
  },
  color,
  grid: {
    gutter: { desktop: 24, mobile: 12 },
  },
}

export type Theme = typeof theme
export type Colors = keyof typeof color

type RequiredTokens = Pick<Theme, 'breakpoints'>
type StyleWithoutMediaQueries = Exclude<StyleRule['@media'], undefined>[string]
interface ResponsiveStyle {
  xs?: StyleWithoutMediaQueries
  sm?: StyleWithoutMediaQueries
  md?: StyleWithoutMediaQueries
  lg?: StyleWithoutMediaQueries
  xl?: StyleWithoutMediaQueries
}

export const makeThemeUtils = (tokens: RequiredTokens) => {
  const makeMediaQuery =
    (breakpoint: keyof RequiredTokens['breakpoints']) =>
    (styles: StyleWithoutMediaQueries) =>
      !styles || Object.keys(styles).length === 0
        ? {}
        : {
            [`screen and (min-width: ${tokens.breakpoints[breakpoint]}px)`]:
              styles,
          }

  const mediaQuery = {
    sm: makeMediaQuery('sm'),
    md: makeMediaQuery('md'),
    lg: makeMediaQuery('lg'),
    xl: makeMediaQuery('xl'),
  }

  const responsiveStyle = ({
    xs,
    sm,
    md,
    lg,
    xl,
  }: ResponsiveStyle): StyleRule => {
    const xsStyles = omit(xs, '@media')
    const smStyles = !sm || isEqual(sm, xsStyles) ? null : sm
    const mdStyles = !md || isEqual(md, xsStyles || smStyles) ? null : md
    const lgStyles =
      !lg || isEqual(lg, xsStyles || smStyles || mdStyles) ? null : lg
    const xlStyles =
      !xl || isEqual(xl, xsStyles || smStyles || mdStyles || lgStyles)
        ? null
        : xl

    const hasMediaQueries = smStyles || mdStyles || lgStyles || xlStyles

    return {
      ...xsStyles,
      ...(hasMediaQueries
        ? {
            '@media': {
              ...(smStyles ? mediaQuery.sm(smStyles) : {}),
              ...(mdStyles ? mediaQuery.md(mdStyles) : {}),
              ...(lgStyles ? mediaQuery.lg(lgStyles) : {}),
              ...(xlStyles ? mediaQuery.xl(xlStyles) : {}),
            },
          }
        : {}),
    }
  }

  return { responsiveStyle }
}

export const themeUtils = makeThemeUtils(theme)
