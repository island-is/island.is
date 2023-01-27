import { Box, Stack, Logo } from '@island.is/island-ui/core'
import {
  ServicePortalPath,
  useDynamicRoutesWithNavigation,
} from '@island.is/service-portal/core'
import { Link } from 'react-router-dom'
import { useListDocuments } from '@island.is/service-portal/graphql'
import { useAuth } from '@island.is/auth/react'
import { useLocale } from '@island.is/localization'
import { sharedMessages } from '@island.is/shared/translations'
import ModuleNavigation from './ModuleNavigation'
import NavItem from './NavItem/NavItem'
import * as styles from './Sidebar.css'
import { MAIN_NAVIGATION } from '../../lib/masterNavigation'

interface Props {
  position: number
}

export const Sidebar = ({ position }: Props) => {
  const navigation = useDynamicRoutesWithNavigation(MAIN_NAVIGATION)
  const { signOut } = useAuth()

  const { unreadCounter } = useListDocuments()
  const { formatMessage } = useLocale()

  return (
    <aside className={styles.sidebar} style={{ top: position }}>
      {/*  Inline style to dynamicly change position of header because of alert banners */}
      <Box paddingTop={6} paddingBottom={3} paddingLeft={4}>
        <Link to={ServicePortalPath.MinarSidurRoot}>
          <Logo width={136} height={22} id="sidebar" />
        </Link>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        justifyContent="spaceBetween"
        paddingLeft={0}
        paddingRight={0}
        paddingBottom={4}
        paddingTop={5}
        height="full"
      >
        <Stack space={1}>
          {navigation?.children?.map(
            (rootItem, rootIndex) =>
              !rootItem.navHide && (
                <ModuleNavigation
                  key={rootIndex}
                  nav={rootItem}
                  badge={
                    rootItem.subscribesTo === 'documents' && unreadCounter > 0
                  }
                />
              ),
          )}
        </Stack>

        <Box marginTop={1} background="white" width="full">
          <NavItem
            onClick={() => signOut()}
            active={false}
            icon={{ icon: 'logOut', type: 'outline' }}
          >
            {formatMessage(sharedMessages.logout)}
          </NavItem>
        </Box>
      </Box>
    </aside>
  )
}

export default Sidebar
