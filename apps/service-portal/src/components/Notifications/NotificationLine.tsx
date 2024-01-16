import { FC, useRef } from 'react'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { dateFormat } from '@island.is/shared/constants'
import { LinkResolver, m } from '@island.is/service-portal/core'
import { AvatarImage } from '@island.is/service-portal/documents'
import { InformationPaths } from '@island.is/service-portal/information'
import format from 'date-fns/format'
import cn from 'classnames'
import * as styles from './Notifications.css'

interface Props {
  data: {
    title: string
    sender: string
    unread: boolean
    img?: string
    date?: string
  }
  onClickCallback: () => void
}

export const NotificationLine: FC<Props> = ({ data, onClickCallback }) => {
  const date = data.date ? format(new Date(data.date), dateFormat.is) : ''

  const wrapperRef = useRef(null)

  const unread = data.unread

  return (
    <Box className={styles.lineWrapper}>
      <Box
        display="flex"
        position="relative"
        borderColor="blue200"
        borderBottomWidth="standard"
        paddingX={2}
        width="full"
        className={cn(styles.line, {
          [styles.unread]: unread,
        })}
      >
        {data.img ? (
          <div ref={wrapperRef}>
            <AvatarImage
              img={data.img}
              background={data.unread ? 'white' : 'blue100'}
            />
          </div>
        ) : undefined}
        <Box
          width="full"
          display="flex"
          flexDirection="column"
          paddingLeft={2}
          minWidth={0}
        >
          <Box display="flex" flexDirection="row" justifyContent="spaceBetween">
            <Text variant="small" truncate>
              {data.sender}
            </Text>
            <Text variant="small">{date}</Text>
          </Box>
          <Box display="flex" flexDirection="row" justifyContent="spaceBetween">
            <LinkResolver
              className={styles.link}
              href={InformationPaths.NotificationDetail.replace(':id', '123')}
              callback={onClickCallback}
            >
              <Text
                fontWeight={unread ? 'medium' : 'regular'}
                variant="medium"
                color="blue400"
                truncate
              >
                {data.title}
              </Text>
            </LinkResolver>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default NotificationLine
