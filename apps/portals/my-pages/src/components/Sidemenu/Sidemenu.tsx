import React, { ReactElement, useEffect } from 'react'
import {
  Box,
  GridContainer,
  Hidden,
  Icon,
  ModalBase,
  Text,
} from '@island.is/island-ui/core'
import {
  ServicePortalPaths,
  useDynamicRoutesWithNavigation,
  useIsMobile,
} from '@island.is/portals/my-pages/core'
import * as styles from './Sidemenu.css'
import { sharedMessages } from '@island.is/shared/translations'
import { useLocale, useNamespaces } from '@island.is/localization'
import { MAIN_NAVIGATION } from '../../lib/masterNavigation'
import cn from 'classnames'
import SidemenuItem from './SidemenuItem'
import { m } from '@island.is/portals/my-pages/core'

interface Props {
  setSideMenuOpen: (status: boolean) => void
  sideMenuOpen: boolean
  rightPosition?: number
}
const Sidemenu = ({
  setSideMenuOpen,
  sideMenuOpen,
  rightPosition,
}: Props): ReactElement | null => {
  useNamespaces(['service.portal'])
  const navigation = useDynamicRoutesWithNavigation(MAIN_NAVIGATION)
  const { formatMessage } = useLocale()

  const isMobile = useIsMobile()

  // In your component logic, you can toggle the attribute on the HTML element
  useEffect(() => {
    if (sideMenuOpen) {
      document.documentElement.setAttribute('data-sidemenu-open', 'true')
    } else {
      document.documentElement.setAttribute('data-sidemenu-open', 'false')
    }

    return () => {
      document.documentElement.removeAttribute('data-sidemenu-open')
    }
  }, [sideMenuOpen])

  const onClose = () => {
    setSideMenuOpen(false)
  }
  const closeButton = (
    <button
      className={styles.closeButton}
      onClick={() => setSideMenuOpen(false)}
      aria-label={formatMessage(sharedMessages.close)}
    >
      <Icon icon="close" color="blue600" />
    </button>
  )

  const content = (
    <Box display="flex" justifyContent="flexEnd">
      <Box
        position="relative"
        background="white"
        padding={2}
        borderRadius="large"
        display="flex"
        flexDirection="column"
        height={isMobile ? 'full' : undefined}
        className={cn(
          isMobile ? styles.fullScreen : styles.dropdown,
          styles.container,
        )}
        style={
          !isMobile
            ? {
                left: rightPosition ?? '75%', // 75% represents a somewhat correct position of the sidebar if the calculation of getBoundingClientRect fails
                transform: 'translateX(-100%)',
              }
            : undefined
        }
      >
        <Box display="flex" flexDirection="column" className={styles.wrapper}>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            marginBottom={1}
            marginTop={2}
          >
            <Box
              borderRadius="full"
              background="blue100"
              display="flex"
              justifyContent="center"
              alignItems="center"
              className={styles.overviewIcon}
              marginRight={'p2'}
            >
              <Icon icon="dots" />
            </Box>
            <Text variant="h4">{formatMessage(m.overview)}</Text>
          </Box>
          <Box className={styles.navWrapper}>
            {navigation?.children?.map(
              (navRoot, index) =>
                navRoot.path !== ServicePortalPaths.Root &&
                !navRoot.navHide && (
                  <SidemenuItem
                    item={navRoot}
                    setSidemenuOpen={setSideMenuOpen}
                    key={`sidemenu-item-${index}`}
                  />
                ),
            )}
          </Box>
        </Box>
        <Hidden below="md">{closeButton}</Hidden>
      </Box>
    </Box>
  )

  return isMobile ? (
    <Box
      display={sideMenuOpen ? 'flex' : 'none'}
      height="full"
      id="sidemenu-mobile"
    >
      {content}
    </Box>
  ) : (
    <ModalBase
      baseId="service-portal-sidemenu"
      isVisible={sideMenuOpen}
      hideOnClickOutside={true}
      hideOnEsc={true}
      modalLabel={formatMessage(m.menuButtonAria)}
      removeOnClose={true}
      preventBodyScroll={false}
      onVisibilityChange={(visibility: boolean) => {
        if (visibility !== sideMenuOpen) {
          onClose()
        }
      }}
    >
      <GridContainer>{content}</GridContainer>
    </ModalBase>
  )
}

export default Sidemenu
