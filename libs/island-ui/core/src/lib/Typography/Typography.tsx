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
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'span' | 'div' | 'label'
  color?: Colors
  truncate?: boolean
  links?: boolean
  top?: ResponsiveSpace
  bottom?: ResponsiveSpace
}

export const Typography = ({
  variant,
  as: Cmp = 'p',
  children,
  color,
  truncate,
  links,
  top = 0,
  bottom = 0,
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
        bottom,
        spacing.bottomXs,
        spacing.bottomSm,
        spacing.bottomMd,
        spacing.bottomLg,
        spacing.bottomXl,
      ),
      resolveResponsiveProp(
        top,
        spacing.topXs,
        spacing.topSm,
        spacing.topMd,
        spacing.topLg,
        spacing.topXl,
      ),
    )}
  >
    {children}
  </Cmp>
)

export default Typography
