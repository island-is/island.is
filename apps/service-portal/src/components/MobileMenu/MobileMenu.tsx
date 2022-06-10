import React, { ReactElement, useRef } from 'react'
import { Box, Stack } from '@island.is/island-ui/core'
import { ServicePortalPath } from '@island.is/service-portal/core'
import useNavigation from '../../hooks/useNavigation/useNavigation'
import { ActionType } from '../../store/actions'
import { useStore } from '../../store/stateProvider'
import ModuleNavigation from '../Sidebar/ModuleNavigation'
import * as styles from './MobileMenu.css'
import { useListDocuments } from '@island.is/service-portal/graphql'
import LogOutItem from '../Sidebar/NavItem/LogOutItem'
import { useAuth } from '@island.is/auth/react'

const MobileMenu = (): ReactElement | null => {
  const ref = useRef(null)
  const [{ mobileMenuState }, dispatch] = useStore()
  const { signOut } = useAuth()
  const navigation = useNavigation()
  const { unreadCounter } = useListDocuments('')

  const handleLinkClick = () =>
    dispatch({
      type: ActionType.SetMobileMenuState,
      payload: 'closed',
    })

  if (mobileMenuState === 'closed') return null

  return (
    <Box
      position="fixed"
      right={0}
      bottom={0}
      left={0}
      background="white"
      className={styles.wrapper}
      ref={ref}
      display="flex"
      flexDirection="column"
      justifyContent="spaceBetween"
    >
      {navigation.map((rootItem, rootIndex) => (
        <Box key={rootIndex} paddingX={0} marginTop={3}>
          <Stack space={2}>
            {rootItem.children?.map(
              (navRoot, index) =>
                navRoot.path !== ServicePortalPath.MinarSidurRoot &&
                !navRoot.navHide && (
                  <ModuleNavigation
                    key={index}
                    nav={navRoot}
                    onItemClick={handleLinkClick}
                    badge={
                      navRoot.subscribesTo === 'documents' && unreadCounter > 0
                    }
                  />
                ),
            )}
          </Stack>
        </Box>
      ))}
      <Box marginTop={2} marginBottom={2}>
        <LogOutItem onClick={() => signOut()} />
      </Box>
    </Box>
  )
}

export default MobileMenu
