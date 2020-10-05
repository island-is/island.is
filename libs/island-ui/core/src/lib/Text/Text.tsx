import React from 'react'
import cn from 'classnames'

import styles, {
  base,
  TextVariants,
  colors,
  truncate as truncateStyle,
  fontWeight as fontWeightStyles,
  lineHeight as lineHeightStyles,
  defaultFontWeights,
  defaultLineHeights,
} from './Text.treat'
import { Colors } from '@island.is/island-ui/theme'
import { ResponsiveSpace } from '../Box/useBoxStyles'
import { Box } from '../Box'

export interface TextProps {
  id?: string
  variant?: TextVariants
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
  paddingTop?: ResponsiveSpace
  paddingBottom?: ResponsiveSpace
  paddingY?: ResponsiveSpace
  marginTop?: ResponsiveSpace
  marginBottom?: ResponsiveSpace
  marginY?: ResponsiveSpace
  fontWeight?: keyof typeof fontWeightStyles
  lineHeight?: keyof typeof lineHeightStyles
}

export const Text = ({
  id,
  children,
  color,
  truncate,
  paddingTop,
  paddingBottom,
  paddingY,
  marginTop,
  marginBottom,
  marginY,
  fontWeight,
  lineHeight,
  variant = 'p',
  as = 'p',
}: TextProps) => {
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
        variant ? styles[variant] : null,
        color ? colors[color] : null,
        fontWeight ? fontWeightStyles[fontWeight] : null,
        lineHeight ? lineHeightStyles[lineHeight] : null,
        {
          [truncateStyle]: truncate,
          [defaultFontWeights[variant!]]: variant && !fontWeight,
          [defaultLineHeights[variant!]]: variant && !lineHeight,
        },
      )}
    >
      {children}
    </Box>
  )
}

export default Text
