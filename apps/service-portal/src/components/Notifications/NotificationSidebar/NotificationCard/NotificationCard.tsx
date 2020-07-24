import React, { FC } from 'react'
import { NotificationCard as Card } from '../mockNotifications'
import { Box, Typography, Icon } from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'
import * as styles from './Notificationcard.treat'
import cn from 'classnames'
import ActionMenu, {
  ActionMenuItem,
} from '../../../library/ActionMenu/ActionMenu'

interface Props {
  card: Card
}

const NotificationCard: FC<Props> = ({ card }) => {
  return (
    <Box
      position="relative"
      padding={4}
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
      <Box marginBottom={1}>
        <Typography variant="h5">{card.title}</Typography>
      </Box>
      <Box marginBottom={2}>
        <Typography variant="pSmall" as="div">
          {card.text}
        </Typography>
      </Box>
      <Link to={card.link.url}>
        <Box display="flex" alignItems="center">
          <Typography variant="tag" color="blue400">
            {card.link.title}
          </Typography>
          <Box marginLeft={1}>
            <Icon type="arrowRight" width={10} height={12} />
          </Box>
        </Box>
      </Link>
    </Box>
  )
}

export default NotificationCard
