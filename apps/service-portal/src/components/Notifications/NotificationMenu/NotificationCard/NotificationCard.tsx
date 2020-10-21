import React, { FC } from 'react'
import { NotificationCard as Card } from '../mockNotifications'
import {
  Box,
  Typography,
  Icon,
  Stack,
  ButtonDeprecated as Button,
} from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'
import * as styles from './Notificationcard.treat'
import cn from 'classnames'
import { ActionMenu, ActionMenuItem } from '@island.is/service-portal/core'

interface Props {
  card: Card
  onClick: () => void
}

const NotificationCard: FC<Props> = ({ card, onClick }) => {
  return (
    <Box
      position="relative"
      padding={3}
      border="standard"
      borderRadius="standard"
      className={cn(styles.card, {
        [styles.unread]: !card.isRead,
      })}
    >
      <div className={styles.controlMenu}>
        <ActionMenu>
          <ActionMenuItem>Merkja sem lesið</ActionMenuItem>
          <ActionMenuItem>Eyða tilkynningu</ActionMenuItem>
        </ActionMenu>
      </div>
      <Stack space={1}>
        <Box className={styles.title}>
          <Typography variant="h4">{card.title}</Typography>
        </Box>
        <Typography variant="p" as="div">
          {card.text}
        </Typography>
        <Box textAlign="right">
          <Link to={card.link.url} className={styles.link} onClick={onClick}>
            <Button variant="text" size="small" icon="arrowRight">
              {card.link.title}
            </Button>
          </Link>
        </Box>
      </Stack>
    </Box>
  )
}

export default NotificationCard
