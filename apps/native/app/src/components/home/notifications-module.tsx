import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Image, View, TouchableOpacity } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { ApolloError } from '@apollo/client'

import {
  Typography,
  Heading,
  ChevronRight,
  ListItemSkeleton,
  EmptyCard,
  NotificationCard,
} from '@/ui'
import emptyIllustrationSrc from '@/assets/illustrations/le-company-s3.png'
import { router } from 'expo-router'
import {
  GetUserNotificationsQuery,
  Notification,
  useGetUserNotificationsQuery,
  useMarkUserNotificationAsReadMutation,
} from '@/graphql/types/schema'
import { navigateToUniversalLink } from '@/lib/deep-linking'
import { useBrowser } from '@/hooks/use-browser'

const Host = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`

const EmptyWrapper = styled.View`
  margin-horizontal: ${({ theme }) => theme.spacing[2]}px;
`

const FALLBACK_ICON_URL =
  'https://images.ctfassets.net/8k0h54kbe6bj/6XhCz5Ss17OVLxpXNVDxAO/d3d6716bdb9ecdc5041e6baf68b92ba6/coat_of_arms.svg'

const HOME_NOTIFICATIONS_LIMIT = 3

interface NotificationsModuleProps {
  data: GetUserNotificationsQuery | undefined
  loading: boolean
  error?: ApolloError | undefined
}

const validateNotificationsInitialData = ({
  data,
  loading,
}: {
  data: GetUserNotificationsQuery | undefined
  loading: boolean
}) => {
  if (loading) {
    return true
  }

  if (data?.userNotifications?.data?.length) {
    return true
  }

  return false
}

const NotificationsModule = React.memo(
  ({ data, loading, error }: NotificationsModuleProps) => {
    const theme = useTheme()
    const intl = useIntl()
    const [markUserNotificationAsRead] = useMarkUserNotificationAsReadMutation()
    const { openBrowser } = useBrowser()

    if (error && !data) {
      return null
    }

    const notifications = (data?.userNotifications?.data ?? []).slice(
      0,
      HOME_NOTIFICATIONS_LIMIT,
    )

    const onNotificationPress = (notification: Notification) => {
      void markUserNotificationAsRead({
        variables: { id: notification.id },
      }).catch(() => {
        // ignore mark-as-read failures; navigation should still proceed
      })
      navigateToUniversalLink({
        link: notification.message?.link?.url,
        fromScreen: '/notifications',
        openBrowser,
      })
    }

    return (
      <View style={{ marginTop: theme.spacing[2] }}>
        <Host>
          <TouchableOpacity
            disabled={!notifications.length}
            onPress={() => router.navigate('/notifications')}
            style={{ marginHorizontal: theme.spacing[2] }}
          >
            <Heading
              button={
                notifications.length === 0 ? null : (
                  <TouchableOpacity
                    onPress={() => router.navigate('/notifications')}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="heading5" color={theme.color.blue400}>
                      <FormattedMessage id="button.seeAll" />
                    </Typography>
                    <ChevronRight />
                  </TouchableOpacity>
                )
              }
            >
              <FormattedMessage id="homeOptions.notifications" />
            </Heading>
          </TouchableOpacity>
          {loading && !data ? (
            Array.from({ length: HOME_NOTIFICATIONS_LIMIT })
              .map((_, id) => ({ id: String(id) }))
              .map((item) => (
                <ListItemSkeleton key={item.id} multilineMessage />
              ))
          ) : notifications.length === 0 ? (
            <EmptyWrapper>
              <EmptyCard
                text={intl.formatMessage({
                  id: 'notifications.emptyListTitle',
                })}
                image={
                  <Image
                    source={emptyIllustrationSrc}
                    resizeMode="contain"
                    style={{ height: 72, width: 55 }}
                  />
                }
                link={null}
              />
            </EmptyWrapper>
          ) : (
            notifications.map((item) => (
              <NotificationCard
                key={item.id}
                id={item.id}
                title={item.message.title}
                message={item.message.displayBody}
                date={new Date(item.metadata.sent)}
                icon={{
                  uri: `${
                    item.sender.logoUrl ?? FALLBACK_ICON_URL
                  }?w=64&h=64&fit=pad&fm=png`,
                }}
                unread={!item.metadata.read}
                onPress={() => onNotificationPress(item)}
              />
            ))
          )}
        </Host>
      </View>
    )
  },
)

export {
  NotificationsModule,
  useGetUserNotificationsQuery,
  validateNotificationsInitialData,
}
