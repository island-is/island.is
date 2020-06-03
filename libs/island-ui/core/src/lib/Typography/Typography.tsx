import React from 'react'
import cn from 'classnames'

import styles, { VariantTypes, colors } from './Typography.treat'
import { Colors } from '../../theme/theme'

export interface TypographyProps {
  variant?: VariantTypes
  children?: React.ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'span'
  color?: Colors
}

export const Typography = ({
  variant,
  as: Cmp = 'p',
  children,
  color,
}: TypographyProps) => (
  <Cmp className={cn(styles[variant], colors[color])}>{children}</Cmp>
)

export default Typography
