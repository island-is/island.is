import { styleVariants, style, globalStyle } from '@vanilla-extract/css'
import * as CSS from 'csstype'
import { theme } from '@island.is/island-ui/theme'
import { mapToStyleProperty } from '../../utils/mapToStyleProperty'
import { responsiveStyleMap } from '@island.is/island-ui/vanilla-extract-utils'

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
  | 'menuTab'
  | 'tag'
  | 'cardCategoryTitle'
  | 'sideMenu'
  | 'placeholderText'
  | 'datepickerHeaderText'

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

type defaultFontWeights = {
  [Type in VariantTypes]: number
}

export const truncate = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const base = style({
  ['-webkit-font-smoothing' as any]: 'antialiased',
})

const fontWeightMap = {
  light: theme.typography.light,
  regular: theme.typography.regular,
  medium: theme.typography.medium,
  semiBold: theme.typography.semiBold,
}

const defaultFontWeightsMap: defaultFontWeights = {
  h1: theme.typography.semiBold,
  h2: theme.typography.semiBold,
  h3: theme.typography.semiBold,
  h4: theme.typography.semiBold,
  h5: theme.typography.semiBold,
  p: theme.typography.light,
  pSmall: theme.typography.regular,
  intro: theme.typography.light,
  eyebrow: theme.typography.medium,
  menuTab: theme.typography.medium,
  tag: theme.typography.semiBold,
  cardCategoryTitle: theme.typography.semiBold,
  sideMenu: theme.typography.medium,
  placeholderText: theme.typography.light,
  datepickerHeaderText: theme.typography.semiBold,
}

export const fontWeight = styleVariants(
  mapToStyleProperty(fontWeightMap, 'fontWeight'),
)

export const defaultFontWeights = styleVariants(
  mapToStyleProperty(defaultFontWeightsMap, 'fontWeight'),
)

export const variants: Variants = {
  h1: {
    fontSize: {
      xs: 32,
      md: 42,
    },
    lineHeight: 1.238095,
  },
  h2: {
    fontSize: {
      xs: 26,
      md: 34,
    },
    lineHeight: 1.294118,
  },
  h3: {
    fontSize: {
      xs: 20,
      md: 24,
    },
    lineHeight: 1.416667,
  },
  h4: {
    fontSize: {
      xs: 18,
      md: 20,
    },
    lineHeight: 1.5,
  },
  h5: {
    fontSize: {
      xs: 15,
      md: 18,
    },
    lineHeight: 1.5,
  },
  p: {
    fontSize: {
      xs: 16,
      md: 18,
    },
    lineHeight: 1.5,
  },
  pSmall: {
    fontSize: {
      xs: 12,
      md: 15,
    },
    lineHeight: 1.666,
  },
  intro: {
    fontSize: {
      xs: 20,
      md: 24,
    },
    lineHeight: 1.416667,
  },
  eyebrow: {
    fontSize: {
      xs: 12,
      md: 14,
    },
    lineHeight: { xs: 1.5, md: 1.142857 },
  },
  menuTab: {
    fontSize: {
      xs: 14,
    },
    lineHeight: 1.142857,
  },
  tag: {
    fontSize: {
      xs: 12,
      md: 14,
    },
    lineHeight: 1.142857,
  },
  cardCategoryTitle: {
    fontSize: {
      xs: 20,
      md: 24,
    },
    lineHeight: 1.416667,
  },
  sideMenu: {
    fontSize: {
      xs: 16,
      md: 18,
    },
    lineHeight: 1.55,
  },
  placeholderText: {
    fontSize: {
      xs: 20,
      md: 24,
    },
    lineHeight: 1.416667,
  },
  datepickerHeaderText: {
    fontSize: {
      xs: 18,
      md: 20,
    },
    lineHeight: 1.666,
  },
}

export const links = style({
  cursor: 'pointer',
})

globalStyle(`${links} a`, {
  color: theme.color.blue400,
  transition: 'color .2s, box-shadow .2s',
  textDecoration: 'none',
  boxShadow: `inset 0 -1px 0 0 ${theme.color.blue400}`,
})

globalStyle(`${links} a:hover`, {
  color: theme.color.blueberry400,
  boxShadow: `inset 0 -2px 0 0 ${theme.color.blueberry400}`,
  textDecoration: 'none',
})

globalStyle(`${links} a svg path`, {
  transition: 'fill .2s, box-shadow .2s',
  fill: theme.color.blue400,
})

globalStyle(`${links} a:hover svg path`, {
  fill: theme.color.blueberry400,
})

export const colors = styleVariants(mapToStyleProperty(theme.color, 'color'))

export const variantStyles = (Object.keys(variants) as VariantTypes[]).reduce(
  (acc, variantKey) => {
    acc[variantKey] = responsiveStyleMap(variants[variantKey])
    return acc
  },
  {} as {
    [Type in VariantTypes]: string
  },
)
