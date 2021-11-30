import React, { FC, useState } from 'react'
import {
  ServicePortalNavigationItem,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import * as styles from './Sidebar.css'
import { Box, Divider, Stack, Text } from '@island.is/island-ui/core'
import { useLocation } from 'react-router-dom'
import AnimateHeight from 'react-animate-height'
import { useLocale } from '@island.is/localization'
import NavItem from './NavItem/NavItem'
import SubNavItem from './NavItem/SubNavItem'
import { servicePortalOutboundLink } from '@island.is/plausible'

interface Props {
  nav: ServicePortalNavigationItem
  variant: 'blue' | 'blueberry'
  alwaysExpanded?: boolean
  onItemClick?: () => void
}

const ModuleNavigation: FC<Props> = ({
  nav,
  variant,
  alwaysExpanded,
  onItemClick,
}) => {
  const [expand, setExpand] = useState(false)
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
  const handleExpand = () => setExpand(!expand)

  const handleRootItemClick = (external?: boolean) => {
    if (nav.path === undefined) handleExpand()
    if (onItemClick) onItemClick()
    if (external) {
      servicePortalOutboundLink()
    }
  }

  const navChildren = nav?.children?.filter((child) => !child.navHide)

  return (
    <Box>
      {nav.heading && (
        <Text
          variant="eyebrow"
          color={variant === 'blue' ? 'blue600' : 'blueberry600'}
          fontWeight="semiBold"
          marginBottom={2}
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
        active={isModuleActive}
        enabled={nav.enabled}
        external={nav.external}
        onClick={() => {
          handleRootItemClick(nav.external)
        }}
        variant={variant}
      >
        {formatMessage(nav.name)}
      </NavItem>
      {Array.isArray(navChildren) && navChildren.length > 0 && (
        <AnimateHeight
          duration={300}
          height={isModuleActive || alwaysExpanded ? 'auto' : 0}
        >
          <div>
            <Box className={styles.subnav} marginTop={2}>
              <Stack space={1}>
                {navChildren.map((child, index) => (
                  <SubNavItem
                    path={child.path}
                    enabled={child.enabled}
                    key={`child-${index}`}
                    active={
                      child.path && pathname.includes(child.path) ? true : false
                    }
                    external={child.external}
                    variant={variant}
                    onClick={onItemClick}
                  >
                    {formatMessage(child.name)}
                  </SubNavItem>
                ))}
              </Stack>
            </Box>
          </div>
        </AnimateHeight>
      )}
    </Box>
  )
}

export default ModuleNavigation
