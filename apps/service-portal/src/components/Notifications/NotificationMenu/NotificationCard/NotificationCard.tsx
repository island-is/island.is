import React, { FC } from 'react'
import { NotificationCard as Card } from '../mockNotifications'
import { Box, Stack, Button, Tag, Text } from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'
import * as styles from './Notificationcard.css'
import cn from 'classnames'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'

interface Props {
  card: Card
  onClick: () => void
}

const NotificationCard: FC<Props> = ({ card, onClick }) => {
  const { formatMessage, lang } = useLocale()

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
      <Box
        display="flex"
        alignItems="flexEnd"
        justifyContent="spaceBetween"
        marginBottom={2}
      >
        <Text variant="eyebrow" color="purple400">
          {card.provider}
        </Text>
        <Tag variant="blue" outlined>
          {lang === 'en' ? 'Notification' : 'Tilkynning'}
        </Tag>
      </Box>
      <Stack space={1}>
        <Box display="flex" justifyContent="spaceBetween" alignItems="center">
          <Text variant="h4" as="h4">
            {formatMessage(card.title)}
          </Text>
          {card.wip && (
            <Tag variant="purple" outlined>
              {formatMessage(m.inProgress)}
            </Tag>
          )}
        </Box>
        <Text as="div">{formatMessage(card.text)}</Text>
        <Box
          display="flex"
          justifyContent="flexStart"
          alignItems="center"
          marginTop={2}
        >
          <Link to={card.link.url} className={styles.link} onClick={onClick}>
            <Button variant="text" size="small" icon="arrowForward">
              {formatMessage(card.link.title)}
            </Button>
          </Link>
        </Box>
      </Stack>
    </Box>
  )
}

export default NotificationCard
