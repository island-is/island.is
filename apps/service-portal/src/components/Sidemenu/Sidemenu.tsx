import React, { ReactElement, useRef } from 'react'
import { Box, Divider, Icon, Stack, Text } from '@island.is/island-ui/core'
import { ServicePortalPath } from '@island.is/service-portal/core'
import useNavigation from '../../hooks/useNavigation/useNavigation'
import { ActionType } from '../../store/actions'
import { useStore } from '../../store/stateProvider'
import * as styles from './Sidemenu.css'
import { sharedMessages } from '@island.is/shared/translations'
import { useLocale } from '@island.is/localization'
import { Link } from 'react-router-dom'
import { UserLanguageSwitcher } from '@island.is/shared/components'
import { useAuth } from '@island.is/auth/react'

interface Props {
  position: number
}
const Sidemenu = ({ position }: Props): ReactElement | null => {
  const ref = useRef(null)
  const [{ mobileMenuState }, dispatch] = useStore()
  const navigation = useNavigation()
  const { formatMessage } = useLocale()
  const { userInfo: user } = useAuth()

  const handleLinkClick = () =>
    dispatch({
      type: ActionType.SetMobileMenuState,
      payload: 'closed',
    })

  if (mobileMenuState === 'closed') return null

  return (
    <Box
      position="fixed"
      className={styles.wrapper}
      ref={ref}
      style={{ top: position }}
      background="blue200"
    >
      <Box
        display="flex"
        justifyContent="spaceBetween"
        paddingY={6}
        paddingLeft={10}
        paddingRight={6}
        background="blue100"
      >
        {user && <UserLanguageSwitcher user={user} />}

        <button
          className={styles.closeButton}
          onClick={handleLinkClick}
          aria-label={formatMessage(sharedMessages.close)}
        >
          <Icon icon="close" color="blue400" />
        </button>
      </Box>
      <Box display="flex" flexDirection="column">
        <Box
          className={styles.keyItems}
          justifyContent="flexEnd"
          background="blue100"
        >
          {navigation.map((rootItem, rootIndex) => (
            <Box
              key={rootIndex}
              paddingLeft={10}
              paddingBottom={6}
              className={styles.navItems}
              height="full"
              display="flex"
              flexDirection="column"
              justifyContent="flexEnd"
            >
              <Stack space={2}>
                {rootItem.children
                  ?.filter((item) => item.keyItem)
                  .map(
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
                      ),
                  )}
              </Stack>
            </Box>
          ))}
        </Box>
        <Box background="blue200" className={styles.categories}>
          {/*  Inline style to dynamicly change position of header because of alert banners */}
          {navigation.map((rootItem, rootIndex) => (
            <Box key={rootIndex} paddingX={10} className={styles.navItems}>
              <Text
                variant="small"
                fontWeight="semiBold"
                color="blue600"
                paddingTop={4}
              >
                Mínir flokkar
              </Text>
              <Box paddingBottom={4} paddingTop={2}>
                <Divider weight="blue300" />
              </Box>
              <Stack space={2}>
                {rootItem.children
                  ?.filter((item) => !item.keyItem)
                  .map(
                    (navRoot, index) =>
                      navRoot.path !== ServicePortalPath.MinarSidurRoot &&
                      !navRoot.navHide && (
                        <Link
                          to={navRoot.path ?? '/'}
                          onClick={handleLinkClick}
                          key={`sidemenu-item-${index}`}
                        >
                          <Text
                            variant="default"
                            fontWeight="regular"
                            color="blue600"
                          >
                            {formatMessage(navRoot.name)}
                          </Text>
                        </Link>
                      ),
                  )}
              </Stack>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default Sidemenu
