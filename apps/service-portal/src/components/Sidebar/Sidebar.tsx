import React, { FC, useEffect, useState } from 'react'
import { Box, Stack, Logo, Icon, Button } from '@island.is/island-ui/core'
import { ActionType } from '../../store/actions'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { Link } from 'react-router-dom'
import { useStore } from '../../store/stateProvider'
import ModuleNavigation from './ModuleNavigation'
import useNavigation from '../../hooks/useNavigation/useNavigation'
import * as styles from './Sidebar.css'
import cn from 'classnames'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import { useListDocuments } from '@island.is/service-portal/graphql'
import { useAuth } from '@island.is/auth/react'
import LogOutItem from './NavItem/LogOutItem'

export const Sidebar: FC<{}> = () => {
  const navigation = useNavigation()
  const [{ sidebarState }, dispatch] = useStore()
  const [collapsed, setCollapsed] = useState(sidebarState === 'closed')
  const { width } = useWindowSize()
  const { signOut } = useAuth()
  const isTablet = width < theme.breakpoints.lg && width >= theme.breakpoints.md
  const isMobile = width < theme.breakpoints.md
  const { unreadCounter } = useListDocuments('')

  useEffect(() => {
    if (isTablet) {
      dispatch({
        type: ActionType.SetSidebarMenuState,
        payload: 'closed',
      })
      setCollapsed(true)
    }
  }, [isTablet])

  useEffect(() => {
    if (isMobile) {
      dispatch({
        type: ActionType.SetSidebarMenuState,
        payload: 'open',
      })
      setCollapsed(false)
    }
  }, [isMobile])

  return (
    <aside className={cn(styles.sidebar, collapsed && styles.collapsed)}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="flexStart"
        paddingLeft={collapsed ? 6 : 0}
        paddingRight={collapsed ? 6 : 0}
        paddingTop={3}
      >
        <Box
          className={collapsed && styles.logoCollapsed}
          paddingBottom={8}
          paddingTop={3}
          height="full"
          paddingLeft={collapsed ? 0 : 4}
        >
          <Link to={ServicePortalPath.MinarSidurRoot}>
            {collapsed ? (
              <Logo width={24} height={22} iconOnly id="sidebar-collapsed" />
            ) : (
              <Logo width={136} height={22} id="sidebar" />
            )}
          </Link>
        </Box>
        <Box>
          <Box
            className={styles.navIcon}
            borderRadius="circle"
            display="flex"
            alignItems="center"
            marginRight={2}
            padding="smallGutter"
            background="blue200"
            onClick={() => {
              dispatch({
                type: ActionType.SetSidebarMenuState,
                payload: collapsed ? 'open' : 'closed',
              })
              setCollapsed(!collapsed)
            }}
          >
            <Icon
              type="outline"
              icon={collapsed ? 'chevronForward' : 'chevronBack'}
              size="medium"
              color="blue400"
            />
          </Box>
        </Box>

        {navigation.map((rootItem, rootIndex) => (
          <Stack space={1} key={rootIndex}>
            {rootItem.children?.map(
              (navRoot, index) =>
                navRoot.path !== ServicePortalPath.MinarSidurRoot &&
                !navRoot.navHide && (
                  <ModuleNavigation
                    key={index}
                    nav={navRoot}
                    badge={
                      navRoot.subscribesTo === 'documents' && unreadCounter > 0
                    }
                  />
                ),
            )}
          </Stack>
        ))}
      </Box>
      <Stack space={1}>
        <LogOutItem onClick={() => signOut()} />
      </Stack>
    </aside>
  )
}

export default Sidebar
