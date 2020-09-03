import React, { FC, useState } from 'react'
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
  const [expand, setExpand] = useState(false)
  const location = useLocation()
  const isModuleActive =
    (nav.path && location.pathname.includes(nav.path)) || expand

  const handleExpand = () => setExpand(!expand)

  return (
    <Box>
      <IconButton
        url={nav.path}
        icon={nav.icon}
        active={isModuleActive}
        onClick={nav.path === undefined ? handleExpand : undefined}
      >
        {nav.name}
      </IconButton>
      {Array.isArray(nav.children) && nav.children.length > 0 && (
        <AnimateHeight duration={300} height={isModuleActive ? 'auto' : 0}>
          <div>
            <Box paddingLeft={4} paddingTop={2} paddingBottom={2}>
              <Stack space={1}>
                {nav.children.map((child, index) => (
                  <LinkButton
                    url={child.path}
                    key={`child-${index}`}
                    active={
                      child.path && location.pathname.includes(child.path)
                    }
                    external={child.external}
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
