import {
  Box,
  Icon,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { LinkResolver, m } from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import {
  COAT_OF_ARMS,
  InformationPaths,
  resolveLink,
  useGetUserNotificationsOverviewQuery,
} from '@island.is/portals/my-pages/information'
import { Link } from 'react-router-dom'

export const NotificationsPreview = ({ limit }: { limit: number }) => {
  const { formatMessage, lang } = useLocale()

  const { data, loading, error } = useGetUserNotificationsOverviewQuery({
    variables: {
      input: { limit: limit, before: '', after: '' },
      locale: lang,
    },
  })

  const notifications = data?.userNotificationsOverview?.data ?? []

  return (
    <Box
      borderRadius="large"
      borderWidth="standard"
      borderColor="blue200"
      paddingY={3}
      paddingX={4}
    >
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        marginBottom={2}
      >
        <Box display="flex" alignItems="center" columnGap={1}>
          <Icon
            icon="notifications"
            type="outline"
            color="blue400"
            size="medium"
          />
          <Text variant="h4" as="h2" color="blue400">
            {formatMessage(m.notifications)}
          </Text>
        </Box>
        <LinkResolver
          href={InformationPaths.Notifications}
          aria-label={formatMessage(m.notificationsViewAll)}
        >
          <Icon
            icon="arrowForward"
            type="filled"
            color="blue400"
            size="small"
          />
        </LinkResolver>
      </Box>

      {error && <Problem error={error} noBorder={false} />}

      {loading && (
        <Stack space={2}>
          <SkeletonLoader
            height={56}
            width="full"
            display="block"
            repeat={3}
            space={2}
          />
        </Stack>
      )}

      {!loading && notifications.length === 0 && (
        <Text color="dark300">{formatMessage(m.noDataFound)}</Text>
      )}

      {!loading &&
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
              <Box
                flexShrink={0}
                borderRadius="full"
                background="blue100"
                display="flex"
                alignItems="center"
                justifyContent="center"
                style={{ width: 40, height: 40 }}
              >
                <img
                  src={item.sender?.logoUrl ?? COAT_OF_ARMS}
                  alt=""
                  style={{ width: 24, height: 24, objectFit: 'contain' }}
                />
              </Box>
              <Box flexGrow={1} overflow="hidden">
                <Box
                  display="flex"
                  justifyContent="spaceBetween"
                  alignItems="center"
                  columnGap={2}
                >
                  <Text variant="medium" truncate>
                    {item.message.title}
                  </Text>
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
                style={{ display: 'block', textDecoration: 'none' }}
              >
                {content}
              </a>
            )
          }

          return (
            <Link
              key={item.notificationId}
              to={href}
              style={{ display: 'block', textDecoration: 'none' }}
            >
              {content}
            </Link>
          )
        })}
    </Box>
  )
}

export default NotificationsPreview
