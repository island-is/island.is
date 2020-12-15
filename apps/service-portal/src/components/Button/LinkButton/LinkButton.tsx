import React, { FC } from 'react'
import cn from 'classnames'
import { Box } from '@island.is/island-ui/core'
import * as styles from './LinkButton.treat'
import { Link, useLocation } from 'react-router-dom'
import {
  plausibleCustomEvent,
  ServicePortalOutboundLink,
} from '@island.is/plausible'

interface Props {
  onClick?: () => void
  url?: string
  active?: boolean
  external?: boolean
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
  const { pathname } = useLocation()
  const trackExternalLinkClick = (destination?: string) => {
    if (!destination) {
      return
    }
    const event: ServicePortalOutboundLink = {
      featureName: 'service-portal',
      eventName: 'Outbound Link',
      params: { location: pathname, destination },
    }
    plausibleCustomEvent(event)
  }

  return props.external ? (
    <a
      href={props.url}
      className={styles.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <ButtonContent {...props} />
    </a>
  ) : props.url ? (
    <Link
      to={props.url}
      className={styles.link}
      onClick={() => {
        trackExternalLinkClick(props.url)
      }}
    >
      <ButtonContent {...props} />
    </Link>
  ) : (
    <ButtonContent {...props} />
  )
}

export default LinkButton
