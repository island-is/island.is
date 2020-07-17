/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useEffect } from 'react'
import { Box, Typography, Divider, Icon } from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'
import { useStateValue } from '../../stateProvider'

export const Sidebar: FC<{}> = () => {
  const [{ modules, navigation, navigationState }, dispatch] = useStateValue()

  useEffect(() => {
    async function fetchNavigation() {
      const nav = await modules.applicationsModule.navigation()
      dispatch({
        type: 'setNavigation',
        payload: {
          ...navigation,
          applications: nav,
        },
      })
    }

    if (navigationState === 'passive') fetchNavigation()
  }, [dispatch, navigation, modules.applicationsModule, navigationState])

  return (
    <Box background="purple100" padding={4}>
      <Typography variant="h4" as="h4">
        Sidebar
      </Typography>
      <Divider weight="alternate" />
      {navigation.applications && (
        <>
          <Link to={navigation.applications.url}>
            <Box marginTop={1}>
              {navigation.applications.icon && (
                <Icon type={navigation.applications.icon} />
              )}
              <Typography variant="p" as="span">
                {navigation.applications.name}
              </Typography>
            </Box>
          </Link>
          {navigation.applications.children && (
            <Box paddingLeft={1}>
              {navigation.applications.children.map((child, index) => (
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
      )}
    </Box>
  )
}

export default Sidebar
