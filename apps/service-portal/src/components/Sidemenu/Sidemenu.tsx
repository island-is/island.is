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
      baseId={'service-portal-sidemenu'}
      onVisibilityChange={(visibility: boolean) => {
        if (visibility !== sideMenuOpen) {
          onClose()
        }
      }}
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
    >
      <GridContainer>
        <Box display="flex" justifyContent="flexEnd">
          <Box
            position="relative"
            background="white"
            padding={3}
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
                flexWrap="nowrap"
                alignItems="center"
                paddingBottom={3}
                paddingTop={2}
              >
                Pósthólf
              </Box>
            </Box>
            <Hidden below="md">{closeButton}</Hidden>
          </Box>
        </Box>
      </GridContainer>
    </ModalBase>
  )
}

export default Sidemenu
