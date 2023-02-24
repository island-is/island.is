import React, { ReactElement, useRef } from 'react'
import { Box, Divider, Icon, Stack, Text } from '@island.is/island-ui/core'
import {
  ServicePortalPath,
  useDynamicRoutesWithNavigation,
} from '@island.is/service-portal/core'
import * as styles from './Sidemenu.css'
import { sharedMessages } from '@island.is/shared/translations'
import { useLocale } from '@island.is/localization'
import { Link } from 'react-router-dom'
import { MAIN_NAVIGATION } from '../../lib/masterNavigation'
import { iconTypeToSVG } from '../../utils/Icons/idMapper'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'
import cn from 'classnames'
import { useListDocuments } from '@island.is/service-portal/graphql'

interface Props {
  position: number
  setSideMenuOpen: (status: boolean) => void
  sideMenuOpen: boolean
}
const Sidemenu = ({
  position,
  setSideMenuOpen,
  sideMenuOpen,
}: Props): ReactElement | null => {
  const ref = useRef(null)
  const navigation = useDynamicRoutesWithNavigation(MAIN_NAVIGATION)
  const { formatMessage } = useLocale()
  const { width } = useWindowSize()
  const { unreadCounter } = useListDocuments()

  const isMobile = width < theme.breakpoints.md

  const badgeActive: keyof typeof styles.badge =
    unreadCounter > 0 ? 'active' : 'inactive'

  if (!sideMenuOpen) return null

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
        justifyContent="flexEnd"
        paddingY={6}
        paddingLeft={10}
        paddingRight={6}
        background="blue100"
      >
        <button
          className={styles.closeButton}
          aria-label={formatMessage(sharedMessages.close)}
          onClick={() => setSideMenuOpen(false)}
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
          <Box
            paddingLeft={10}
            paddingBottom={6}
            className={styles.navItems}
            height="full"
            display="flex"
            flexDirection="column"
            justifyContent="flexEnd"
          >
            <Stack space={2}>
              {navigation?.children
                ?.filter((item) => item.isKeyitem)
                .map(
                  (navRoot, index) =>
                    navRoot.path !== ServicePortalPath.MinarSidurRoot &&
                    !navRoot.navHide && (
                      <Link
                        to={navRoot.path ?? '/'}
                        key={`sidemenu-key-item-${index}`}
                        onClick={() => setSideMenuOpen(false)}
                      >
                        <Box
                          display="flex"
                          flexDirection="row"
                          alignItems="center"
                          justifyContent="flexStart"
                          position={
                            navRoot.subscribesTo === 'documents'
                              ? 'relative'
                              : undefined
                          }
                        >
                          {navRoot.icon && (
                            <Box className={styles.icon}>
                              <Icon
                                icon={navRoot.icon.icon}
                                type="outline"
                                color="blue400"
                              />
                            </Box>
                          )}
                          {navRoot.subscribesTo === 'documents' && (
                            <Box
                              borderRadius="circle"
                              className={cn(styles.badge[badgeActive])}
                            />
                          )}
                          <Text variant="h3" color="blue400">
                            {formatMessage(navRoot.name)}
                          </Text>
                        </Box>
                      </Link>
                    ),
                )}
            </Stack>
          </Box>
        </Box>
        <Box paddingLeft={10} paddingRight={6}>
          <Text
            color="blue600"
            fontWeight="semiBold"
            variant="small"
            marginTop={4}
            marginBottom={2}
          >
            {formatMessage(sharedMessages.myCategories)}
          </Text>
          <Divider weight="blue300" />
          <Box marginTop={4}>
            <Stack space={2}>
              {navigation?.children
                ?.filter((item) => !item.isKeyitem && !item.navHide)
                .map(
                  (navRoot, index) =>
                    navRoot.path !== ServicePortalPath.MinarSidurRoot &&
                    !navRoot.navHide && (
                      <Link
                        to={navRoot.path ?? '/'}
                        key={`sidemenu-item-${index}`}
                        onClick={() => setSideMenuOpen(false)}
                      >
                        <Text color="blue600">
                          {formatMessage(navRoot.name)}
                        </Text>
                      </Link>
                    ),
                )}
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Sidemenu
