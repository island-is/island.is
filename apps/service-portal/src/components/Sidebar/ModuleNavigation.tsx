import React, { FC, useState } from 'react'
import {
  ServicePortalNavigationItem,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { Box, Divider, Text } from '@island.is/island-ui/core'
import { useLocation } from 'react-router-dom'
import AnimateHeight from 'react-animate-height'
import { useLocale } from '@island.is/localization'
import NavItem from './NavItem/NavItem'
import SubNavModal from './SubNavModal'
import { servicePortalOutboundLink } from '@island.is/plausible'
import { useStore } from '../../store/stateProvider'
import SubNav from './NavItem/SubNav'

interface Props {
  nav: ServicePortalNavigationItem
  alwaysExpanded?: boolean
  badge?: boolean
  onItemClick?: () => void
}

const ModuleNavigation: FC<Props> = ({
  nav,
  alwaysExpanded,
  onItemClick,
  badge,
}) => {
  const [expand, setExpand] = useState(false)
  const [hover, setHover] = useState(false)
  const [{ sidebarState }] = useStore()
  const { pathname } = useLocation()

  const isModuleActive =
    (nav.path &&
      nav.path !== ServicePortalPath.MinarSidurRoot &&
      pathname.includes(nav.path)) ||
    nav.children?.find((x) => x.path && pathname.includes(x.path)) !==
      undefined ||
    expand ||
    nav.path === pathname
  const { formatMessage } = useLocale()
  const handleExpand = () => {
    setExpand(!expand)
  }
  const handleRootItemClick = (external?: boolean) => {
    if (nav.path === undefined) handleExpand()
    if (onItemClick) onItemClick()
    if (external) servicePortalOutboundLink()
  }

  const navChildren = nav?.children?.filter((child) => !child.navHide)
  const navArray = Array.isArray(navChildren) && navChildren.length > 0
  const collapsed = sidebarState === 'closed'

  return (
    <Box
      position="relative"
      onMouseOver={() => {
        collapsed && setHover(true)
      }}
      onMouseLeave={() => {
        collapsed && setHover(false)
      }}
    >
      {navArray && collapsed && (
        <SubNavModal active={hover}>
          <SubNav
            collapsed
            navChildren={navChildren}
            onClick={onItemClick}
            pathname={pathname}
          />
        </SubNavModal>
      )}
      {nav.heading && (
        <Text
          variant="eyebrow"
          color="blue400"
          fontWeight="semiBold"
          marginBottom={2}
          marginTop={2}
        >
          {formatMessage(nav.heading)}
        </Text>
      )}
      {nav.divider && (
        <Box paddingBottom={3}>
          <Divider />
        </Box>
      )}
      <NavItem
        path={nav.path}
        icon={nav.icon}
        active={hover || isModuleActive}
        hasArray={navArray}
        enabled={nav.enabled}
        external={nav.external}
        onClick={() => {
          !collapsed && handleRootItemClick(nav.external)
        }}
        alwaysExpanded={alwaysExpanded}
        badge={badge}
      >
        {formatMessage(nav.name)}
      </NavItem>
      {!collapsed && navArray && nav.enabled && (
        <AnimateHeight
          duration={300}
          height={isModuleActive || alwaysExpanded ? 'auto' : 0}
        >
          <SubNav
            navChildren={navChildren}
            onClick={onItemClick}
            pathname={pathname}
          />
        </AnimateHeight>
      )}
    </Box>
  )
}

export default ModuleNavigation
