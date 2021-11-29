import React, { FC, useState } from 'react'
import {
  Box,
  Stack,
  Logo,
  FocusableBox,
  Icon,
  Text,
} from '@island.is/island-ui/core'
import { BetaTag } from '../Logo/BetaTag'
import * as styles from './Sidebar.css'
import ModuleNavigation from './ModuleNavigation'
import useNavigation from '../../hooks/useNavigation/useNavigation'
import { ServicePortalPath, m } from '@island.is/service-portal/core'
import { Link } from 'react-router-dom'
import { useStore } from '../../store/stateProvider'
import { ActionType } from '../../store/actions'
import cn from 'classnames'
import { useUpdateUnreadDocuments } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
// eslint-disable-next-line @typescript-eslint/ban-types
export const Sidebar: FC<{}> = () => {
  const navigation = useNavigation()
  const [{ sidebarState }, dispatch] = useStore()
  const [collapsed, setCollapsed] = useState(sidebarState === 'closed')
  const badgeContext = useUpdateUnreadDocuments()
  const { formatMessage } = useLocale()

  return (
    <aside className={cn(styles.sidebar, { [styles.collapsed]: collapsed })}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="flexStart"
        marginBottom={3}
        background={collapsed ? 'transparent' : 'blue100'}
        padding={3}
        paddingRight={0}
      >
        <Box
          className={cn({ [styles.logoCollapsed]: collapsed })}
          paddingBottom={6}
          paddingTop={3}
        >
          <Link to={ServicePortalPath.MinarSidurRoot}>
            <FocusableBox component="div">
              <Logo width={collapsed ? 24 : 160} iconOnly={collapsed} />
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
              size="small"
              color="blue400"
            />
          </Box>
        </Box>
        {!collapsed &&
          navigation.map((rootItem, rootIndex) => (
            <Stack space={0} key={rootIndex}>
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
              {/* {rootIndex === 1 && (
                <Text variant="small" color="blueberry600" marginTop={3}>
                  {formatMessage(m.incomingServicesFooterMobile)}
                </Text>
              )} */}
            </Stack>
          ))}
      </Box>
    </aside>
  )
}

export default Sidebar
