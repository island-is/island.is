import { FC, useRef } from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { dateFormat } from '@island.is/shared/constants'
import { LinkResolver } from '@island.is/service-portal/core'
import format from 'date-fns/format'
import cn from 'classnames'
import * as styles from './Notifications.css'
import { Notification } from '@island.is/api/schema'
import { AvatarImage } from '@island.is/service-portal/documents'

interface Props {
  data: Omit<Notification, 'recipient'>
  onClickCallback: () => void
}

export const NotificationLine = ({ data, onClickCallback }: Props) => {
  const date = data.metadata?.created
    ? format(new Date(data.metadata.created), dateFormat.is)
    : ''

  const isRead = data.metadata?.read

  return (
    <Box className={styles.lineWrapper}>
      <LinkResolver
        className={styles.link}
        href={data.message?.link?.url ?? ''}
        callback={onClickCallback}
      >
        <Box
          display="flex"
          position="relative"
          borderColor="blue200"
          borderBottomWidth="standard"
          paddingX={2}
          width="full"
          className={cn(styles.line, {
            [styles.unread]: !isRead,
          })}
        >
          {data.sender?.logoUrl ? (
            <AvatarImage
              img={data.sender.logoUrl}
              background={!isRead ? 'white' : 'blue100'}
            />
          ) : undefined}
          <Box
            width="full"
            display="flex"
            flexDirection="column"
            paddingLeft={2}
            minWidth={0}
          >
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="spaceBetween"
            >
              <Text
                fontWeight={isRead ? 'regular' : 'medium'}
                variant="medium"
                color="blue400"
                truncate
              >
                {data.message.title}
              </Text>
              <Text variant="small">{date}</Text>
            </Box>
            <Box
              marginTop={1}
              display="flex"
              flexDirection="row"
              justifyContent="spaceBetween"
            >
              <Text variant="small">{data.message.body}</Text>
            </Box>
          </Box>
        </Box>
      </LinkResolver>
    </Box>
  )
}

export default NotificationLine
