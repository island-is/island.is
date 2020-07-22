import React, { FC } from 'react'
import { ServicePortalNavigationItem } from '@island.is/service-portal/core'
import { Box, Icon, Typography } from '@island.is/island-ui/core'
import { Link, useLocation } from 'react-router-dom'
import AnimateHeight from 'react-animate-height'

interface Props {
  nav: ServicePortalNavigationItem
}

const ModuleNavigation: FC<Props> = ({ nav }) => {
  const location = useLocation()
  const isModuleActive = location.pathname.includes(nav.url)

  return (
    <Box marginBottom={2}>
      <Link to={nav.url}>
        <Box display="flex" alignItems="center">
          {nav.icon && (
            <Box marginRight={3}>
              <Icon
                type={nav.icon}
                color={isModuleActive ? 'blue400' : 'dark300'}
              />
            </Box>
          )}
          <Typography variant={isModuleActive ? 'h5' : 'p'} as="div">
            {nav.name}
          </Typography>
        </Box>
      </Link>
      {nav.children && (
        <AnimateHeight duration={300} height={isModuleActive ? 'auto' : 0}>
          <Box paddingLeft={5} paddingTop={3}>
            {nav.children.map((child, index) => (
              <Link to={child.url} key={`child-${index}`}>
                <Box>
                  <Typography
                    variant="pSmall"
                    as="span"
                    color={
                      location.pathname === child.url ? 'blue400' : 'dark400'
                    }
                  >
                    {child.name}
                  </Typography>
                </Box>
              </Link>
            ))}
          </Box>
        </AnimateHeight>
      )}
    </Box>
  )
}

export default ModuleNavigation
