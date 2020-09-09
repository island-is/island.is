import React from 'react'
import Link, { LinkColor } from '../Link'
import * as styles from './ArrowLink.treat'
import Icon from '../../Icon/Icon'
import { Box } from '../../Box'

interface Props {
  href?: string
  color?: LinkColor
  arrowHeight?: number
}

// ArrowLink has the "arrow" icon and a permanent custom underline.
// If there's not 'href' provided it will render a Box. Useful for when the ArrowLink is inside a clickable card.

const ArrowLink: React.FC<Props> = ({
  href,
  children,
  color = 'blue400',
  arrowHeight = 12,
}) => (
  <Box
    component={href ? Link : 'div'}
    href={href}
    color={color}
    className={styles.root}
  >
    {children}
    <span className={styles.iconWrap}>
      <Icon type="arrowRight" height={arrowHeight} color="currentColor" />
    </span>
  </Box>
)

export default ArrowLink
