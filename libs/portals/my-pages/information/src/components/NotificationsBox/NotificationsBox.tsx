import { Box, Icon, SkeletonLoader, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { LinkResolver, m } from '@island.is/portals/my-pages/core'
import { AvatarImage } from '@island.is/portals/my-pages/documents'
import { useUserInfo } from '@island.is/react-spa/bff'
import { Problem } from '@island.is/react-spa/shared'
import { hasNotificationScopes } from '@island.is/auth/scopes'
import {
  useGetUserNotificationsOverviewQuery,
  useMarkUserNotificationAsReadMutation,
} from '../../screens/Notifications/Notifications.generated'
import { InformationPaths } from '../../lib/paths'
import { COAT_OF_ARMS, resolveLink } from '../../utils/notificationLinkResolver'
import * as styles from './NotificationsBox.css'

interface Props {
  limit: number
  title?: string
}

export const NotificationsBox = ({ limit, title }: Props) => {
  const { formatMessage, lang } = useLocale()
  const userInfo = useUserInfo()
  const hasDelegationAccess = hasNotificationScopes(userInfo?.scopes)

  const [markAsRead] = useMarkUserNotificationAsReadMutation()

  const { data, loading, error } = useGetUserNotificationsOverviewQuery({
    variables: {
      input: { limit: limit, before: '', after: '' },
      locale: lang,
    },
    skip: !hasDelegationAccess,
  })

  const notifications = data?.userNotificationsOverview?.data ?? []

  const handleNotificationClick = (id: number) =>
    markAsRead({ variables: { id } })

  return (
    <Box
      position="relative"
      background="white"
      borderRadius="large"
      borderWidth="standard"
      borderColor="blue200"
      paddingTop={3}
      paddingBottom={1}
      paddingX={[0, 0, 4]}
    >
      {!loading && !hasDelegationAccess && (
        <span className={styles.lock} aria-hidden="true">
          <Icon icon="lockClosed" type="outline" color="blue600" size="small" />
        </span>
      )}

      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        marginBottom={2}
        paddingX={[4, 4, 0]}
      >
        <LinkResolver href={InformationPaths.Notifications}>
          <Box
            display="flex"
            alignItems="center"
            columnGap={2}
            overflow="hidden"
          >
            <Icon
              icon="notifications"
              type="outline"
              color="blue400"
              size="medium"
            />
            <Text variant="h4" as="h2" color="blue400" truncate>
              {title ?? formatMessage(m.notifications)}
            </Text>
          </Box>
        </LinkResolver>
        {hasDelegationAccess && (
          <LinkResolver
            href={InformationPaths.Notifications}
            aria-label={formatMessage(m.notificationsViewAll)}
          >
            <Icon
              icon="arrowForward"
              type="filled"
              color="blue400"
              size="medium"
            />
          </LinkResolver>
        )}
      </Box>

      {loading && (
        <Box marginTop={4} paddingX={[4, 4, 0]}>
          <SkeletonLoader
            space={2}
            repeat={4}
            display="block"
            width="full"
            height={56}
          />
        </Box>
      )}

      {!loading && !hasDelegationAccess && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          paddingTop={2}
          rowGap={2}
          paddingX={[4, 4, 0]}
        >
          <Text variant="h4" textAlign="center">
            {formatMessage(m.accessNeeded)}
          </Text>
          <Text textAlign="center" whiteSpace="preLine">
            {formatMessage(m.accessDeniedText)}
          </Text>
          <Box paddingTop={2}>
            <img
              src="./assets/images/jobsGrid.svg"
              alt=""
              className={styles.accessDeniedImage}
            />
          </Box>
        </Box>
      )}

      {!loading && hasDelegationAccess && error && (
        <Problem error={error} size="small" noBorder />
      )}

      {!loading &&
        hasDelegationAccess &&
        !error &&
        notifications.length === 0 && (
          <Problem type="no_data" size="small" noBorder />
        )}

      {!loading &&
        hasDelegationAccess &&
        !error &&
        notifications.map((item) => {
          const href =
            resolveLink(item.message.link) || InformationPaths.Notifications

          const unread = !item.metadata.read
          const content = (
            <Box
              display="flex"
              alignItems="center"
              columnGap={2}
              paddingY={2}
              paddingX={[4, 4, 2]}
              borderTopWidth="standard"
              borderColor="blue200"
              className={unread ? styles.unreadRow : undefined}
            >
              <AvatarImage
                img={item.sender?.logoUrl ?? COAT_OF_ARMS}
                background={unread ? 'white' : 'blue100'}
                imageClass={styles.notificationSenderLogoImage}
              />
              <Box flexGrow={1} overflow="hidden">
                <Box
                  display="flex"
                  justifyContent="spaceBetween"
                  alignItems="center"
                  columnGap={2}
                >
                  <Box overflow="hidden">
                    <Text variant="medium" truncate>
                      {item.message.title}
                    </Text>
                  </Box>
                  {item.metadata.created && (
                    <Box flexShrink={0}>
                      <Text variant="medium" color="dark400">
                        {new Date(item.metadata.created).toLocaleDateString(
                          lang,
                          { day: '2-digit', month: '2-digit', year: 'numeric' },
                        )}
                      </Text>
                    </Box>
                  )}
                </Box>
                {item.message.displayBody && (
                  <Text
                    color="blue400"
                    fontWeight={unread ? 'medium' : 'regular'}
                    truncate
                  >
                    {item.message.displayBody}
                  </Text>
                )}
              </Box>
            </Box>
          )

          return (
            <LinkResolver
              key={item.notificationId}
              href={href}
              className={styles.notificationLink}
              callback={() => handleNotificationClick(item.id)}
            >
              {content}
            </LinkResolver>
          )
        })}
    </Box>
  )
}

export default NotificationsBox
