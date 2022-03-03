/** @deprecated Typography has been deprecated in favor of Text */

import React from 'react'
import cn from 'classnames'

import { Colors } from '@island.is/island-ui/theme'

import { Box } from '../Box/Box'
import { ResponsiveSpace } from '../Box/useBoxStyles'

import {
  base,
  colors,
  defaultFontWeights,
  fontWeight as fontWeightStyles,
  links as linksStyle,
  truncate as truncateStyle,
  variantStyles,
  VariantTypes,
} from './Typography.css'

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
  if (process.env.NODE_ENV === 'development') {
    console.warn('Typography has been deprecated in favor of Text.')
  }

  return (
    <Box
      id={id}
      component={as}
      marginTop={marginTop}
      marginBottom={marginBottom}
      marginY={marginY}
      paddingTop={paddingTop}
      paddingBottom={paddingBottom}
      paddingY={paddingY}
      className={cn(
        base,
        variant ? variantStyles[variant] : null,
        color ? colors[color] : null,
        fontWeight ? fontWeightStyles[fontWeight] : null,
        {
          [truncateStyle]: truncate,
          [linksStyle]: links,
          [defaultFontWeights[variant!]]: variant && !fontWeight,
        },
      )}
    >
      {children}
    </Box>
  )
}
