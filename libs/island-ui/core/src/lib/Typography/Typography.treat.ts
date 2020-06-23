import { styleMap, style, globalStyle } from 'treat'
import * as CSS from 'csstype'
import { theme } from '../../theme'
import { mapToStyleProperty } from '../../utils'
import { responsiveStyleMap } from '../../utils/responsiveStyleMap'

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
  | 'breadcrumb'
  | 'tag'
  | 'cardCategoryTitle'

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

export const turnicate = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

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
    fontWeight: theme.typography.light,
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
    fontWeight: theme.typography.light,
    lineHeight: 1.416667,
  },
  eyebrow: {
    fontSize: {
      xs: 12,
      md: 14,
    },
    fontWeight: theme.typography.semiBold,
    lineHeight: 1.142857,
  },
  breadcrumb: {
    fontSize: {
      xs: 14,
      md: 16,
    },
    fontWeight: theme.typography.semiBold,
    lineHeight: 1.142857,
    color: theme.color.roseTinted400,
  },
  tag: {
    fontSize: {
      xs: 12,
      md: 14,
    },
    fontWeight: theme.typography.semiBold,
    lineHeight: 1.142857,
  },
  cardCategoryTitle: {
    fontSize: {
      xs: 20,
      md: 24,
    },
    fontWeight: theme.typography.headingsFontWeight,
    lineHeight: 1.416667,
    color: theme.color.blue400,
  },
}

export const links = style({})
globalStyle(`${links} a`, {
  color: theme.color.blue400,
  textDecoration: 'underline',
  textUnderlinePosition: 'under',
  transition: 'color .2s',
})
globalStyle(`${links} a:hover`, {
  color: theme.color.blueberry400,
  textDecoration: 'underline',
})

export const colors = styleMap(mapToStyleProperty(theme.color, 'color'))

export default Object.keys(variants).reduce((acc, variantKey) => {
  acc[variantKey] = responsiveStyleMap(variants[variantKey])
  return acc
}, {})
