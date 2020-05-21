import { style } from 'treat'
import * as CSS from 'csstype'
import { isObject } from 'lodash'
import * as theme from '../../theme/variables'

export type VariantTypes =
  | 'p'
  | 'pSmall'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'intro'
  | 'eyebrow'

type ResponsiveProps<T> = {
  xs?: T
  sm?: T
  md?: T
  lg?: T
  xl?: T
}

type Variants = {
  [Type in VariantTypes]: CSS.Properties<
    string | ResponsiveProps<string | number>
  >
}

export const variants: Variants = {
  h1: {
    fontSize: { xs: theme.h1FontSizeMobile, md: theme.h1FontSize },
    fontWeight: theme.headingsFontWeight,
    lineHeight: theme.h1LineHeight,
  },
  h2: {
    fontSize: { xs: theme.h2FontSizeMobile, md: theme.h2FontSize },
    fontWeight: theme.headingsFontWeight,
    lineHeight: theme.h2LineHeight,
  },
  h3: {
    fontSize: { xs: theme.h3FontSizeMobile, md: theme.h3FontSize },
    fontWeight: theme.headingsFontWeight,
    lineHeight: theme.h3LineHeight,
  },
  h4: {
    fontSize: { xs: theme.h4FontSizeMobile, md: theme.h4FontSize },
    fontWeight: theme.headingsFontWeight,
    lineHeight: theme.h4LineHeight,
  },
  h5: {
    fontSize: { xs: theme.h5FontSizeMobile, md: theme.h5FontSize },
    fontWeight: theme.headingsFontWeight,
    lineHeight: theme.h5LineHeight,
  },
  p: {
    fontSize: { xs: theme.baseFontSizeMobile, md: theme.baseFontSize },
    fontWeight: theme.baseFontWeight,
    lineHeight: theme.baseLineHeight,
  },
  pSmall: {
    fontSize: { xs: theme.smallFontSizeMobile, md: theme.smallFontSize },
    fontWeight: theme.smallFontWeight,
    lineHeight: theme.smallLineHeight,
  },
  intro: {
    fontSize: { xs: theme.introFontSizeMobile, md: theme.introFontSize },
    fontWeight: theme.baseFontWeight,
    lineHeight: theme.introLineHeight,
  },
  eyebrow: {
    fontSize: { xs: theme.eyebrowFontSizeMobile, md: theme.eyebrowFontSize },
    fontWeight: theme.eyebrowFontWeight,
    lineHeight: theme.eyebrowLineHeight,
    color: theme.eyebrowColor,
  },
}

const resolveBreakpoints = (variant, attr, acc) => {
  if (isObject(variant[attr])) {
    Object.keys(variant[attr]).reduce((acc, breakpointKey) => {
      if (breakpointKey === 'xs') {
        acc[attr] = variant[attr].xs
      } else {
        if (!acc['@media']) {
          acc['@media'] = {}
        }
        if (
          !acc['@media'][`(min-width: ${theme.breakpoints[breakpointKey]}px)`]
        ) {
          acc['@media'][
            `(min-width: ${theme.breakpoints[breakpointKey]}px)`
          ] = {}
        }
        acc['@media'][`(min-width: ${theme.breakpoints[breakpointKey]}px)`] = {
          ...acc['@media'][
            `(min-width: ${theme.breakpoints[breakpointKey]}px)`
          ],
          fontSize: variant[attr][breakpointKey],
        }
      }
      return acc
    }, acc)
  } else {
    acc[attr] = variant[attr]
  }
  return acc
}

export default Object.keys(variants).reduce((acc, variantKey) => {
  acc[variantKey] = style(
    Object.keys(variants[variantKey]).reduce(
      (acc, attr) => resolveBreakpoints(variants[variantKey], attr, acc),
      {},
    ),
  )
  return acc
}, {})
