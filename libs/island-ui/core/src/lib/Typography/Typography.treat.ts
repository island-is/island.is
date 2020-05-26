import { style } from 'treat'
import * as CSS from 'csstype'
import { isObject } from 'lodash'
import { theme } from '../../theme'

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
  | 'footerLink'
  | 'footerLinkLarge'

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
      xs: 32,
      md: 42,
    },
    fontWeight: theme.typography.headingsFontWeight,
    lineHeight: 1.238095,
  },
  h2: {
    fontSize: {
      xs: 26,
      md: 34,
    },
    fontWeight: theme.typography.headingsFontWeight,
    lineHeight: 1.294118,
  },
  h3: {
    fontSize: {
      xs: 20,
      md: 24,
    },
    fontWeight: theme.typography.headingsFontWeight,
    lineHeight: 1.416667,
  },
  h4: {
    fontSize: {
      xs: 18,
      md: 20,
    },
    fontWeight: theme.typography.headingsFontWeight,
    lineHeight: 1.5,
  },
  h5: {
    fontSize: {
      xs: 15,
      md: 18,
    },
    fontWeight: theme.typography.headingsFontWeight,
    lineHeight: 1.5,
  },
  p: {
    fontSize: {
      xs: 15,
      md: 18,
    },
    fontWeight: theme.typography.regular,
    lineHeight: 1.5,
  },
  pSmall: {
    fontSize: {
      xs: 12,
      md: 15,
    },
    fontWeight: theme.typography.regular,
    lineHeight: 1.666,
  },
  intro: {
    fontSize: {
      xs: 20,
      md: 24,
    },
    fontWeight: theme.typography.regular,
    lineHeight: 1.416667,
  },
  eyebrow: {
    fontSize: {
      xs: 12,
      md: 14,
    },
    fontWeight: theme.typography.medium,
    lineHeight: 1.142857,
    color: theme.color.red400,
  },
  footerLink: {
    fontSize: {
      xs: 20,
      sm: 18,
    },
    fontWeight: theme.typography.light,
    lineHeight: 1.416667,
    color: theme.color.white,
  },
  footerLinkLarge: {
    fontSize: {
      xs: 20,
      xl: 24,
    },
    fontWeight: theme.typography.light,
    lineHeight: 1.416667,
    color: theme.color.white,
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
