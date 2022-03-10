import React, { FC } from 'react'
import * as styles from './NotificationMenu.css'
import { Box, Text, Stack } from '@island.is/island-ui/core'
import { notifications } from './mockNotifications'
import NotificationCard from './NotificationCard/NotificationCard'
import { MenuState } from '../../../store/actions'
import { Menu } from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'

interface Props {
  state: MenuState
  onClose: () => void
  onRouteChange: () => void
}

const NotificationMenu: FC<Props> = ({ state, onClose, onRouteChange }) => {
  const { formatMessage } = useLocale()
  useNamespaces(['sp.settings', 'sp.messages'])

  return (
    <Box position="relative">
      <Menu isOpen={state === 'open'} onCloseMenu={onClose}>
        <Box className={styles.menu}>
          <Text variant="h3" as="h3">
            {formatMessage(m.messages)}
          </Text>
          <Box className={styles.messages}>
            {notifications.sections.map((section, index) => (
              <Box marginBottom={3} key={index}>
                <Stack space={1}>
                  <Box marginBottom={1} textAlign="right">
                    <Text variant="eyebrow" as="span" color="dark300">
                      {formatMessage(m.today)}
                    </Text>
                  </Box>
                  {section.cards.map((card) => (
                    <NotificationCard
                      key={card.id}
                      card={card}
                      onClick={onRouteChange}
                    />
                  ))}
                </Stack>
              </Box>
            ))}
          </Box>
        </Box>
      </Menu>
    </Box>
  )
}

export default NotificationMenu
