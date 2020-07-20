/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useEffect, useState } from 'react'
import { Box, Typography, Icon, Stack } from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'
import { useStore } from '../../stateProvider'
import { ServicePortalNavigationItem } from '@island.is/service-portal/core'
import { useHistory } from 'react-router-dom'
import * as styles from './Sidebar.treat'

export const Sidebar: FC<{}> = () => {
  const [{ modules, navigation, navigationState }, dispatch] = useStore()
  const history = useHistory()
  const [pathName, setPathName] = useState<string>('')

  const renderModuleNavTree = (nav: ServicePortalNavigationItem) => (
    <>
      <Link to={nav.url}>
        <Box marginTop={1}>
          {nav.icon && (
            <span className={styles.iconWrapper}>
              <Icon
                color={pathName.startsWith(nav.url) ? 'blue400' : 'dark200'}
                type={nav.icon}
              />
            </span>
          )}
          <Typography variant="p" as="span">
            {nav.name}
          </Typography>
        </Box>
      </Link>
      {nav.children && pathName.startsWith(nav.url) && (
        <Box paddingLeft={1}>
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
    </>
  )

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

  useEffect(() => {
    history.listen((location) => {
      setPathName(location.pathname)
    })
  }, [history])

  return (
    <aside className={styles.sidebar}>
      <Box padding="containerGutter" className={styles.sidebarContainer}>
        <Stack space={[0, 2]}>
          {navigation?.applications?.url &&
            renderModuleNavTree(navigation.applications)}
        </Stack>
      </Box>
    </aside>
  )
}

export default Sidebar
