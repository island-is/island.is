import { Box, Icon, IconTypes, Typography } from '@island.is/island-ui/core'
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
  icon: IconTypes
  onClick?: () => void
}

const MenuItem: FC<MenuItemProps> = ({ active, title, icon, onClick }) => (
  <Box
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
        type={icon}
        width={18}
        height={18}
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
      <Link to={ServicePortalPath.RafraenSkjolRoot}>
        <MenuItem
          active={pathname === ServicePortalPath.RafraenSkjolRoot}
          icon="file"
          title="Rafræn skjöl"
        />
      </Link>
      <Link to={ServicePortalPath.UmsoknirRoot}>
        <MenuItem
          active={pathname === ServicePortalPath.UmsoknirRoot}
          icon="download"
          title="Umsóknir"
        />
      </Link>
      <Link to={ServicePortalPath.StillingarRoot}>
        <MenuItem
          active={pathname === ServicePortalPath.StillingarRoot}
          icon="globe"
          title="Stillingar"
        />
      </Link>
      <Box className={styles.burger}>
        <MenuItem
          active={mobileMenuState === 'open'}
          icon="burger"
          title="Valmynd"
          onClick={handleMenuTriggerClick}
        />
      </Box>
    </Box>
  )
}

export default MobileToolbar
