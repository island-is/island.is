import { Box, Icon, Text } from '@island.is/island-ui/core'
import { ServicePortalPath } from '@island.is/service-portal/core'
import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import * as styles from '../NavItem/NavItem.css'
interface Props {
  path?: ServicePortalPath
  active: boolean
  enabled?: boolean
  external?: boolean
  onClick?: () => void
}

const SubNavItemContent: FC<Props> = ({
  active,
  onClick,
  enabled,
  children,
}) => (
  <Box
    display="flex"
    alignItems="center"
    cursor="pointer"
    position="relative"
    onClick={onClick}
    justifyContent="spaceBetween"
    paddingRight={2}
    className={active ? styles.subLinkActive : styles.subLink}
  >
    <span>{children}</span>
    {!enabled && (
      <Icon
        type="filled"
        icon="lockClosed"
        size="small"
        color="blue600"
        className={styles.subLock}
      />
    )}
  </Box>
)

const SubNavItem: FC<Props> = (props) => {
  return props.external ? (
    <a
      href={props.path}
      target="_blank"
      rel="noreferrer noopener"
      className={props.active ? styles.subLinkActive : styles.subLink}
    >
      <SubNavItemContent {...props} />
    </a>
  ) : props.path ? (
    <Link
      to={props.path}
      className={props.active ? styles.subLinkActive : styles.subLink}
    >
      <SubNavItemContent {...props} />
    </Link>
  ) : (
    <SubNavItemContent {...props} />
  )
}

export default SubNavItem
