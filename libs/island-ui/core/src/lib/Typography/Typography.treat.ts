import { style } from 'treat'
import * as CSS from 'csstype'
import { isObject } from 'lodash'
import { theme } from '../../theme/'

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
    fontSize: {
      xs: theme.typography.h1FontSizeMobile,
      md: theme.typography.h1FontSize,
    },
    fontWeight: theme.typography.headingsFontWeight,
    lineHeight: theme.typography.h1LineHeight,
  },
  h2: {
    fontSize: {
      xs: theme.typography.h2FontSizeMobile,
      md: theme.typography.h2FontSize,
    },
    fontWeight: theme.typography.headingsFontWeight,
    lineHeight: theme.typography.h2LineHeight,
  },
  h3: {
    fontSize: {
      xs: theme.typography.h3FontSizeMobile,
      md: theme.typography.h3FontSize,
    },
    fontWeight: theme.typography.headingsFontWeight,
    lineHeight: theme.typography.h3LineHeight,
  },
  h4: {
    fontSize: {
      xs: theme.typography.h4FontSizeMobile,
      md: theme.typography.h4FontSize,
    },
    fontWeight: theme.typography.headingsFontWeight,
    lineHeight: theme.typography.h4LineHeight,
  },
  h5: {
    fontSize: {
      xs: theme.typography.h5FontSizeMobile,
      md: theme.typography.h5FontSize,
    },
    fontWeight: theme.typography.headingsFontWeight,
    lineHeight: theme.typography.h5LineHeight,
  },
  p: {
    fontSize: {
      xs: theme.typography.baseFontSizeMobile,
      md: theme.typography.baseFontSize,
    },
    fontWeight: theme.typography.baseFontWeight,
    lineHeight: theme.typography.baseLineHeight,
  },
  pSmall: {
    fontSize: {
      xs: theme.typography.smallFontSizeMobile,
      md: theme.typography.smallFontSize,
    },
    fontWeight: theme.typography.smallFontWeight,
    lineHeight: theme.typography.smallLineHeight,
  },
  intro: {
    fontSize: {
      xs: theme.typography.introFontSizeMobile,
      md: theme.typography.introFontSize,
    },
    fontWeight: theme.typography.baseFontWeight,
    lineHeight: theme.typography.introLineHeight,
  },
  eyebrow: {
    fontSize: {
      xs: theme.typography.eyebrowFontSizeMobile,
      md: theme.typography.eyebrowFontSize,
    },
    fontWeight: theme.typography.eyebrowFontWeight,
    lineHeight: theme.typography.eyebrowLineHeight,
    color: theme.color.red400,
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
