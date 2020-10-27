import React, { FC } from 'react'
import * as styles from './NotificationMenu.treat'
import cn from 'classnames'
import {
  Box,
  Typography,
  Stack,
  ButtonDeprecated as Button,
} from '@island.is/island-ui/core'
import { notifications } from './mockNotifications'
import NotificationCard from './NotificationCard/NotificationCard'
import { MenuState } from '../../../store/actions'
import { Link } from 'react-router-dom'
import { Menu, ServicePortalPath } from '@island.is/service-portal/core'

interface Props {
  state: MenuState
  onClose: () => void
}

const NotificationMenu: FC<Props> = ({ state, onClose }) => {
  return (
    <Box position="relative">
      <Menu isOpen={state === 'open'} onCloseMenu={onClose}>
        <Box className={styles.menu}>
          <Typography variant="h3">Skilaboð</Typography>
          <Box className={styles.messages}>
            {notifications.sections.map((section, index) => (
              <Box marginBottom={3} key={index}>
                <Stack space={1}>
                  <Box marginBottom={1} textAlign="right">
                    <Typography variant="eyebrow" as="span" color="dark300">
                      Í dag
                    </Typography>
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
            <Link to={ServicePortalPath.SkilabodRoot} onClick={onClose}>
              <Button width="fluid">Sjá öll skilaboð</Button>
            </Link>
          </Box>
        </Box>
      </Menu>
    </Box>
  )
}

export default NotificationMenu
