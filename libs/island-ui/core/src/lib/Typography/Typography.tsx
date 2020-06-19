import React from 'react'
import cn from 'classnames'

import styles, {
  VariantTypes,
  colors,
  turnicate as turnicateStyle,
} from './Typography.treat'
import { Colors } from '../../theme/theme'

export interface TypographyProps {
  variant?: VariantTypes
  children?: React.ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'span' | 'div' | 'label'
  color?: Colors
  turnicate?: boolean
}

export const Typography = ({
  variant,
  as: Cmp = 'p',
  children,
  color,
  turnicate,
}: TypographyProps) => (
  <Cmp
    className={cn(styles[variant], colors[color], {
      [turnicateStyle]: turnicate,
    })}
  >
    {children}
  </Cmp>
)

export default Typography
