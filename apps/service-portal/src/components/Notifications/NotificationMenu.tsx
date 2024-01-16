import React, { ReactElement } from 'react'
import {
  Box,
  Button,
  GridContainer,
  Hidden,
  Icon,
  ModalBase,
  Text,
} from '@island.is/island-ui/core'
import { LinkResolver } from '@island.is/service-portal/core'
import { InformationPaths } from '@island.is/service-portal/information'
import { sharedMessages } from '@island.is/shared/translations'
import { useLocale, useNamespaces } from '@island.is/localization'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'
import { m } from '@island.is/service-portal/core'
import NotificationLine from './NotificationLine'
import cn from 'classnames'
import * as styles from './Notifications.css'

interface Props {
  closeNotificationMenu: () => void
  sideMenuOpen: boolean
  rightPosition?: number
}
const NotificationMenu = ({
  closeNotificationMenu,
  sideMenuOpen,
  rightPosition,
}: Props): ReactElement | null => {
  useNamespaces(['service.portal'])
  const { formatMessage } = useLocale()
  const { width } = useWindowSize()

  const isMobile = width < theme.breakpoints.md

  const onClose = () => {
    closeNotificationMenu()
  }
  const closeButton = (
    <button
      className={styles.closeButton}
      onClick={onClose}
      aria-label={formatMessage(sharedMessages.close)}
    >
      <Icon icon="close" color="blue400" />
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
                left: rightPosition ?? '75%',
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
              borderRadius="circle"
              background="blue100"
              display="flex"
              justifyContent="center"
              alignItems="center"
              className={styles.overviewIcon}
              marginRight={2}
            >
              <Icon
                icon="notifications"
                type="outline"
                color="blue400"
                size="small"
              />
            </Box>
            <Text variant="h4">{formatMessage(m.notifications)}</Text>
          </Box>
          <Box className={styles.navWrapper}>
            {[
              {
                title: 'Mundu eftir að skrá kílómetrastöðu ',
                sender: 'Samgöngustofa',
                unread: true,
                date: '2024-01-14T15:59:07.000Z',
                img: 'https://images.ctfassets.net/8k0h54kbe6bj/3EumKpWqbPFygVWxWteoW/2961b0d9c162e8528e5771ab1707a368/Samgongustofa-stakt-400-400.png',
              },
              {
                title: 'Vegabréfið þitt er að renna út.',
                sender: 'Skírteini',
                unread: true,
                date: '2024-01-01T15:59:07.000Z',
                img: 'https://images.ctfassets.net/8k0h54kbe6bj/6XhCz5Ss17OVLxpXNVDxAO/9fc63716a739a008d064ebb50b4c964a/skjaldamerkid.svg',
              },
              {
                title: 'Ný vara hefur bæst við Mínar síður.',
                sender: 'Ísland.is',
                date: '2023-12-24T15:59:07.000Z',
                unread: false,
              },
              {
                title: 'Gögn barna eru nú að finna á þeirra notanda',
                sender: 'Mínar upplýsingar',
                date: '2023-12-12T15:59:07.000Z',
                unread: false,
              },
            ]?.map((item) => (
              <NotificationLine onClickCallback={onClose} data={item} />
            ))}
            <Box
              paddingTop={2}
              paddingBottom={1}
              textAlign="center"
              width="full"
            >
              <LinkResolver
                className={styles.link}
                href={InformationPaths.Notifications}
              >
                <Button
                  icon="arrowForward"
                  iconType="filled"
                  size="medium"
                  type="text"
                  variant="text"
                  unfocusable
                  onClick={onClose}
                >
                  Sjá allar tilkynningar
                </Button>
              </LinkResolver>
            </Box>
          </Box>
        </Box>
        <Hidden below="md">{closeButton}</Hidden>
      </Box>
    </Box>
  )

  return isMobile ? (
    <Box display={sideMenuOpen ? 'flex' : 'none'} height="full">
      {content}
    </Box>
  ) : (
    <ModalBase
      baseId="service-portal-notification-menu"
      isVisible={sideMenuOpen}
      hideOnClickOutside={true}
      hideOnEsc={true}
      modalLabel={formatMessage({
        id: 'service.portal:menu-button-aria',
        description: 'Lýsing á notendavalmynd fyrir skjálesara',
        defaultMessage: 'Valmynd fyrir yfirlit',
      })}
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

export default NotificationMenu
