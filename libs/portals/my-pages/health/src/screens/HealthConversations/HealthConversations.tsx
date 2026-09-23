import {
  Box,
  Button,
  Checkbox,
  Filter,
  Icon,
  Input,
  Stack,
  Text,
  VisuallyHidden,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  LinkButton,
  IntroWrapper,
  formatDate,
  m,
} from '@island.is/portals/my-pages/core'
import { MessageActions } from './components/MessageActions'
import { Problem } from '@island.is/react-spa/shared'
import { debounceTime } from '@island.is/shared/constants'
import debounce from 'lodash/debounce'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ConversationAvatar from './components/ConversationAvatar'
import * as styles from './HealthConversations.css'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { ApolloCache } from '@apollo/client'
import { HealthDirectorateHealthConversationStatusFilter } from '@island.is/api/schema'
import {
  GetHealthConversationsDocument,
  GetHealthConversationsQuery,
  GetHealthConversationsQueryVariables,
  useGetHealthConversationsQuery,
  useStarHealthConversationMutation,
  useUnstarHealthConversationMutation,
  useArchiveHealthConversationMutation,
  useUnarchiveHealthConversationMutation,
} from './HealthConversations.generated'

const DEFAULT_PAGE_SIZE = 20

const updateConversation = (
  cache: ApolloCache<unknown>,
  id: string,
  fields: Partial<Pick<Conversation, 'isStarred' | 'isArchived'>>,
) => {
  cache.modify({
    id: cache.identify({
      __typename: 'HealthDirectorateHealthConversation',
      id,
    }),
    fields: Object.fromEntries(
      Object.entries(fields).map(([key, value]) => [key, () => value]),
    ),
  })
}

// Drops the row from the list currently on screen and adjusts its total.
// Other cached filter variants (other tabs, the overview box) are left
// untouched; they are replaced by page one from the network when shown.
const removeConversationFromList = (
  cache: ApolloCache<unknown>,
  id: string,
  variables: GetHealthConversationsQueryVariables,
) => {
  cache.updateQuery(
    { query: GetHealthConversationsDocument, variables },
    (existing: GetHealthConversationsQuery | null) => {
      const page = existing?.healthDirectoratePaginatedHealthConversations
      if (!page) return existing
      const data = page.data.filter((item) => item.id !== id)
      if (data.length === page.data.length) return existing
      return {
        ...existing,
        healthDirectoratePaginatedHealthConversations: {
          ...page,
          data,
          totalCount: page.totalCount - 1,
        },
      }
    },
  )
}

const defaultFilterValues = {
  searchQuery: '',
  starred: false,
  archived: false,
}

type Conversation = NonNullable<
  GetHealthConversationsQuery['healthDirectoratePaginatedHealthConversations']
>['data'][number]

type FilterValues = {
  searchQuery: string
  starred: boolean
  archived: boolean
}

const HealthConversations = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  const [filterValues, setFilterValues] =
    useState<FilterValues>(defaultFilterValues)
  const [searchInput, setSearchInput] = useState('')

  const [loadingMore, setLoadingMore] = useState(false)

  const filterInput = useMemo(() => {
    const search = filterValues.searchQuery.trim()
    return {
      ...(filterValues.archived
        ? {
            status: HealthDirectorateHealthConversationStatusFilter.ARCHIVED,
          }
        : {}),
      ...(filterValues.starred ? { starred: true } : {}),
      ...(search ? { search } : {}),
    }
  }, [filterValues])

  const listVariables = useMemo(
    () => ({ input: { ...filterInput, limit: DEFAULT_PAGE_SIZE } }),
    [filterInput],
  )

  const { data, loading, error, fetchMore } = useGetHealthConversationsQuery({
    fetchPolicy: 'cache-and-network',
    variables: listVariables,
  })

  const conversationsPage = data?.healthDirectoratePaginatedHealthConversations
  const healthConversations = conversationsPage?.data ?? []

  const initialLoading = loading && !data
  const activeSearch = filterValues.searchQuery.trim()

  const loadMore = () => {
    const cursor = conversationsPage?.pageInfo.endCursor
    if (loadingMore || !cursor) return
    setLoadingMore(true)
    // The field's cache policy appends the page to the current list
    fetchMore({
      variables: { input: { ...listVariables.input, after: cursor } },
    })
      .catch(() => toast.error(formatMessage(m.errorTitle)))
      .finally(() => setLoadingMore(false))
  }

  const debouncedSetSearchQuery = useMemo(
    () =>
      debounce((value: string) => {
        setFilterValues((prev) => ({
          ...prev,
          searchQuery: value,
        }))
      }, debounceTime.search),
    [],
  )

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    debouncedSetSearchQuery(value)
  }

  useEffect(() => {
    return () => {
      debouncedSetSearchQuery.cancel()
    }
  }, [debouncedSetSearchQuery])

  const onMutationError = () => toast.error(formatMessage(m.errorTitle))

  // Update the cached rows in place instead of refetching, so loaded pages
  // stay put. Rows that no longer match the current filter are dropped.
  const [starMessage] = useStarHealthConversationMutation({
    onError: onMutationError,
  })
  const [unstarMessage] = useUnstarHealthConversationMutation({
    onError: onMutationError,
  })
  const [archiveMessage] = useArchiveHealthConversationMutation({
    onError: onMutationError,
  })
  const [unarchiveMessage] = useUnarchiveHealthConversationMutation({
    onError: onMutationError,
  })

  const toggleStar = (id: string, isStarred: boolean) => {
    const mutate = isStarred ? unstarMessage : starMessage
    mutate({
      variables: { input: { id } },
      update: (cache) => {
        updateConversation(cache, id, { isStarred: !isStarred })
        // Only the starred-filtered view stops matching when unstarring.
        if (isStarred && filterValues.starred) {
          removeConversationFromList(cache, id, listVariables)
        }
      },
    })
  }

  const toggleArchive = (id: string, isArchived: boolean) => {
    const mutate = isArchived ? unarchiveMessage : archiveMessage
    mutate({
      variables: { input: { id } },
      update: (cache) => {
        updateConversation(cache, id, { isArchived: !isArchived })
        // The current view stops matching only when the toggle moves the
        // item across the boundary this view filters on: unarchiving out
        // of the archived view, or archiving out of the default view.
        if (isArchived === filterValues.archived) {
          removeConversationFromList(cache, id, listVariables)
        }
      },
    })
  }

  const filterCount =
    (filterValues.starred ? 1 : 0) + (filterValues.archived ? 1 : 0)

  return (
    <IntroWrapper
      title={m.messages}
      intro={messages.healthConversationsIntro}
      desktopContentSpan="10/12"
    >
      <Box
        display={['inlineFlex', 'inlineFlex', 'inlineFlex', 'none']}
        marginBottom={3}
      >
        <LinkButton
          to={HealthPaths.HealthConversationsNew}
          text={formatMessage(messages.healthConversationsCreate)}
          variant="primary"
          size="small"
        />
      </Box>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        marginBottom={3}
      >
        <Box style={{ minWidth: 0 }}>
          <Filter
            labelClearAll={formatMessage(m.clearAllFilters)}
            labelClear={formatMessage(m.clearFilter)}
            labelOpen={formatMessage(m.openFilter)}
            reverse
            variant="popover"
            align="left"
            mobileWrap={false}
            filterCount={filterCount}
            filterInput={
              <Input
                name="messageSearch"
                placeholder={formatMessage(
                  messages.healthConversationsSearchPlaceholder,
                )}
                value={searchInput}
                // Matches the API's limit on `search`
                maxLength={100}
                onChange={(e) => handleSearchChange(e.target.value)}
                icon={{ type: 'outline', name: 'search' }}
                size="xs"
                backgroundColor="blue"
              />
            }
            onFilterClear={() => {
              debouncedSetSearchQuery.cancel()
              setSearchInput('')
              setFilterValues(defaultFilterValues)
            }}
          >
            <Box paddingX={3} paddingY={3}>
              <Text variant="h5" marginBottom={2}>
                {formatMessage(m.filterBy)}
              </Text>
              <Box>
                <Checkbox
                  id="filter-starred"
                  label={formatMessage(
                    messages.healthConversationsFilterStarred,
                  )}
                  checked={filterValues.starred}
                  onChange={(e) =>
                    setFilterValues((prev) => ({
                      ...prev,
                      starred: e.target.checked,
                    }))
                  }
                />
              </Box>
              <Box paddingTop={1}>
                <Checkbox
                  id="filter-archived"
                  label={formatMessage(
                    messages.healthConversationsFilterArchived,
                  )}
                  checked={filterValues.archived}
                  onChange={(e) =>
                    setFilterValues((prev) => ({
                      ...prev,
                      archived: e.target.checked,
                    }))
                  }
                />
              </Box>
            </Box>
          </Filter>
        </Box>
        <Box
          display={['none', 'none', 'none', 'block']}
          style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
          marginLeft={2}
        >
          <LinkButton
            to={HealthPaths.HealthConversationsNew}
            text={formatMessage(messages.healthConversationsCreate)}
            variant="primary"
            size="small"
          />
        </Box>
      </Box>
      {initialLoading && <CardLoader />}
      {error && <Problem error={error} noBorder={false} />}
      {!initialLoading &&
        !error &&
        (healthConversations.length === 0 ? (
          <Problem
            type="no_data"
            noBorder={false}
            title={formatMessage(
              activeSearch ? m.noSearchResults : messages.noData,
            )}
            message={
              activeSearch
                ? formatMessage(m.noSearchResultsText, { arg: activeSearch })
                : undefined
            }
            imgSrc="./assets/images/nodata.svg"
            imgAlt=""
          />
        ) : (
          <>
            <Box
              background="blue100"
              borderColor="blue200"
              borderBottomWidth="standard"
              display="flex"
              justifyContent="spaceBetween"
              paddingX={2}
              paddingY={2}
            >
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(m.messages)}
              </Text>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(messages.date)}
              </Text>
            </Box>
            <Stack space={0}>
              {healthConversations.map((item) => (
                <Box
                  key={item.id}
                  className={styles.conversationRow}
                  display="flex"
                  alignItems="center"
                  justifyContent="spaceBetween"
                  background={item.isRead ? undefined : 'blueberry100'}
                  borderColor="blue200"
                  borderBottomWidth="standard"
                  paddingX={2}
                  paddingY="p2"
                  columnGap={2}
                >
                  <Link
                    to={HealthPaths.HealthConversationsDetail.replace(
                      ':id',
                      item.id,
                    )}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      minWidth: 0,
                      flexGrow: 1,
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    <ConversationAvatar
                      variant="organization"
                      tone={item.isRead ? 'tinted' : 'light'}
                      logoUrl={item.organization?.logoUrl ?? undefined}
                    />
                    <Box minWidth={0}>
                      <Box display="flex" alignItems="center" columnGap={1}>
                        <Text variant="medium">
                          {item.groupName || item.organization?.name}
                        </Text>
                        {item.hasAttachment && (
                          <Icon
                            icon="attach"
                            size="small"
                            color="black"
                            type="outline"
                            className={styles.attachmentIcon}
                          />
                        )}
                      </Box>
                      <Text
                        color="blue400"
                        truncate
                        fontWeight={item.isRead ? 'regular' : 'medium'}
                      >
                        {item.title}
                        {!item.isRead && (
                          <VisuallyHidden>
                            {` - ${formatMessage(m.notificationUnread)}`}
                          </VisuallyHidden>
                        )}
                      </Text>
                    </Box>
                  </Link>

                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flexEnd"
                    style={{ flexShrink: 0 }}
                  >
                    <Text variant="medium">
                      {item.lastMessageSentAt
                        ? formatDate(item.lastMessageSentAt)
                        : ''}
                    </Text>
                    <MessageActions
                      size="small"
                      colorScheme="negative"
                      bookmarked={item.isStarred}
                      archived={item.isArchived}
                      onFav={() => toggleStar(item.id, item.isStarred)}
                      onStash={() => toggleArchive(item.id, item.isArchived)}
                    />
                  </Box>
                </Box>
              ))}
            </Stack>
            {conversationsPage?.pageInfo.hasNextPage && (
              <Box display="flex" justifyContent="center" marginTop={3}>
                <Button
                  onClick={loadMore}
                  loading={loadingMore}
                  variant="ghost"
                  size="small"
                >
                  {`${formatMessage(m.fetchMore)} ${
                    healthConversations.length
                  }/${conversationsPage.totalCount}`}
                </Button>
              </Box>
            )}
          </>
        ))}
    </IntroWrapper>
  )
}

export default HealthConversations
