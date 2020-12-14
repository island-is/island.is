import React, { FC } from 'react'
import cn from 'classnames'
import { Box } from '@island.is/island-ui/core'
import * as styles from './LinkButton.treat'
import { Link } from 'react-router-dom'
import { plausibleEvent } from '../../../utils/plausibleEvent'

interface Props {
  onClick?: () => void
  url?: string
  active?: boolean
  external?: boolean
}

const trackExternalLinkClick = () => {
  plausibleEvent('Outbound Link: Click', {})
}

const ButtonContent: FC<Props> = ({ onClick, active, children }) => (
  <Box
    display="flex"
    alignItems="center"
    className={cn(styles.wrapper, {
      [styles.active]: active,
    })}
    onClick={onClick}
  >
    {children}
  </Box>
)

const LinkButton: FC<Props> = (props) => {
  return props.external ? (
    <a
      href={props.url}
      className={styles.link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={trackExternalLinkClick}
    >
      <ButtonContent {...props} />
    </a>
  ) : props.url ? (
    <Link to={props.url} className={styles.link}>
      <ButtonContent {...props} />
    </Link>
  ) : (
    <ButtonContent {...props} />
  )
}

export default LinkButton
