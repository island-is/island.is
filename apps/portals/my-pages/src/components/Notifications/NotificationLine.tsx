import {
  NotificationMessage,
  NotificationMetadata,
  NotificationSender,
} from '@island.is/api/schema'
import { Box, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { LinkResolver } from '@island.is/portals/my-pages/core'
import { AvatarImage } from '@island.is/portals/my-pages/documents'
import {
  COAT_OF_ARMS,
  resolveLink,
} from '@island.is/portals/my-pages/information'
import { dateFormat } from '@island.is/shared/constants'
import cn from 'classnames'
import format from 'date-fns/format'
import { useWindowSize } from 'react-use'
import * as styles from './Notifications.css'

interface Props {
  data: {
    metadata: NotificationMetadata
    message: Omit<NotificationMessage, 'body'>
    sender: NotificationSender
  }
  onClickCallback: () => void
}

export const NotificationLine = ({ data, onClickCallback }: Props) => {
  const { width } = useWindowSize()

  const isMobile = width < theme.breakpoints.md

  const date = data.metadata?.created
    ? format(new Date(data.metadata.created), dateFormat.is)
    : ''

  const isRead = data.metadata?.read

  return (
    <Box className={styles.lineWrapper}>
      <LinkResolver
        className={styles.link}
        href={resolveLink(data.message?.link)}
        callback={onClickCallback}
      >
        <Box
          display="flex"
          position="relative"
          borderColor="blue200"
          borderBottomWidth="standard"
          padding={2}
          width="full"
          className={cn(styles.line, {
            [styles.unread]: !isRead,
          })}
        >
          <AvatarImage
            img={data.sender?.logoUrl ?? COAT_OF_ARMS}
            background={!isRead ? 'white' : 'blue100'}
            as="div"
            imageClass={styles.img}
          />
          <Box
            width="full"
            display="flex"
            flexDirection="column"
            paddingLeft={isMobile ? 'p2' : 2}
            minWidth={0}
          >
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="spaceBetween"
            >
              <Text
                fontWeight={isRead ? 'regular' : 'medium'}
                variant={isMobile ? 'default' : 'medium'}
                color="blue400"
                truncate
              >
                {data.message.title}
              </Text>
              <Text variant={isMobile ? 'medium' : 'small'}>{date}</Text>
            </Box>
            <Box
              marginTop={1}
              display="flex"
              flexDirection="row"
              justifyContent="spaceBetween"
            >
              <Text variant={isMobile ? 'medium' : 'small'}>
                {data.message.displayBody}
              </Text>
            </Box>
          </Box>
        </Box>
      </LinkResolver>
    </Box>
  )
}

export default NotificationLine
