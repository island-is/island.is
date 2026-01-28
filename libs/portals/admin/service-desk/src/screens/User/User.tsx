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
  Tag,
  Inline,
  Button,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { BackButton } from '@island.is/portals/admin/core'
import {
  IntroHeader,
  formatNationalId,
  m as coreMessages,
} from '@island.is/portals/core'
import { dateFormat } from '@island.is/shared/constants'
import InfiniteScroll from 'react-infinite-scroller'

import { m } from '../../lib/messages'
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal'
import {
  GetAdminNotificationsQuery,
  GetAdminActorNotificationsQuery,
  useUpdateUserProfileMutation,
  useGetAdminActorNotificationsQuery,
  useDeleteUserEmailMutation,
} from './User.generated'
import { UpdateUserProfileInput } from '@island.is/api/schema'
import React, { useState } from 'react'
import { isValidDate } from '@island.is/shared/utils'
import { useGetAdminNotificationsQuery } from './User.generated'
import { UserProfileResult } from './User.loader'
import { Problem } from '@island.is/react-spa/shared'
import { DataStatus } from '@island.is/api/schema'

const DEFAULT_PAGE_SIZE = 10

const User = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const user = useLoaderData() as UserProfileResult
  const formattedNationalId = formatNationalId(user.nationalId)
  const [updateProfile] = useUpdateUserProfileMutation()
  const [deleteEmail] = useDeleteUserEmailMutation()
  const { revalidate } = useRevalidator()
  const [isDeleteEmailModalVisible, setIsDeleteEmailModalVisible] =
    useState(false)
  const [emailToDelete, setEmailToDelete] = useState<{
    id: string
    email: string | null
  } | null>(null)

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

  const handleDeleteEmail = async () => {
    if (!emailToDelete) return

    setIsDeleteEmailModalVisible(false)
    try {
      await deleteEmail({
        variables: {
          nationalId: user.nationalId,
          emailId: emailToDelete.id,
        },
      })
      setEmailToDelete(null)
      revalidate()
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
        <Stack space={2}>
          <Box
            rowGap="gutter"
            columnGap="gutter"
            display="flex"
            flexDirection={['column', 'row', 'row']}
            width="full"
          >
            <Box width="full">
              <ActionCard
                heading={formatMessage(m.phone)}
                text={user.mobilePhoneNumber ?? ''}
                cta={
                  !user.mobilePhoneNumber || user.mobilePhoneNumberVerified
                    ? undefined
                    : {
                        label: formatMessage(coreMessages.buttonDestroy),
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
            <Box width="full">
              {(() => {
                const primaryEmail = user.emails?.find((e) => e.primary)

                if (!user.emails || user.emails.length === 0) {
                  return (
                    <ActionCard
                      heading={formatMessage(m.email)}
                      text={formatMessage(m.noEmail)}
                      tag={{
                        label: formatMessage(m.noEmail),
                        variant: 'blue',
                        outlined: true,
                      }}
                    />
                  )
                }

                const getTagForEmail = (email: typeof user.emails[0]) => {
                  if (email.emailStatus === DataStatus.NOT_VERIFIED) {
                    return {
                      label: formatMessage(m.unverified),
                      variant: 'yellow' as const,
                    }
                  } else if (email.emailStatus === DataStatus.VERIFIED) {
                    return {
                      label: formatMessage(m.verified),
                      variant: 'blue' as const,
                    }
                  }
                  return undefined
                }

                return primaryEmail ? (
                  <ActionCard
                    heading={formatMessage(m.primaryEmail)}
                    text={primaryEmail.email ?? formatMessage(m.noEmail)}
                    cta={{
                      label: formatMessage(coreMessages.buttonDestroy),
                      buttonType: {
                        variant: 'text',
                        colorScheme: 'destructive',
                      },
                      size: 'small',
                      icon: 'trash',
                      onClick: () => {
                        setEmailToDelete({
                          id: primaryEmail.id,
                          email: primaryEmail.email ?? null,
                        })
                        setIsDeleteEmailModalVisible(true)
                      },
                    }}
                    tag={getTagForEmail(primaryEmail)}
                  />
                ) : null
              })()}
            </Box>
          </Box>
          <Box width="full">
            <Stack space={2}>
              {(() => {
                const otherEmails = user.emails?.filter((e) => !e.primary) ?? []

                if (!user.emails || user.emails.length <= 1) {
                  return null
                }

                return user.emails &&
                  user.emails.length > 1 &&
                  otherEmails.length > 0 ? (
                  <Box
                    borderColor="blue200"
                    borderWidth="standard"
                    borderRadius="large"
                    padding={3}
                    width="full"
                  >
                    <Stack space={2}>
                      <Text variant="h5">{formatMessage(m.otherEmails)}</Text>
                      {otherEmails.map((email) => {
                        const tags: Array<{
                          label: string
                          variant: 'blue' | 'mint' | 'yellow'
                        }> = []

                        if (email.emailStatus === DataStatus.NOT_VERIFIED) {
                          tags.push({
                            label: formatMessage(m.unverified),
                            variant: 'yellow',
                          })
                        } else if (email.emailStatus === DataStatus.VERIFIED) {
                          tags.push({
                            label: formatMessage(m.verified),
                            variant: 'blue',
                          })
                        }

                        if (email.isConnectedToActorProfile) {
                          tags.push({
                            label: formatMessage(m.connectedToDelegation),
                            variant: 'blue',
                          })
                        }

                        return (
                          <Box
                            key={email.id}
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="spaceBetween"
                            paddingY={2}
                            borderBottomWidth={
                              otherEmails.indexOf(email) <
                              otherEmails.length - 1
                                ? 'standard'
                                : undefined
                            }
                            borderColor="blue200"
                          >
                            <Box
                              display="flex"
                              flexDirection="row"
                              alignItems="center"
                              columnGap={2}
                              flexWrap="wrap"
                              rowGap={1}
                            >
                              <Text variant="default" color="dark400">
                                {email.email ?? formatMessage(m.noEmail)}
                              </Text>
                              {tags.length > 0 && (
                                <Inline space={1}>
                                  {tags.map((tag, index) => (
                                    <Tag
                                      key={index}
                                      variant={tag.variant}
                                      outlined
                                    >
                                      {tag.label}
                                    </Tag>
                                  ))}
                                </Inline>
                              )}
                            </Box>
                            <Button
                              variant="text"
                              colorScheme="destructive"
                              size="small"
                              icon="trash"
                              onClick={() => {
                                setEmailToDelete({
                                  id: email.id,
                                  email: email.email ?? null,
                                })
                                setIsDeleteEmailModalVisible(true)
                              }}
                            >
                              {formatMessage(coreMessages.buttonDestroy)}
                            </Button>
                          </Box>
                        )
                      })}
                    </Stack>
                  </Box>
                ) : null
              })()}
            </Stack>
          </Box>
        </Stack>
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
      <ConfirmModal
        isVisible={isDeleteEmailModalVisible}
        onConfirm={handleDeleteEmail}
        onVisibilityChange={(visibility) => {
          setIsDeleteEmailModalVisible(visibility)
          if (!visibility) {
            setEmailToDelete(null)
          }
        }}
        title={formatMessage(m.deleteEmailConfirmTitle)}
        message={formatMessage(m.deleteEmailConfirmMessage, {
          email: emailToDelete?.email ?? '',
        })}
        confirmMessage={formatMessage(coreMessages.buttonDestroy)}
      />
    </Stack>
  )
}

export default User
