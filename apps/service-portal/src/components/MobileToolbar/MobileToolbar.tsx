import { Box, Icon, IconProps, Typography } from '@island.is/island-ui/core'
import { ServicePortalPath } from '@island.is/service-portal/core'
import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-use'
import { ActionType } from '../../store/actions'
import { useStore } from '../../store/stateProvider'
import * as styles from './MobileToolbar.treat'

interface MenuItemProps {
  active: boolean
  title: string
  icon: Pick<IconProps, 'icon' | 'type'>
  onClick?: () => void
}

const MenuItem: FC<MenuItemProps> = ({ active, title, icon, onClick }) => (
  <Box
    className={styles.menuItem}
    display="flex"
    flexDirection="column"
    alignItems="center"
    flexShrink={0}
    textAlign="center"
    marginX={2}
    onClick={onClick}
  >
    <Box
      className={styles.icon}
      display="flex"
      justifyContent="center"
      alignItems="center"
      borderRadius="circle"
      background={active ? 'blueberry200' : 'transparent'}
    >
      <Icon
        type={icon.type}
        icon={icon.icon}
        size="medium"
        color={active ? 'blueberry400' : 'blueberry300'}
      />
    </Box>
    <Typography variant="pSmall" fontWeight="semiBold" color="blueberry400">
      {title}
    </Typography>
  </Box>
)

const MobileToolbar: FC<{}> = () => {
  const { pathname } = useLocation()
  const [{ mobileMenuState }, dispatch] = useStore()

  const handleMenuTriggerClick = () =>
    dispatch({
      type: ActionType.SetMobileMenuState,
      payload: mobileMenuState === 'open' ? 'closed' : 'open',
    })

  const handleLinkClick = () =>
    mobileMenuState === 'open'
      ? dispatch({
          type: ActionType.SetMobileMenuState,
          payload: 'closed',
        })
      : null

  return (
    <Box
      display="flex"
      className={styles.wrapper}
      background="blueberry100"
      paddingTop={1}
      paddingBottom={2}
      paddingX={1}
      overflow="auto"
    >
      <Link to={ServicePortalPath.RafraenSkjolRoot} onClick={handleLinkClick}>
        <MenuItem
          active={pathname === ServicePortalPath.RafraenSkjolRoot}
          icon={{
            type: 'outline',
            icon: 'reader',
          }}
          title="Rafræn skjöl"
        />
      </Link>
      <Link to={ServicePortalPath.UmsoknirKynning} onClick={handleLinkClick}>
        <MenuItem
          active={pathname === ServicePortalPath.UmsoknirKynning}
          icon={{
            type: 'outline',
            icon: 'fileTrayFull',
          }}
          title="Umsóknir"
        />
      </Link>
      <Link to={ServicePortalPath.StillingarRoot} onClick={handleLinkClick}>
        <MenuItem
          active={pathname === ServicePortalPath.StillingarRoot}
          icon={{
            type: 'outline',
            icon: 'settings',
          }}
          title="Stillingar"
        />
      </Link>
      <Box className={styles.burger}>
        <MenuItem
          active={mobileMenuState === 'open'}
          icon={{
            type: 'outline',
            icon: 'menu',
          }}
          title="Valmynd"
          onClick={handleMenuTriggerClick}
        />
      </Box>
    </Box>
  )
}

export default MobileToolbar
