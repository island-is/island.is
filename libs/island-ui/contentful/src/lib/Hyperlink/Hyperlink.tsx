import React, { FC } from 'react'
import { TextProps, Link } from '@island.is/island-ui/core'

import * as styles from './Hyperlink.css'

interface HyperlinkProps {
  href?: string
  slug?: string
  variant?: TextProps['variant']
  as?: TextProps['as']
}

export const Hyperlink: FC<React.PropsWithChildren<HyperlinkProps>> = ({
  href,
  children,
}) => (
  <Link
    // @ts-ignore make web strict
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
