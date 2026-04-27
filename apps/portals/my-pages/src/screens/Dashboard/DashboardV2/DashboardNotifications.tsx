import {
  Box,
  Icon,
  SkeletonLoader,
  Text,
  VisuallyHidden,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { LinkResolver, m } from '@island.is/portals/my-pages/core'
import {
  COAT_OF_ARMS,
  InformationPaths,
  resolveLink,
  useGetUserNotificationsOverviewQuery,
} from '@island.is/portals/my-pages/information'
import { useUserInfo } from '@island.is/react-spa/bff'
import { Problem } from '@island.is/react-spa/shared'
import { hasNotificationScopes } from '@island.is/auth/scopes'
import { Link } from 'react-router-dom'
import { lock } from '../Dashboard.css'
import * as styles from './DashboardNotifications.css'

export const DashboardNotifications = ({ limit }: { limit: number }) => {
  const { formatMessage, lang } = useLocale()
  const userInfo = useUserInfo()
  const hasDelegationAccess = hasNotificationScopes(userInfo?.scopes)

  const { data, loading, error } = useGetUserNotificationsOverviewQuery({
    variables: {
      input: { limit: limit, before: '', after: '' },
      locale: lang,
    },
    skip: !hasDelegationAccess,
  })

  const notifications = data?.userNotificationsOverview?.data ?? []
  const unreadCount = data?.userNotificationsOverview?.unreadCount ?? 0
  const hasUnread = unreadCount > 0
  const badgeActive: keyof typeof styles.notificationBadge = hasUnread
    ? 'active'
    : 'inactive'

  return (
    <Box
      position="relative"
      borderRadius="large"
      borderWidth="standard"
      borderColor="blue200"
      paddingY={3}
      paddingX={4}
    >
      {!loading && !hasDelegationAccess && (
        <span className={lock} aria-hidden="true">
          <Icon icon="lockClosed" type="outline" color="blue600" size="small" />
        </span>
      )}

      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        marginBottom={2}
      >
        <LinkResolver href={InformationPaths.Notifications}>
          <Box display="flex" alignItems="center" columnGap={1}>
            <Box position="relative" display="flex">
              <Icon
                icon="notifications"
                type="outline"
                color="blue400"
                size="medium"
              />
              <Box
                className={styles.notificationBadge[badgeActive]}
                aria-hidden="true"
              />
              {hasUnread && (
                <VisuallyHidden>
                  {formatMessage(m.notificationsUnread)}
                </VisuallyHidden>
              )}
            </Box>
            <Text variant="h4" as="h2" color="blue400">
              {formatMessage(m.notifications)}
            </Text>
          </Box>
        </LinkResolver>
        {hasDelegationAccess && (
          <span aria-hidden="true">
            <Icon
              icon="arrowForward"
              type="filled"
              color="blue400"
              size="small"
            />
          </span>
        )}
      </Box>

      {loading && (
        <Box marginTop={4}>
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
        <Problem error={error} noBorder />
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
          const href = resolveLink(item.message.link)
          const isExternal = href.startsWith('http')

          const content = (
            <Box
              display="flex"
              alignItems="center"
              columnGap={2}
              paddingY={2}
              borderTopWidth="standard"
              borderColor="blue200"
            >
              <Box className={styles.notificationSenderLogoWrapper}>
                <img
                  src={item.sender?.logoUrl ?? COAT_OF_ARMS}
                  alt=""
                  className={styles.notificationSenderLogoImage}
                />
              </Box>
              <Box flexGrow={1} overflow="hidden">
                <Box
                  display="flex"
                  justifyContent="spaceBetween"
                  alignItems="center"
                  columnGap={2}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    columnGap={1}
                    overflow="hidden"
                  >
                    {!item.metadata.read && (
                      <>
                        <Box className={styles.unreadDot} aria-hidden="true" />
                        <VisuallyHidden>
                          {formatMessage(m.notificationUnread)}
                        </VisuallyHidden>
                      </>
                    )}
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
                  <Text variant="medium" color="blue400" truncate>
                    {item.message.displayBody}
                  </Text>
                )}
              </Box>
            </Box>
          )

          if (!href) return <Box key={item.notificationId}>{content}</Box>

          if (isExternal) {
            return (
              <a
                key={item.notificationId}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${item.message.title} - ${formatMessage(
                  m.notificationOpensInNewTab,
                )}`}
                className={styles.notificationLink}
              >
                {content}
              </a>
            )
          }

          return (
            <Link
              key={item.notificationId}
              to={href}
              className={styles.notificationLink}
            >
              {content}
            </Link>
          )
        })}
    </Box>
  )
}

export default DashboardNotifications
