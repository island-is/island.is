import { FC } from 'react'
import { Link } from 'react-router-dom'
import { Box, Icon } from '@island.is/island-ui/core'
import * as styles from '../NavItem/NavItem.css'
interface Props {
  path?: string
  active: boolean
  enabled?: boolean
  collapsed?: boolean
  external?: boolean
  onClick?: () => void
  first?: boolean
}

const SubNavItemContent: FC<React.PropsWithChildren<Props>> = ({
  active,
  onClick,
  enabled,
  collapsed,
  children,
  first,
}) => (
  <Box
    display="flex"
    alignItems="center"
    cursor="pointer"
    position="relative"
    onClick={onClick}
    justifyContent="spaceBetween"
    paddingRight={2}
    paddingTop={first ? 0 : 3}
    className={active ? styles.subLinkActive : styles.subLink}
  >
    <span>{children}</span>
    {!enabled && (
      <Icon
        type="filled"
        icon="lockClosed"
        size="small"
        className={collapsed ? styles.subLockCollapsed : styles.subLock}
      />
    )}
  </Box>
)

const SubNavItem: FC<React.PropsWithChildren<Props>> = (props) => {
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
