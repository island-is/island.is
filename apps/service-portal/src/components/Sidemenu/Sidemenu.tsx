import React, { ReactElement, useRef } from 'react'
import {
  Box,
  Button,
  FocusableBox,
  Icon,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { ServicePortalPath } from '@island.is/service-portal/core'
import useNavigation from '../../hooks/useNavigation/useNavigation'
import { ActionType } from '../../store/actions'
import { useStore } from '../../store/stateProvider'
import ModuleNavigation from '../Sidebar/ModuleNavigation'
import * as styles from './Sidemenu.css'
import { useListDocuments } from '@island.is/service-portal/graphql'
import { useAuth } from '@island.is/auth/react'
import NavItem from '../Sidebar/NavItem/NavItem'
import { sharedMessages } from '@island.is/shared/translations'
import { useLocale } from '@island.is/localization'
import { Link } from 'react-router-dom'

interface Props {
  position: number
}
const Sidemenu = ({ position }: Props): ReactElement | null => {
  const ref = useRef(null)
  const [{ mobileMenuState }, dispatch] = useStore()
  const { signOut } = useAuth()
  const navigation = useNavigation()
  const { unreadCounter } = useListDocuments()
  const { formatMessage } = useLocale()

  const handleLinkClick = () =>
    dispatch({
      type: ActionType.SetMobileMenuState,
      payload: 'closed',
    })

  if (mobileMenuState === 'closed') return null

  return (
    <Box
      position="absolute"
      background="blue100"
      className={styles.wrapper}
      ref={ref}
      style={{ top: position }}
    >
      <button
        className={styles.closeButton}
        onClick={handleLinkClick}
        aria-label={formatMessage(sharedMessages.close)}
      >
        <Icon icon="close" color="blue400" />
      </button>

      {/*  Inline style to dynamicly change position of header because of alert banners */}
      {navigation.map((rootItem, rootIndex) => (
        <Box key={rootIndex} paddingX={10} className={styles.navItems}>
          <Stack space={2}>
            {rootItem.children?.map(
              (navRoot, index) =>
                navRoot.path !== ServicePortalPath.MinarSidurRoot &&
                !navRoot.navHide && (
                  <Link
                    to={navRoot.path ?? '/'}
                    onClick={handleLinkClick}
                    key={`sidemenu-item-${index}`}
                  >
                    <Text variant="h3" color="blue600">
                      {formatMessage(navRoot.name)}
                    </Text>
                  </Link>
                  // <ModuleNavigation
                  //   key={index}
                  //   nav={navRoot}
                  //   onItemClick={handleLinkClick}
                  //   badge={
                  //     navRoot.subscribesTo === 'documents' && unreadCounter > 0
                  //   }
                  // />
                ),
            )}
          </Stack>
        </Box>
      ))}
      {/* <Box marginTop={2} marginBottom={2}>
        <NavItem
          onClick={() => signOut()}
          active={false}
          icon={{ icon: 'logOut', type: 'outline' }}
        >
          {formatMessage(sharedMessages.logout)}
        </NavItem>
      </Box> */}
    </Box>
  )
}

export default Sidemenu
