import React from 'react'
import cn from 'classnames'
import { resolveResponsiveProp } from '../../utils/responsiveProp'

import styles, {
  VariantTypes,
  colors,
  truncate as truncateStyle,
  links as linksStyle,
  spacing,
} from './Typography.treat'
import { Colors } from '@island.is/island-ui/theme'
import { ResponsiveSpace } from '../Box/useBoxStyles'

export interface TypographyProps {
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
}

export const Typography = ({
  variant,
  as: Cmp = 'p',
  children,
  color,
  truncate,
  links,
  paddingTop = 0,
  paddingBottom = 0,
}: TypographyProps) => (
  <Cmp
    className={cn(
      styles[variant],
      colors[color],
      {
        [truncateStyle]: truncate,
        [linksStyle]: links,
      },
      resolveResponsiveProp(
        paddingBottom,
        spacing.paddingBottomXs,
        spacing.paddingBottomSm,
        spacing.paddingBottomMd,
        spacing.paddingBottomLg,
        spacing.paddingBottomXl,
      ),
      resolveResponsiveProp(
        paddingTop,
        spacing.paddingTopXs,
        spacing.paddingTopSm,
        spacing.paddingTopMd,
        spacing.paddingTopLg,
        spacing.paddingTopXl,
      ),
    )}
  >
    {children}
  </Cmp>
)

export default Typography
