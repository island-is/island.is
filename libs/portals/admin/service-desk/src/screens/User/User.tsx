import format from 'date-fns/format'
import { useLoaderData, useNavigate, useRevalidator } from 'react-router-dom'

import {
  ActionCard,
  Box,
  Stack,
  Text,
  Table as T,
  LoadingDots,
  SkeletonLoader,
  Tabs,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { BackButton } from '@island.is/portals/admin/core'
import { IntroHeader, formatNationalId } from '@island.is/portals/core'
import { dateFormat } from '@island.is/shared/constants'
import InfiniteScroll from 'react-infinite-scroller'

import { m } from '../../lib/messages'
import {
  GetAdminNotificationsQuery,
  GetAdminActorNotificationsQuery,
  useUpdateUserProfileMutation,
  useGetAdminActorNotificationsQuery,
} from './User.generated'
import { UpdateUserProfileInput } from '@island.is/api/schema'
import React from 'react'
import { isValidDate } from '@island.is/shared/utils'
import { useGetAdminNotificationsQuery } from './User.generated'
import { UserProfileResult } from './User.loader'
import { Problem } from '@island.is/react-spa/shared'

const DEFAULT_PAGE_SIZE = 10

const User = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const user = useLoaderData() as UserProfileResult
  const formattedNationalId = formatNationalId(user.nationalId)
  const [updateProfile] = useUpdateUserProfileMutation()
  const { revalidate } = useRevalidator()

  const {
    data: notifications,
    loading,
    error,
    fetchMore,
  } = useGetAdminNotificationsQuery({
    variables: {
      nationalId: user.nationalId,
      input: { limit: DEFAULT_PAGE_SIZE },
    },
  })

  const {
    data: actorNotifications,
    loading: actorLoading,
    error: actorError,
    fetchMore: actorFetchMore,
  } = useGetAdminActorNotificationsQuery({
    variables: {
      nationalId: user.nationalId,
      input: { limit: DEFAULT_PAGE_SIZE },
    },
  })

  const handleUpdateProfile = async (input: UpdateUserProfileInput) => {
    try {
      const updatedProfile = await updateProfile({
        variables: {
          nationalId: user.nationalId,
          input,
        },
      })

      if (updatedProfile.data) {
        revalidate()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const loadMore = async () => {
    if (
      loading ||
      !notifications ||
      !notifications?.adminNotifications?.pageInfo.hasNextPage
    ) {
      return
    }

    await fetchMore({
      variables: {
        nationalId: user.nationalId,
        input: {
          limit: DEFAULT_PAGE_SIZE,
          after:
            notifications?.adminNotifications?.pageInfo.endCursor ?? undefined,
        },
      },
      updateQuery: (prev, { fetchMoreResult }): GetAdminNotificationsQuery => {
        return {
          adminNotifications: {
            ...fetchMoreResult.adminNotifications,
            data: [
              ...(prev.adminNotifications?.data || []),
              ...(fetchMoreResult.adminNotifications?.data || []),
            ],
          } as GetAdminNotificationsQuery['adminNotifications'],
        }
      },
    })
  }

  const loadMoreActorNotifications = async () => {
    if (
      actorLoading ||
      !actorNotifications ||
      !actorNotifications?.adminActorNotifications?.pageInfo.hasNextPage
    ) {
      return
    }

    await actorFetchMore({
      variables: {
        nationalId: user.nationalId,
        input: {
          limit: DEFAULT_PAGE_SIZE,
          after:
            actorNotifications?.adminActorNotifications?.pageInfo.endCursor ??
            undefined,
        },
      },
      updateQuery: (
        prev,
        { fetchMoreResult },
      ): GetAdminActorNotificationsQuery => {
        return {
          adminActorNotifications: {
            ...fetchMoreResult.adminActorNotifications,
            data: [
              ...(prev.adminActorNotifications?.data || []),
              ...(fetchMoreResult.adminActorNotifications?.data || []),
            ],
          } as GetAdminActorNotificationsQuery['adminActorNotifications'],
        }
      },
    })
  }

  return (
    <Stack space={'containerGutter'}>
      <BackButton
        onClick={() => {
          navigate(-1)
        }}
      />
      <div>
        <div>
          <IntroHeader
            title={user.fullName ?? formattedNationalId}
            intro={formattedNationalId}
          />
        </div>
        <Box display="flex" width="full" columnGap="smallGutter">
          <Box
            display="flex"
            flexDirection="column"
            rowGap="smallGutter"
            columnGap="gutter"
            width="full"
          >
            {[
              {
                textKey: m.documentNotification,
                value: user.documentNotifications ? m.yes : m.no,
              },
              {
                textKey: m.emailNotification,
                value: user.emailNotifications ? m.yes : m.no,
              },
              {
                textKey: m.language,
                value: user.locale === 'en' ? m.english : m.icelandic,
              },
            ].map(({ textKey, value }) => (
              <Box display="flex" columnGap="smallGutter" key={textKey.id}>
                <Text fontWeight="medium">{formatMessage(textKey)}: </Text>
                <Text>{formatMessage(value)}</Text>
              </Box>
            ))}
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            width="full"
            rowGap="smallGutter"
            columnGap="smallGutter"
          >
            {[
              {
                textKey: m.lastNudge,
                value: user.lastNudge,
              },
              {
                textKey: m.nextNudge,
                value: user.nextNudge,
              },
            ].map(({ textKey, value }) => (
              <Box display="flex" columnGap="smallGutter" key={textKey.id}>
                <Text fontWeight="medium">{formatMessage(textKey)}: </Text>
                <Text>{format(new Date(value as string), dateFormat.is)}</Text>
              </Box>
            ))}
          </Box>
        </Box>
      </div>
      <Stack space="gutter">
        <Text variant="h4">{formatMessage(m.info)}</Text>
        <Box
          rowGap="gutter"
          columnGap="gutter"
          display="flex"
          flexDirection={['column', 'row', 'row']}
          width="full"
        >
          <Box width="full">
            <ActionCard
              heading={formatMessage(m.email)}
              text={user.email ?? ''}
              cta={
                !user.email || user.emailVerified
                  ? undefined
                  : {
                      label: formatMessage(m.delete),
                      buttonType: {
                        variant: 'text',
                        colorScheme: 'destructive',
                      },
                      size: 'small',
                      icon: 'trash',
                      onClick: () => handleUpdateProfile({ email: '' }),
                    }
              }
              tag={{
                label: formatMessage(
                  !user.email
                    ? m.noEmail
                    : user.emailVerified
                    ? m.verified
                    : m.unverified,
                ),
                variant: 'blue',
                outlined: true,
              }}
            />
          </Box>
          <Box width="full">
            <ActionCard
              heading={formatMessage(m.phone)}
              text={user.mobilePhoneNumber ?? ''}
              cta={
                !user.mobilePhoneNumber || user.mobilePhoneNumberVerified
                  ? undefined
                  : {
                      label: formatMessage(m.delete),
                      buttonType: {
                        variant: 'text',
                        colorScheme: 'destructive',
                      },
                      size: 'small',
                      icon: 'trash',
                      onClick: () =>
                        handleUpdateProfile({ mobilePhoneNumber: '' }),
                    }
              }
              tag={{
                label: formatMessage(
                  !user.mobilePhoneNumber
                    ? m.noMobilePhone
                    : user.mobilePhoneNumberVerified
                    ? m.verified
                    : m.unverified,
                ),
                variant: 'blue',
                outlined: true,
              }}
            />
          </Box>
        </Box>
      </Stack>
      <Stack space="gutter">
        <Text variant="h4">{formatMessage(m.notifications)}</Text>
        <Tabs
          label="Notifications"
          selected="user-notifications"
          onlyRenderSelectedTab
          contentBackground="white"
          tabs={[
            {
              id: 'user-notifications',
              label: formatMessage(m.userNotifications),
              content: (
                <Box paddingTop={4}>
                  {error ? (
                    <Problem error={error} />
                  ) : loading ? (
                    <SkeletonLoader height={40} repeat={6} width={'100%'} />
                  ) : (
                    <InfiniteScroll
                      pageStart={0}
                      loadMore={loadMore}
                      hasMore={
                        notifications?.adminNotifications?.pageInfo.hasNextPage
                      }
                      loader={
                        <Box
                          key={'user.screens.notifications.loader'}
                          marginTop={'gutter'}
                          display={'flex'}
                          justifyContent={'center'}
                        >
                          <LoadingDots />
                        </Box>
                      }
                    >
                      <T.Table>
                        <T.Head>
                          <T.Row>
                            <T.HeadData>ID</T.HeadData>
                            <T.HeadData>Sent</T.HeadData>
                            <T.HeadData>Message ID</T.HeadData>
                            <T.HeadData>Sender</T.HeadData>
                            <T.HeadData>Scope</T.HeadData>
                          </T.Row>
                        </T.Head>
                        <T.Body>
                          {notifications?.adminNotifications?.data.map(
                            (notification, index) => (
                              <T.Row key={index}>
                                <T.Data>{notification.id}</T.Data>
                                <T.Data>
                                  {notification.sent &&
                                  isValidDate(new Date(notification.sent))
                                    ? format(
                                        new Date(notification.sent),
                                        'dd.MM.yyyy',
                                      )
                                    : ''}
                                </T.Data>
                                <T.Data>{notification.notificationId}</T.Data>
                                <T.Data>
                                  {notification.sender.title ||
                                    notification.sender.id}
                                </T.Data>
                                <T.Data>{notification.scope}</T.Data>
                              </T.Row>
                            ),
                          )}
                        </T.Body>
                      </T.Table>
                    </InfiniteScroll>
                  )}
                </Box>
              ),
            },
            {
              id: 'actor-notifications',
              label: formatMessage(m.actorNotifications),
              content: (
                <Box paddingTop={4}>
                  {actorError ? (
                    <Problem error={actorError} />
                  ) : actorLoading ? (
                    <SkeletonLoader height={40} repeat={6} width={'100%'} />
                  ) : (
                    <InfiniteScroll
                      pageStart={0}
                      loadMore={loadMoreActorNotifications}
                      hasMore={
                        actorNotifications?.adminActorNotifications?.pageInfo
                          .hasNextPage
                      }
                      loader={
                        <Box
                          key={'user.screens.actor-notifications.loader'}
                          marginTop={'gutter'}
                          display={'flex'}
                          justifyContent={'center'}
                        >
                          <LoadingDots />
                        </Box>
                      }
                    >
                      <T.Table>
                        <T.Head>
                          <T.Row>
                            <T.HeadData>ID</T.HeadData>
                            <T.HeadData>Sent</T.HeadData>
                            <T.HeadData>Message ID</T.HeadData>
                            <T.HeadData style={{ whiteSpace: 'nowrap' }}>
                              On Behalf Of
                            </T.HeadData>
                            <T.HeadData>Scope</T.HeadData>
                          </T.Row>
                        </T.Head>
                        <T.Body>
                          {actorNotifications?.adminActorNotifications?.data.map(
                            (notification, index) => (
                              <T.Row key={index}>
                                <T.Data>{notification.id}</T.Data>
                                <T.Data>
                                  {notification.created &&
                                  isValidDate(new Date(notification.created))
                                    ? format(
                                        new Date(notification.created),
                                        'dd.MM.yyyy',
                                      )
                                    : ''}
                                </T.Data>
                                <T.Data>{notification.messageId}</T.Data>
                                <T.Data>
                                  {notification.onBehalfOfNationalId?.nationalId
                                    ? formatNationalId(
                                        notification.onBehalfOfNationalId
                                          .nationalId,
                                      )
                                    : ''}
                                </T.Data>
                                <T.Data>{notification.scope}</T.Data>
                              </T.Row>
                            ),
                          )}
                        </T.Body>
                      </T.Table>
                    </InfiniteScroll>
                  )}
                </Box>
              ),
            },
          ]}
        />
      </Stack>
    </Stack>
  )
}

export default User
