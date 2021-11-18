import { styleVariants, style, globalStyle } from '@vanilla-extract/css'
import * as CSS from 'csstype'
import { theme } from '@island.is/island-ui/theme'
import { responsiveStyleMap } from '@island.is/island-ui/vanilla-extract-utils'
import { mapToStyleProperty } from '../../utils/mapToStyleProperty'

export type TextVariants =
  | 'default'
  | 'small'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'intro'
  | 'eyebrow'
  | 'sidebar'

type ResponsiveProps<T> = {
  xs?: T
  sm?: T
  md?: T
  lg?: T
  xl?: T
}

type Variants = {
  [Type in TextVariants]: CSS.Properties<
    string | ResponsiveProps<string | number>
  >
}

type defaultFontWeights = {
  [Type in TextVariants]: number
}

export const truncate = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const strikethrough = style({
  textDecoration: 'line-through',
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

const availableLineHeights = {
  xs: 1,
  sm: 1.25,
  md: 1.5,
  lg: 1.75,
  xl: 2,
}

const availableFontSizes = {
  xs: { xs: 12, md: 14 },
  sm: { xs: 16, md: 18 },
  md: { xs: 18, md: 20 },
  lg: { xs: 20, md: 24 },
  xl: { xs: 26, md: 34 },
  xxl: { xs: 32, md: 42 },
  sidebar: { xs: 16, md: 16 },
}

const lineHeightMap = {
  xs: availableLineHeights.xs,
  sm: availableLineHeights.sm,
  md: availableLineHeights.md,
  lg: availableLineHeights.lg,
  xl: availableLineHeights.xl,
}

const defaultFontWeightsMap: defaultFontWeights = {
  default: theme.typography.light,
  h1: theme.typography.headingsFontWeight,
  h2: theme.typography.headingsFontWeight,
  h3: theme.typography.headingsFontWeight,
  h4: theme.typography.headingsFontWeight,
  h5: theme.typography.headingsFontWeight,
  small: theme.typography.regular,
  intro: theme.typography.light,
  eyebrow: theme.typography.semiBold,
  sidebar: theme.typography.regular,
}

const defaultLineHeightsMap: defaultFontWeights = {
  default: availableLineHeights.md,
  h1: availableLineHeights.sm,
  h2: availableLineHeights.sm,
  h3: availableLineHeights.md,
  h4: availableLineHeights.md,
  h5: availableLineHeights.md,
  small: availableLineHeights.md,
  intro: availableLineHeights.md,
  eyebrow: availableLineHeights.md,
  sidebar: availableLineHeights.md,
}

export const fontWeight = styleVariants(
  mapToStyleProperty(fontWeightMap, 'fontWeight'),
)

export const lineHeight = styleVariants(
  mapToStyleProperty(lineHeightMap, 'lineHeight'),
)

export const defaultFontWeights = styleVariants(
  mapToStyleProperty(defaultFontWeightsMap, 'fontWeight'),
)

export const defaultLineHeights = styleVariants(
  mapToStyleProperty(defaultLineHeightsMap, 'lineHeight'),
)

export const variants: Variants = {
  default: {
    fontSize: availableFontSizes.sm,
  },
  h1: {
    fontSize: availableFontSizes.xxl,
  },
  h2: {
    fontSize: availableFontSizes.xl,
  },
  h3: {
    fontSize: availableFontSizes.lg,
  },
  h4: {
    fontSize: availableFontSizes.md,
  },
  h5: {
    fontSize: availableFontSizes.sm,
  },
  small: {
    fontSize: availableFontSizes.xs,
  },
  intro: {
    fontSize: availableFontSizes.lg,
  },
  eyebrow: {
    fontSize: availableFontSizes.xs,
  },
  sidebar: {
    fontSize: availableFontSizes.sidebar,
  },
}

export const colors = styleVariants(mapToStyleProperty(theme.color, 'color'))

export const variantStyles = (Object.keys(variants) as TextVariants[]).reduce(
  (acc, variantKey) => {
    acc[variantKey] = responsiveStyleMap(variants[variantKey])
    return acc
  },
  {} as {
    [Type in TextVariants]: string
  },
)

globalStyle(`${base} em`, {
  fontStyle: 'italic',
})

globalStyle(`${base} strong`, {
  fontWeight: theme.typography.semiBold,
})

globalStyle(`${base} mark`, {
  backgroundColor: theme.color.mint400,
  color: theme.color.dark400,
  fontWeight: theme.typography.regular,
})
