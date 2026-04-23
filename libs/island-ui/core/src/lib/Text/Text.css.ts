import { styleVariants, style, globalStyle } from '@vanilla-extract/css'
import * as CSS from 'csstype'
import { theme, typographyValues } from '@island.is/island-ui/theme'
import { responsiveStyleMap } from '@island.is/island-ui/vanilla-extract-utils'
import { mapToStyleProperty } from '../../utils/mapToStyleProperty'

export type TextVariants =
  | 'default'
  | 'small'
  | 'medium'
  | 'mediumLight'
  | 'large'
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
  [Type in TextVariants]: CSS.Properties<
    string | ResponsiveProps<string | number>
  >
}

type defaultFontWeights = {
  [Type in TextVariants]: number
}

type defaultLineHeights = {
  [Type in TextVariants]: string
}
export const truncate = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const strikethrough = style({
  textDecoration: 'line-through',
})

export const capitalizeFirstLetter = style({
  ':first-letter': {
    textTransform: 'capitalize',
  },
})

export const disabledText = style({
  color: theme.color.dark300,
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
  xs: typographyValues.desktop.paragraph.small.lineHeight,
  sm: typographyValues.desktop.paragraph.mediumRegular.lineHeight,
  md: typographyValues.desktop.paragraph.default.lineHeight,
  lg: typographyValues.desktop.paragraph.default.lineHeight,
  xl: typographyValues.desktop.paragraph.large.lineHeight,
}

const lineHeightMap = {
  xs: availableLineHeights.xs,
  sm: availableLineHeights.sm,
  md: availableLineHeights.md,
  lg: availableLineHeights.lg,
  xl: availableLineHeights.xl,
}

const defaultFontWeightsMap: defaultFontWeights = {
  default: typographyValues.desktop.paragraph.default.fontWeight,
  h1: typographyValues.desktop.headings.h1.fontWeight,
  h2: typographyValues.desktop.headings.h2.fontWeight,
  h3: typographyValues.desktop.headings.h3.fontWeight,
  h4: typographyValues.desktop.headings.h4.fontWeight,
  h5: typographyValues.desktop.headings.h5.fontWeight,
  small: typographyValues.desktop.paragraph.small.fontWeight,
  medium: typographyValues.desktop.paragraph.mediumRegular.fontWeight,
  eyebrow: typographyValues.desktop.eyebrow.fontWeight,
  large: typographyValues.desktop.paragraph.large.fontWeight,
  mediumLight: typographyValues.desktop.paragraph.mediumLight.fontWeight,
  intro: typographyValues.desktop.paragraph.mediumLight.fontWeight,
}

const defaultLineHeightsMap: defaultLineHeights = {
  default: typographyValues.desktop.paragraph.default.lineHeight,
  h1: typographyValues.desktop.headings.h1.lineHeight,
  h2: typographyValues.desktop.headings.h2.lineHeight,
  h3: typographyValues.desktop.headings.h3.lineHeight,
  h4: typographyValues.desktop.headings.h4.lineHeight,
  h5: typographyValues.desktop.headings.h5.lineHeight,
  small: typographyValues.desktop.paragraph.small.lineHeight,
  medium: typographyValues.desktop.paragraph.mediumRegular.lineHeight,
  eyebrow: typographyValues.desktop.eyebrow.lineHeight,
  large: typographyValues.desktop.paragraph.large.lineHeight,
  mediumLight: typographyValues.desktop.paragraph.mediumLight.lineHeight,
  intro: typographyValues.desktop.headings.h3.lineHeight,
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

export const whiteSpace = {
  ...styleVariants(
    {
      normal: { whiteSpace: 'normal' },
      nowrap: { whiteSpace: 'nowrap' },
      pre: { whiteSpace: 'pre' },
      preWrap: { whiteSpace: 'pre-wrap' },
      preLine: { whiteSpace: 'pre-line' },
      breakSpaces: { whiteSpace: 'break-spaces' },
    },
    'whiteSpace',
  ),
}

export const textAlign = {
  ...styleVariants(
    {
      left: { textAlign: 'left' },
      right: { textAlign: 'right' },
      center: { textAlign: 'center' },
      justify: { textAlign: 'justify' },
    },
    'textAlign',
  ),
}

export const variants: Variants = {
  default: {
    fontSize: {
      xs: typographyValues.mobile.paragraph.default.fontSize,
      md: typographyValues.desktop.paragraph.default.fontSize,
    },
    lineHeight: typographyValues.desktop.paragraph.default.lineHeight,
    fontWeight: typographyValues.desktop.paragraph.default.fontWeight,
  },
  small: {
    fontSize: {
      xs: typographyValues.mobile.paragraph.small.fontSize,
      md: typographyValues.desktop.paragraph.small.fontSize,
    },
    lineHeight: typographyValues.desktop.paragraph.small.lineHeight,
    fontWeight: typographyValues.desktop.paragraph.small.fontWeight,
  },
  mediumLight: {
    fontSize: {
      xs: typographyValues.mobile.paragraph.mediumLight.fontSize,
      md: typographyValues.desktop.paragraph.mediumLight.fontSize,
    },
    fontWeight: typographyValues.desktop.paragraph.mediumLight.fontWeight,
    lineHeight: typographyValues.desktop.paragraph.mediumLight.lineHeight,
  },
  medium: {
    fontSize: {
      xs: typographyValues.mobile.paragraph.mediumRegular.fontSize,
      md: typographyValues.desktop.paragraph.mediumRegular.fontSize,
    },
    fontWeight: typographyValues.desktop.paragraph.mediumRegular.fontWeight,
    lineHeight: typographyValues.desktop.paragraph.mediumRegular.lineHeight,
  },
  large: {
    fontSize: {
      xs: typographyValues.mobile.paragraph.large.fontSize,
      md: typographyValues.desktop.paragraph.large.fontSize,
    },
    lineHeight: typographyValues.desktop.paragraph.large.lineHeight,
    fontWeight: typographyValues.desktop.paragraph.large.fontWeight,
  },
  h1: {
    fontSize: {
      xs: typographyValues.mobile.headings.h1.fontSize,
      md: typographyValues.desktop.headings.h1.fontSize,
    },
    lineHeight: typographyValues.desktop.headings.h1.lineHeight,
    fontWeight: typographyValues.desktop.headings.h1.fontWeight,
  },
  h2: {
    fontSize: {
      xs: typographyValues.mobile.headings.h2.fontSize,
      md: typographyValues.desktop.headings.h2.fontSize,
    },
    lineHeight: typographyValues.desktop.headings.h2.lineHeight,
    fontWeight: typographyValues.desktop.headings.h2.fontWeight,
  },
  h3: {
    fontSize: {
      xs: typographyValues.mobile.headings.h3.fontSize,
      md: typographyValues.desktop.headings.h3.fontSize,
    },
    lineHeight: typographyValues.desktop.headings.h3.lineHeight,
    fontWeight: typographyValues.desktop.headings.h3.fontWeight,
  },
  h4: {
    fontSize: {
      xs: typographyValues.mobile.headings.h4.fontSize,
      md: typographyValues.desktop.headings.h4.fontSize,
    },
    lineHeight: typographyValues.desktop.headings.h4.lineHeight,
    fontWeight: typographyValues.desktop.headings.h4.fontWeight,
  },
  h5: {
    fontSize: {
      xs: typographyValues.mobile.headings.h5.fontSize,
      md: typographyValues.desktop.headings.h5.fontSize,
    },
    lineHeight: typographyValues.desktop.headings.h5.lineHeight,
    fontWeight: typographyValues.desktop.headings.h5.fontWeight,
  },
  eyebrow: {
    fontSize: {
      xs: typographyValues.mobile.eyebrow.fontSize,
      md: typographyValues.desktop.eyebrow.fontSize,
    },
    lineHeight: typographyValues.desktop.eyebrow.lineHeight,
    fontWeight: typographyValues.desktop.eyebrow.fontWeight,
  },
  intro: {
    fontSize: {
      xs: typographyValues.mobile.headings.h3.fontSize,
      md: typographyValues.desktop.headings.h3.fontSize,
    },
    lineHeight: typographyValues.desktop.headings.h3.lineHeight,
    fontWeight: typographyValues.desktop.paragraph.mediumLight.fontWeight,
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
