import React, { FC } from 'react'
import { TypographyProps, Link } from '@island.is/island-ui/core'

interface HyperlinkProps {
  href?: string
  slug?: string
  variant?: TypographyProps['variant']
  as?: TypographyProps['as']
}

export const Hyperlink: FC<HyperlinkProps> = ({ href, children }) => (
  <Link withUnderline href={href} color="blue400">
    {children}
  </Link>
)

export default Hyperlink
