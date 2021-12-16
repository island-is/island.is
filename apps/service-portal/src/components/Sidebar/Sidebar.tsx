import React, { FC, useState } from 'react'
import { Box, Stack, Logo, FocusableBox, Icon } from '@island.is/island-ui/core'
import { BetaTag } from '../Logo/BetaTag'
import { ActionType } from '../../store/actions'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { Link } from 'react-router-dom'
import { useStore } from '../../store/stateProvider'
import ModuleNavigation from './ModuleNavigation'
import useNavigation from '../../hooks/useNavigation/useNavigation'
import { useUpdateUnreadDocuments } from '@island.is/service-portal/core'
import * as styles from './Sidebar.css'
import cn from 'classnames'

export const Sidebar: FC<{}> = () => {
  const navigation = useNavigation()
  const [{ sidebarState }, dispatch] = useStore()
  const [collapsed, setCollapsed] = useState(sidebarState === 'closed')
  const badgeContext = useUpdateUnreadDocuments()

  return (
    <aside className={cn(styles.sidebar, collapsed && styles.collapsed)}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="flexStart"
        marginBottom={3}
        background={collapsed ? 'transparent' : 'blue100'}
        padding={collapsed ? 6 : 3}
        paddingRight={collapsed ? 6 : 0}
      >
        <Box
          className={collapsed && styles.logoCollapsed}
          paddingBottom={8}
          paddingTop={3}
        >
          <Link to={ServicePortalPath.MinarSidurRoot}>
            <FocusableBox component="div">
              <Logo
                width={collapsed ? 24 : 136}
                iconOnly={collapsed}
                id="sidebar"
              />
              <BetaTag />
            </FocusableBox>
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
                navRoot.path !== ServicePortalPath.MinarSidurRoot && (
                  <ModuleNavigation
                    key={index}
                    nav={navRoot}
                    badge={
                      navRoot.subscribesTo === 'documents' &&
                      badgeContext.unreadDocumentsCounter > 0
                    }
                  />
                ),
            )}
          </Stack>
        ))}
      </Box>
    </aside>
  )
}

export default Sidebar
