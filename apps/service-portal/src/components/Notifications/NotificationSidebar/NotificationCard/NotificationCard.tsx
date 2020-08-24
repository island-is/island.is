import React, { FC } from 'react'
import { NotificationCard as Card } from '../mockNotifications'
import { Box, Typography, Icon, Stack, Button } from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'
import * as styles from './Notificationcard.treat'
import cn from 'classnames'
import ActionMenu, { ActionMenuItem } from '../../../ActionMenu/ActionMenu'

interface Props {
  card: Card
}

const NotificationCard: FC<Props> = ({ card }) => {
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
        <Typography variant="h5">{card.title}</Typography>
        <Typography variant="pSmall" as="div">
          {card.text}
        </Typography>
        <Box textAlign="right">
          <Link to={card.link.url} className={styles.link}>
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
