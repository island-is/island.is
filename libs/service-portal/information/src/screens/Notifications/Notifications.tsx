import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Column,
  Columns,
  Stack,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  FootNote,
  IntroHeader,
  m,
  ISLANDIS_SLUG,
  LinkButton,
} from '@island.is/service-portal/core'

import {
  useGetUserNotificationsListQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkUserNotificationAsReadMutation,
} from './Notifications.generated'

import { mInformationNotifications } from '../../lib/messages'
import { ActionCard, CardLoader } from '@island.is/service-portal/core'
import { Problem } from '@island.is/react-spa/shared'
import { InformationPaths } from '../../lib/paths'
import { resolveLink } from '../../utils/notificationLinkResolver'

const DEFAULT_PAGE_SIZE = 5

const UserNotifications = () => {
  useNamespaces('sp.information-notifications')
  const { formatMessage, lang } = useLocale()
  const [loadingMore, setLoadingMore] = useState(false)

  const [postMarkAsRead] = useMarkUserNotificationAsReadMutation()
  const [postMarkAllAsRead] = useMarkAllNotificationsAsReadMutation({
    onCompleted: () => {
      refetch()
      toast.success(formatMessage(mInformationNotifications.allMarkedAsRead))
    },
    onError: () => {
      toast.error(formatMessage(m.errorTitle))
    },
  })

  const { data, loading, error, refetch, fetchMore } =
    useGetUserNotificationsListQuery({
      variables: {
        input: {
          limit: DEFAULT_PAGE_SIZE,
          before: '',
          after: '',
        },
        locale: lang,
      },
    })

  useEffect(() => {
    refetch()
  }, [refetch, lang])

  const loadMore = (cursor: string) => {
    if (loadingMore) return
    setLoadingMore(true)
    fetchMore({
      variables: {
        input: {
          limit: DEFAULT_PAGE_SIZE,
          before: '',
          after: cursor,
        },
        locale: lang,
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (
          fetchMoreResult?.userNotificationsList?.data.length &&
          prevResult?.userNotificationsList?.data.length
        ) {
          fetchMoreResult.userNotificationsList.data = [
            ...prevResult.userNotificationsList.data,
            ...fetchMoreResult.userNotificationsList.data,
          ]
          return fetchMoreResult
        }
        return prevResult
      },
    }).finally(() => setLoadingMore(false))
  }

  const noData =
    !data?.userNotificationsList?.data?.length && !loading && !error
  return (
    <>
      <IntroHeader
        title={m.notifications}
        intro={mInformationNotifications.description}
        serviceProviderSlug={ISLANDIS_SLUG}
        serviceProviderTooltip={formatMessage(m.notificationsProfileTooltip)}
      />

      <Box display="flex" marginBottom={3}>
        <Columns space={2}>
          <Column width="content">
            <Button
              colorScheme="default"
              icon="mailOpen"
              iconType="outline"
              size="default"
              type="text"
              as="span"
              variant="utility"
              onClick={() => postMarkAllAsRead()}
            >
              {formatMessage(mInformationNotifications.markAllRead)}
            </Button>
          </Column>
          <Column width="content">
            <LinkButton
              variant="button"
              icon="settings"
              to={InformationPaths.Settings}
              text={formatMessage(m.mySettings)}
            />
          </Column>
        </Columns>
      </Box>

      <Stack space={2}>
        {loading && (
          <>
            <CardLoader />
            <CardLoader />
          </>
        )}
        {error && <Problem noBorder={false} error={error} />}
        {noData && (
          <Problem
            type="no_data"
            noBorder={false}
            imgSrc="./assets/images/empty.svg"
          />
        )}

        {!loading &&
          data?.userNotificationsList?.data.map((item) => (
            <ActionCard
              heading={item.message.title}
              text={item.message.displayBody}
              backgroundColor={item.metadata.read ? undefined : 'blueberry'}
              cta={{
                label: formatMessage(m.seeDetails),
                variant: 'text',
                url: resolveLink(item.message.link),
                hide: !item.message.link.url,
                callback: () =>
                  postMarkAsRead({
                    variables: {
                      id: item.id,
                    },
                  }),
              }}
              image={
                item.sender?.logoUrl
                  ? {
                      type: 'circle',
                      url: item.sender.logoUrl,
                      active: !item.metadata.read,
                    }
                  : undefined
              }
              key={item.notificationId}
            />
          ))}
        {loadingMore && <CardLoader />}
        {data?.userNotificationsList?.pageInfo.hasNextPage ? (
          <Box
            display="flex"
            alignItems="center"
            marginTop={1}
            justifyContent="center"
          >
            <Button
              onClick={() =>
                loadMore(data?.userNotificationsList?.pageInfo.endCursor ?? '')
              }
              variant="ghost"
              size="small"
            >
              {`${formatMessage(m.fetchMore)} ${
                data?.userNotificationsList?.data?.length ?? 0
              }/${data?.userNotificationsList?.totalCount ?? 1}`}
            </Button>
          </Box>
        ) : undefined}
        <FootNote serviceProviderSlug={ISLANDIS_SLUG} />
      </Stack>
    </>
  )
}
export default UserNotifications
