/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useEffect, useState } from 'react'
import { Box, Typography, Icon, Stack } from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'
import { useStateValue } from '../../stateProvider'
import { useHistory } from 'react-router-dom'
import * as styles from './Sidebar.treat'

export const Sidebar: FC<{}> = () => {
  const [{ modules, navigation, navigationState }, dispatch] = useStateValue()
  const history = useHistory()
  const [pathName, setPathName] = useState<string>('')

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

  useEffect(() => {
    history.listen((location, action) => {
      setPathName(location.pathname)
    })
  }, [history])

  return (
    <aside className={styles.sidebar}>
      <Box padding="containerGutter" className={styles.sidebarContainer}>
        <Stack space={[0, 2]}>
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
              {navigation.applications.children &&
                pathName.startsWith(navigation.applications.url) && (
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
        </Stack>
      </Box>
    </aside>
  )
}

export default Sidebar
