import React from 'react'
import Link, { LinkColor } from '../Link'
import * as styles from './ExternalLink.treat'
import Icon from '../../Icon/Icon'

interface Props {
  href: string
  color?: LinkColor
}

// ExternalLink has the "external" icon which is only visible on hover.
// It also has a custom underline on hover.

const ExternalLink: React.FC<Props> = ({ href, children, color = 'white' }) => {
  return (
    <Link href={href} color={color} className={styles.root} withUnderline>
      {children}
      <span className={styles.iconWrap}>
        <Icon type="external" height="12" color="currentColor" />
      </span>
    </Link>
  )
}

export default ExternalLink
