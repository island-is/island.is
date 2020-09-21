import React from 'react'
import cn from 'classnames'
import { resolveResponsiveProp } from '../../utils/responsiveProp'

import styles, {
  VariantTypes,
  colors,
  truncate as truncateStyle,
  links as linksStyle,
  spacing,
  fontWeight as fontWeightStyles,
  defaultFontWeights,
} from './Typography.treat'
import { Colors } from '@island.is/island-ui/theme'
import { ResponsiveSpace } from '../Box/useBoxStyles'
import { Box } from '../Box'

export interface TypographyProps {
  id?: string
  variant?: VariantTypes
  children?: React.ReactNode
  as?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'p'
    | 'span'
    | 'div'
    | 'label'
    | 'caption'
  color?: Colors
  truncate?: boolean
  links?: boolean
  paddingTop?: ResponsiveSpace
  paddingBottom?: ResponsiveSpace
  paddingY?: ResponsiveSpace
  marginTop?: ResponsiveSpace
  marginBottom?: ResponsiveSpace
  marginY?: ResponsiveSpace
  fontWeight?: keyof typeof fontWeightStyles
}

export const Typography = ({
  id,
  variant,
  children,
  color,
  truncate,
  links,
  paddingTop,
  paddingBottom,
  paddingY,
  marginTop,
  marginBottom,
  marginY,
  fontWeight,
  as = 'p',
}: TypographyProps) => {
  const resolvedPaddingTop = paddingTop ?? paddingY
  const resolvedPaddingBottom = paddingBottom ?? paddingY
  const resolvedMarginTop = marginTop ?? marginY
  const resolvedMarginBottom = marginBottom ?? marginY

  return (
    <Box
      id={id}
      component={as}
      className={cn(
        variant ? styles[variant] : null,
        color ? colors[color] : null,
        fontWeight ? fontWeightStyles[fontWeight] : null,
        {
          [truncateStyle]: truncate,
          [linksStyle]: links,
          [defaultFontWeights[variant!]]: variant && !fontWeight,
        },
        resolvedPaddingBottom !== undefined &&
          resolveResponsiveProp(
            resolvedPaddingBottom,
            spacing.padding.bottomXs,
            spacing.padding.bottomSm,
            spacing.padding.bottomMd,
            spacing.padding.bottomLg,
            spacing.padding.bottomXl,
          ),
        resolvedPaddingTop !== undefined &&
          resolveResponsiveProp(
            resolvedPaddingTop,
            spacing.padding.topXs,
            spacing.padding.topSm,
            spacing.padding.topMd,
            spacing.padding.topLg,
            spacing.padding.topXl,
          ),
        resolvedMarginBottom !== undefined &&
          resolveResponsiveProp(
            resolvedMarginBottom,
            spacing.margin.bottomXs,
            spacing.margin.bottomSm,
            spacing.margin.bottomMd,
            spacing.margin.bottomLg,
            spacing.margin.bottomXl,
          ),
        resolvedMarginTop !== undefined &&
          resolveResponsiveProp(
            resolvedMarginTop,
            spacing.margin.topXs,
            spacing.margin.topSm,
            spacing.margin.topMd,
            spacing.margin.topLg,
            spacing.margin.topXl,
          ),
      )}
    >
      {children}
    </Box>
  )
}

export default Typography
