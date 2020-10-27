import React, { FC } from 'react'
import { NotificationCard as Card } from '../mockNotifications'
import {
  Box,
  Typography,
  IconDeprecated as Icon,
  Stack,
  ButtonDeprecated as Button,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'
import * as styles from './Notificationcard.treat'
import cn from 'classnames'
import { useLocale } from '@island.is/localization'

interface Props {
  card: Card
  onClick: () => void
}

const NotificationCard: FC<Props> = ({ card, onClick }) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      position="relative"
      padding={3}
      border="standard"
      borderRadius="standard"
      className={cn(styles.card, {
        [styles.unread]: !card.isRead,
        [styles.wip]: card.wip,
      })}
    >
      <Text variant="eyebrow" color="purple400">
        {card.provider}
      </Text>
      <Stack space={1}>
        <Box display="flex" justifyContent="spaceBetween" alignItems="center">
          <Typography variant="h4">{card.title}</Typography>
          {card.wip && (
            <Tag variant="purple">
              {formatMessage({
                id: 'service.portal:in-progress',
                defaultMessage: 'Í vinnslu',
              })}
            </Tag>
          )}
        </Box>
        <Typography variant="p" as="div">
          {card.text}
        </Typography>
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="center"
          marginTop={2}
        >
          <Link to={card.link.url} className={styles.link} onClick={onClick}>
            <Button variant="text" size="small" icon="arrowRight">
              {card.link.title}
            </Button>
          </Link>
          <Tag variant="blue">{card.type}</Tag>
        </Box>
      </Stack>
    </Box>
  )
}

export default NotificationCard
