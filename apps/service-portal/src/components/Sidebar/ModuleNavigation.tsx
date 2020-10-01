import React, { FC, useState } from 'react'
import {
  ServicePortalNavigationItem,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { Box, Stack, Divider } from '@island.is/island-ui/core'
import { useLocation } from 'react-router-dom'
import AnimateHeight from 'react-animate-height'
import IconButton from '../Button/IconButton/IconButton'
import LinkButton from '../Button/LinkButton/LinkButton'
import { useLocale } from '@island.is/localization'
import NavItem from './NavItem/NavItem'

interface Props {
  nav: ServicePortalNavigationItem
  variant: 'blue' | 'purple'
}

const ModuleNavigation: FC<Props> = ({ nav, variant }) => {
  const [expand, setExpand] = useState(false)
  const { pathname } = useLocation()
  const isModuleActive =
    (nav.path &&
      nav.path !== ServicePortalPath.MinarSidurRoot &&
      pathname.includes(nav.path)) ||
    expand ||
    nav.path === pathname
  const { formatMessage } = useLocale()
  const handleExpand = () => setExpand(!expand)

  return (
    <Box>
      <NavItem
        path={nav.path}
        icon={nav.icon}
        active={isModuleActive}
        variant={variant}
        onClick={nav.path === undefined ? handleExpand : undefined}
      >
        {formatMessage(nav.name)}
      </NavItem>
      {Array.isArray(nav.children) && nav.children.length > 0 && (
        <AnimateHeight duration={300} height={isModuleActive ? 'auto' : 0}>
          <div>
            <Box paddingLeft={4} paddingTop={2} paddingBottom={2}>
              <Stack space={1}>
                {nav.children.map((child, index) => (
                  <LinkButton
                    url={child.path}
                    key={`child-${index}`}
                    active={child.path && pathname.includes(child.path)}
                    external={child.external}
                  >
                    {formatMessage(child.name)}
                  </LinkButton>
                ))}
              </Stack>
            </Box>
            <Divider />
          </div>
        </AnimateHeight>
      )}
    </Box>
  )
}

export default ModuleNavigation
