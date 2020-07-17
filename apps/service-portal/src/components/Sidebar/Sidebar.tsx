/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useEffect } from 'react'
import { Box, Typography, Divider, Icon } from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'
import { useStore } from '../../stateProvider'
import { ServicePortalNavigationItem } from '@island.is/service-portal/core'

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
  const [{ modules, navigation, navigationState }, dispatch] = useStore()

  useEffect(() => {
    async function fetchNavigation() {
      // TODO: Wait for them all or load them in as soon as they arrive?
      const nav = await Promise.all([
        modules.applicationsModule.navigation(),
        modules.documentsModule.navigation(),
      ])

      dispatch({
        type: 'setNavigation',
        payload: {
          ...navigation,
          applications: nav[0],
          documents: nav[1],
        },
      })
    }

    if (navigationState === 'passive') fetchNavigation()
  }, [dispatch, navigation, modules, navigationState])

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
