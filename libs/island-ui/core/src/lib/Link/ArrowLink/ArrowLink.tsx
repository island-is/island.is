import React from 'react'
import { Colors } from '@island.is/island-ui/theme'
import Link from '../Link'
import * as styles from './ArrowLink.treat'
import Icon from '../../Icon/Icon'

interface Props {
  href: string
  color?: Colors
  arrowHeight?: number
}

// ArrowLink has the "arrow" icon and a permanent custom underline.

const ArrowLink: React.FC<Props> = ({
  href,
  children,
  color = 'blue400',
  arrowHeight = 12,
}) => {
  return (
    <Link href={href} color={color} className={styles.root}>
      {children}
      <span className={styles.iconWrap}>
        <Icon type="arrowRight" height={arrowHeight} color="currentColor" />
      </span>
    </Link>
  )
}

export default ArrowLink
