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
  ActionCard,
  IntroWrapper,
  ISLANDIS_SLUG,
  LinkButton,
  m,
} from '@island.is/portals/my-pages/core'
import { useEffect, useState } from 'react'

import {
  useGetUserNotificationsListQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkUserNotificationAsReadMutation,
} from './Notifications.generated'

import { CardLoader } from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { mInformationNotifications } from '../../lib/messages'
import { InformationPaths } from '../../lib/paths'
import { COAT_OF_ARMS, resolveLink } from '../../utils/notificationLinkResolver'
import { useUserInfo } from '@island.is/react-spa/bff'

const DEFAULT_PAGE_SIZE = 5

const UserNotifications = () => {
  useNamespaces('sp.information-notifications')
  const { formatMessage, lang } = useLocale()
  const [loadingMore, setLoadingMore] = useState(false)
  const userInfo = useUserInfo()
  const isCompany = userInfo.profile?.subjectType === 'legalEntity'

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
          fetchMoreResult?.userNotifications?.data.length &&
          prevResult?.userNotifications?.data.length
        ) {
          fetchMoreResult.userNotifications.data = [
            ...prevResult.userNotifications.data,
            ...fetchMoreResult.userNotifications.data,
          ]
          return fetchMoreResult
        }
        return prevResult
      },
    }).finally(() => setLoadingMore(false))
  }

  const noData = !data?.userNotifications?.data?.length && !loading && !error
  return (
    <IntroWrapper
      title={m.notifications}
      intro={mInformationNotifications.description}
      serviceProviderSlug={ISLANDIS_SLUG}
      serviceProviderTooltip={formatMessage(m.notificationsProfileTooltip)}
    >
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
          {!isCompany ? (
            <Column width="content">
              <LinkButton
                variant="utility"
                icon="settings"
                to={InformationPaths.Settings}
                text={formatMessage(m.mySettings)}
              />
            </Column>
          ) : null}
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
          data?.userNotifications?.data.map((item) => (
            //TODO: Replace with Island UI Card when it supports images
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
              image={{
                type: 'circle',
                url: item.sender?.logoUrl ?? COAT_OF_ARMS,
                active: !item.metadata.read,
              }}
              key={item.notificationId}
            />
          ))}
        {loadingMore && <CardLoader />}
        {data?.userNotifications?.pageInfo.hasNextPage ? (
          <Box
            display="flex"
            alignItems="center"
            marginTop={1}
            justifyContent="center"
          >
            <Button
              onClick={() =>
                loadMore(data?.userNotifications?.pageInfo.endCursor ?? '')
              }
              variant="ghost"
              size="small"
            >
              {`${formatMessage(m.fetchMore)} ${
                data?.userNotifications?.data?.length ?? 0
              }/${data?.userNotifications?.totalCount ?? 1}`}
            </Button>
          </Box>
        ) : undefined}
      </Stack>
    </IntroWrapper>
  )
}
export default UserNotifications
