import React, { FC } from 'react'
import * as styles from './NotificationMenu.treat'
import { Box, Text, Stack, Button } from '@island.is/island-ui/core'
import { notifications } from './mockNotifications'
import NotificationCard from './NotificationCard/NotificationCard'
import { MenuState } from '../../../store/actions'
import { Link } from 'react-router-dom'
import { Menu, ServicePortalPath } from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'

interface Props {
  state: MenuState
  onClose: () => void
}

const NotificationMenu: FC<Props> = ({ state, onClose }) => {
  const { formatMessage } = useLocale()
  useNamespaces('sp.settings')

  return (
    <Box position="relative">
      <Menu isOpen={state === 'open'} onCloseMenu={onClose}>
        <Box className={styles.menu}>
          <Text variant="h3">
            {formatMessage({
              id: 'service.portal:messages',
              defaultMessage: 'Skilaboð',
            })}
          </Text>
          <Box className={styles.messages}>
            {notifications.sections.map((section, index) => (
              <Box marginBottom={3} key={index}>
                <Stack space={1}>
                  <Box marginBottom={1} textAlign="right">
                    <Text variant="eyebrow" as="span" color="dark300">
                      {formatMessage({
                        id: 'service.portal:today',
                        defaultMessage: 'Í dag',
                      })}
                    </Text>
                  </Box>
                  {section.cards.map((card) => (
                    <NotificationCard
                      key={card.id}
                      card={card}
                      onClick={onClose}
                    />
                  ))}
                </Stack>
              </Box>
            ))}
          </Box>
          <Box marginTop={4}>
            <Link to={ServicePortalPath.MessagesRoot} onClick={onClose}>
              <Button fluid>
                {formatMessage({
                  id: 'sp.settings:see-all-messages',
                  defaultMessage: 'Sjá öll skilaboð',
                })}
              </Button>
            </Link>
            <Box display="flex" justifyContent="center" marginTop={1}>
              <Link to={ServicePortalPath.StillingarRoot} onClick={onClose}>
                <Button variant="text" icon="arrowForward">
                  {formatMessage({
                    id: 'sp.settings:goto-settings',
                    defaultMessage: 'Fara í stillingar',
                  })}
                </Button>
              </Link>
            </Box>
          </Box>
        </Box>
      </Menu>
    </Box>
  )
}

export default NotificationMenu
