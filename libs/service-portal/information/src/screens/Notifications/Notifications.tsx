import { useState } from 'react'
import { Box, Button, Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  FootNote,
  IntroHeader,
  m,
  ISLANDIS_SLUG,
} from '@island.is/service-portal/core'

import { useGetUserNotificationsQuery } from './Notifications.generated'

import { spmm } from '../../lib/messages'
import { ActionCard, CardLoader } from '@island.is/service-portal/core'
import { Problem } from '@island.is/react-spa/shared'

const DEFAULT_PAGE_SIZE = 5

const UserNotifications = () => {
  useNamespaces('sp.notifications')
  const { formatMessage } = useLocale()
  const [loadingMore, setLoadingMore] = useState(false)

  const { data, loading, error, fetchMore } = useGetUserNotificationsQuery({
    variables: {
      input: {
        limit: DEFAULT_PAGE_SIZE,
        before: '',
        after: '',
      },
    },
  })

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
    <>
      <IntroHeader
        title={m.myInfo}
        intro={spmm.userInfoDesc}
        serviceProviderSlug={ISLANDIS_SLUG}
        serviceProviderTooltip={formatMessage(m.tjodskraTooltip)}
      />

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
            <ActionCard
              heading={item.message.title}
              text={item.message.body}
              backgroundColor={
                item.metadata.status === 'Unread' ? 'blueberry' : undefined
              }
              cta={{
                label: formatMessage(m.seeDetails),
                variant: 'text',
                url: item.message.link.uri ?? undefined,
                hide: !item.message.link.uri,
              }}
              // image={{
              //   type: 'image',
              //   url: 'https://images.ctfassets.net/8k0h54kbe6bj/3EumKpWqbPFygVWxWteoW/2961b0d9c162e8528e5771ab1707a368/Samgongustofa-stakt-400-400.png',
              // }}
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
        <FootNote serviceProviderSlug={ISLANDIS_SLUG} />
      </Stack>
    </>
  )
}
export default UserNotifications
