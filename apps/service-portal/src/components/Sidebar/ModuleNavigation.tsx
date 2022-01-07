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
  const { formatMessage } = useLocale()
  const { pathname } = useLocation()
  const navChildren = nav?.children?.filter((child) => !child.navHide)
  const navArray = Array.isArray(navChildren) && navChildren.length > 0
  const collapsed = sidebarState === 'closed'

  const isModuleActive =
    (nav.path &&
      nav.path !== ServicePortalPath.MinarSidurRoot &&
      pathname.includes(nav.path)) ||
    nav.children?.find((x) => x.path && pathname.includes(x.path)) !==
      undefined ||
    nav.path === pathname

  const handleExpand = () => {
    setExpand(!expand)
  }

  const handleRootItemClick = (external?: boolean) => {
    if (nav.path === undefined) handleExpand()
    if (onItemClick) onItemClick()
    if (external) servicePortalOutboundLink()
  }

  return (
    <Box
      position="relative"
      onMouseOver={() => {
        setHover(true)
      }}
      onMouseLeave={() => {
        setHover(false)
      }}
    >
      {navArray && nav.enabled !== false && collapsed && (
        <SubNavModal active={hover}>
          <SubNav
            collapsed
            navChildren={navChildren}
            onItemClick={() => handleRootItemClick(false)}
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
        hover={hover}
        active={isModuleActive}
        expanded={expand}
        hasArray={navArray}
        enabled={nav.enabled}
        external={nav.external}
        onClick={() => {
          !collapsed && handleRootItemClick(nav.external)
        }}
        onChevronClick={() => {
          setExpand(!expand)
        }}
        alwaysExpanded={alwaysExpanded}
        badge={badge}
      >
        {formatMessage(nav.name)}
      </NavItem>
      {!collapsed && navArray && nav.enabled !== false && (
        <AnimateHeight
          duration={300}
          height={expand ? 'auto' : alwaysExpanded ? 'auto' : 0}
        >
          <SubNav
            navChildren={navChildren}
            onItemClick={() => onItemClick && onItemClick()}
            pathname={pathname}
          />
        </AnimateHeight>
      )}
    </Box>
  )
}

export default ModuleNavigation
