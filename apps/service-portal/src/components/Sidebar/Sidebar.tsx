/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import { Box, Typography, Divider, Icon } from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'
import { ServicePortalNavigationItem } from '@island.is/service-portal/core'
import useNavigation from '../../hooks/useNavigation/useNavigation'

const renderModuleNavTree = (nav: ServicePortalNavigationItem) => (
  <>
    <Link to={nav.url}>
      <Box marginTop={1}>
        {nav.icon && <Icon type={nav.icon} />}
        <Typography variant="p" as="span">
          {nav.name}
        </Typography>
      </Box>
    </Link>
    {nav.children && (
      <Box paddingLeft={1}>
        {nav.children.map((child, index) => (
          <Link to={child.url} key={`child-${index}`}>
            <Box>
              <Typography variant="p" as="span">
                {child.name}
              </Typography>
            </Box>
          </Link>
        ))}
      </Box>
    )}
  </>
)

export const Sidebar: FC<{}> = () => {
  const { navigation, navigationState } = useNavigation()

  if (navigationState.state === 'pending') return <div>loading</div>

  return (
    <Box background="purple100" padding={4}>
      <Typography variant="h4" as="h4">
        Sidebar
      </Typography>
      <Divider weight="alternate" />
      {navigation.applications && renderModuleNavTree(navigation.applications)}
      {navigation.documents && renderModuleNavTree(navigation.documents)}
    </Box>
  )
}

export default Sidebar
