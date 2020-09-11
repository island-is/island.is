import React, { FC } from 'react'
import { TypographyProps, ExternalLink } from '@island.is/island-ui/core'

interface HyperlinkProps {
  href?: string
  slug?: string
  variant?: TypographyProps['variant']
  as?: TypographyProps['as']
}

export const Hyperlink: FC<HyperlinkProps> = ({ href, children }) => (
  <ExternalLink href={href} color="blue400">
    {children}
  </ExternalLink>
)

export default Hyperlink
