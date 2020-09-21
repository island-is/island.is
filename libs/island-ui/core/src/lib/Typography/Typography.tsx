import React from 'react'
import cn from 'classnames'
import { resolveResponsiveProp } from '../../utils/responsiveProp'

import styles, {
  VariantTypes,
  colors,
  truncate as truncateStyle,
  links as linksStyle,
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
        variant ? styles[variant] : null,
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

export default Typography
