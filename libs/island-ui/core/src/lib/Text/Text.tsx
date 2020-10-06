import React, { useContext } from 'react'
import cn from 'classnames'

type TextElements =
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
import { LinkContext } from '../context'

export interface TextProps {
  id?: string
  variant?: TextVariants
  children?: React.ReactNode
  as?: TextElements
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
  variant = 'default',
  as = 'p',
}: TextProps) => {
  const { linkRenderer } = useContext(LinkContext)
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
      className={cn(base, {
        [styles[variant!]]: variant,
        [colors[color!]]: color,
        [fontWeightStyles[fontWeight!]]: fontWeight,
        [lineHeightStyles[lineHeight!]]: lineHeight,
        [defaultFontWeights[variant!]]: variant && !fontWeight,
        [defaultLineHeights[variant!]]: variant && !lineHeight,
        [truncateStyle]: truncate,
      })}
    >
      {React.Children.map<React.ReactNode, React.ReactNode>(
        children,
        (child: any) => {
          if (typeof linkRenderer === 'function' && child.props?.href) {
            return linkRenderer(child.props.href, child.props.children)
          }
          return child
        },
      )}
    </Box>
  )
}

export default Text
