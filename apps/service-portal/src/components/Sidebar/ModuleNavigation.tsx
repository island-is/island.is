import React, { FC } from 'react'
import { ServicePortalNavigationItem } from '@island.is/service-portal/core'
import { Box, Stack, Divider } from '@island.is/island-ui/core'
import { useLocation } from 'react-router-dom'
import AnimateHeight from 'react-animate-height'
import IconButton from '../Button/IconButton/IconButton'
import LinkButton from '../Button/LinkButton/LinkButton'

interface Props {
  nav: ServicePortalNavigationItem
}

const ModuleNavigation: FC<Props> = ({ nav }) => {
  const location = useLocation()
  const isModuleActive = location.pathname.includes(nav.path)

  return (
    <Box marginBottom={2}>
      <IconButton url={nav.path} icon={nav.icon} active={isModuleActive}>
        {nav.name}
      </IconButton>
      {nav.children?.length > 0 && (
        <AnimateHeight duration={300} height={isModuleActive ? 'auto' : 0}>
          <div>
            <Box paddingLeft={4} paddingTop={2} paddingBottom={2}>
              <Stack space={1}>
                {nav.children.map((child, index) => (
                  <LinkButton
                    url={child.path}
                    key={`child-${index}`}
                    active={location.pathname.includes(child.path)}
                  >
                    {child.name}
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
