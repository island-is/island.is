import React from 'react'

import styles, { VariantTypes } from './Typography.treat'

export interface TypographyProps {
  variant?: VariantTypes
  children?: React.ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'span'
}

export const Typography = ({
  variant,
  as: Cmp = 'p',
  children,
}: TypographyProps) => <Cmp className={styles[variant]}>{children}</Cmp>

export default Typography
