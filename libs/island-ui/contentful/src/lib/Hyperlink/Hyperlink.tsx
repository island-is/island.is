import React, { FC } from 'react'
import { TextProps, Link } from '@island.is/island-ui/core'

import * as styles from './Hyperlink.css'

interface HyperlinkProps {
  href?: string
  slug?: string
  variant?: TextProps['variant']
  as?: TextProps['as']
}

export const Hyperlink: FC<HyperlinkProps> = ({ href, children }) => (
  <Link
    href={href}
    color="blue400"
    underline="small"
    underlineVisibility="always"
    className={styles.link}
  >
    {children}
  </Link>
)

export default Hyperlink
