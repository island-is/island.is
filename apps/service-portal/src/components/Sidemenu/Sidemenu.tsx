import React, { ReactElement, useRef, useState } from 'react'
import {
  Box,
  Button,
  Divider,
  GridContainer,
  Hidden,
  Icon,
  ModalBase,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  Modal,
  ServicePortalPath,
  useDynamicRoutesWithNavigation,
} from '@island.is/service-portal/core'
import * as styles from './Sidemenu.css'
import { sharedMessages } from '@island.is/shared/translations'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Link } from 'react-router-dom'
import { MAIN_NAVIGATION } from '../../lib/masterNavigation'
import { iconTypeToSVG } from '../../utils/Icons/idMapper'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'
import cn from 'classnames'
import { useListDocuments } from '@island.is/service-portal/graphql'
import SidemenuItem from './SidemenuItem'
import { m } from '@island.is/service-portal/core'
interface Props {
  setSideMenuOpen: (status: boolean) => void
  sideMenuOpen: boolean
}
const Sidemenu = ({
  setSideMenuOpen,
  sideMenuOpen,
}: Props): ReactElement | null => {
  useNamespaces(['service.portal'])
  const ref = useRef(null)
  const navigation = useDynamicRoutesWithNavigation(MAIN_NAVIGATION)
  const { formatMessage } = useLocale()
  const { width } = useWindowSize()
  const { unreadCounter } = useListDocuments()

  const isMobile = width < theme.breakpoints.md

  const badgeActive: keyof typeof styles.badge =
    unreadCounter > 0 ? 'active' : 'inactive'

  console.log('SIDEMENU IS OPEN ?? ', sideMenuOpen)

  const onClose = () => {
    setSideMenuOpen(false)
  }
  const closeButton = (
    <button
      className={styles.closeButton}
      onClick={() => setSideMenuOpen(false)}
      aria-label={formatMessage(sharedMessages.close)}
    >
      <Icon icon="close" color="blue400" />
    </button>
  )
  return (
    <ModalBase
      baseId="service-portal-sidemenu"
      isVisible={sideMenuOpen}
      hideOnClickOutside={true}
      hideOnEsc={true}
      modalLabel={formatMessage({
        id: 'service.portal:user-button-aria',
        description: 'Lýsing á notendavalmynd fyrir skjálesara',
        defaultMessage: 'Útskráning og aðgangsstillingar',
      })}
      removeOnClose={true}
      preventBodyScroll={true}
      onVisibilityChange={(visibility: boolean) => {
        if (visibility !== sideMenuOpen) {
          onClose()
        }
      }}
    >
      <GridContainer>
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
          >
            <Box
              display="flex"
              flexDirection="column"
              className={styles.wrapper}
            >
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                marginBottom={1}
                marginTop={2}
              >
                <Box
                  borderRadius="circle"
                  background="blue100"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  className={styles.overviewIcon}
                  marginRight={2}
                >
                  <Icon icon="dots" />
                </Box>
                <Text variant="h4">{formatMessage(m.overview)}</Text>
              </Box>
              <Box
                display="flex"
                flexWrap="wrap"
                paddingBottom={3}
                paddingTop={2}
                columnGap={1}
                rowGap={1}
              >
                {navigation?.children?.map(
                  (navRoot, index) =>
                    navRoot.path !== ServicePortalPath.MinarSidurRoot &&
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
            {closeButton}
          </Box>
        </Box>
      </GridContainer>
    </ModalBase>
  )
}

export default Sidemenu
