import React, { FC } from 'react'
import { ServicePortalNavigationItem } from '@island.is/service-portal/core'
import { Box, Icon, Typography } from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'

interface Props {
  nav: ServicePortalNavigationItem
}

const ModuleNavigation: FC<Props> = ({ nav }) => {
  return (
    <Box>
      <Link to={nav.url}>
        <Box display="flex" alignItems="center">
          {nav.icon && (
            <Box marginRight={3}>
              <Icon type={nav.icon} />
            </Box>
          )}
          <Typography variant="p" as="span">
            {nav.name}
          </Typography>
        </Box>
      </Link>
      {nav.children && (
        <Box paddingLeft={5} paddingTop={3} marginBottom={3}>
          {nav.children.map((child, index) => (
            <Link to={child.url} key={`child-${index}`}>
              <Box>
                <Typography variant="pSmall" as="span">
                  {child.name}
                </Typography>
              </Box>
            </Link>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default ModuleNavigation
