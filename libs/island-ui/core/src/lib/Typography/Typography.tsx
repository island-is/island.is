import React from 'react'
import cn from 'classnames'

import styles, {
  VariantTypes,
  colors,
  turnicate as turnicateStyle,
  links as linksStyle,
} from './Typography.treat'
import { Colors } from '@island.is/island-ui/theme'

export interface TypographyProps {
  variant?: VariantTypes
  children?: React.ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'span' | 'div' | 'label'
  color?: Colors
  turnicate?: boolean
  links?: boolean
}

export const Typography = ({
  variant,
  as: Cmp = 'p',
  children,
  color,
  turnicate,
  links,
}: TypographyProps) => (
  <Cmp
    className={cn(styles[variant], colors[color], {
      [turnicateStyle]: turnicate,
      [linksStyle]: links,
    })}
  >
    {children}
  </Cmp>
)

export default Typography
