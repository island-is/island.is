import {
  Box,
  Checkbox,
  Filter,
  Input,
  Stack,
  Text,
  VisuallyHidden,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  EmptyState,
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
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { HealthDirectorateHealthConversationStatusFilter } from '@island.is/api/schema'
import {
  useGetHealthConversationsQuery,
  useStarHealthConversationMutation,
  useUnstarHealthConversationMutation,
  useArchiveHealthConversationMutation,
  useUnarchiveHealthConversationMutation,
} from './HealthConversations.generated'

const defaultFilterValues = {
  searchQuery: '',
  starred: false,
  archived: false,
}

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

  const { data, loading, error } = useGetHealthConversationsQuery({
    variables: {
      input: {
        ...(filterValues.archived
          ? {
              status: HealthDirectorateHealthConversationStatusFilter.ARCHIVED,
            }
          : {}),
        ...(filterValues.starred ? { starred: true } : {}),
      },
    },
  })

  const healthConversations = data?.healthDirectorateHealthConversations

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

  const [starMessage] = useStarHealthConversationMutation({
    refetchQueries: ['GetHealthConversations'],
    onError: onMutationError,
  })
  const [unstarMessage] = useUnstarHealthConversationMutation({
    refetchQueries: ['GetHealthConversations'],
    onError: onMutationError,
  })
  const [archiveMessage] = useArchiveHealthConversationMutation({
    refetchQueries: ['GetHealthConversations'],
    onError: onMutationError,
  })
  const [unarchiveMessage] = useUnarchiveHealthConversationMutation({
    refetchQueries: ['GetHealthConversations'],
    onError: onMutationError,
  })

  const filteredConversations = useMemo(() => {
    if (!healthConversations) {
      return []
    }

    const query = filterValues.searchQuery.trim().toLowerCase()
    if (!query) return healthConversations

    return healthConversations.filter((message) => {
      return (
        message.title?.toLowerCase().includes(query) ||
        message.lastSenderGroupName?.toLowerCase().includes(query)
      )
    })
  }, [filterValues, healthConversations])

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
        <Filter
          labelClearAll={formatMessage(m.clearAllFilters)}
          labelClear={formatMessage(m.clearFilter)}
          labelOpen={formatMessage(m.openFilter)}
          reverse
          variant="popover"
          align="left"
          filterInput={
            <Input
              name="messageSearch"
              placeholder={formatMessage(
                messages.healthConversationsSearchPlaceholder,
              )}
              value={searchInput}
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
                label={formatMessage(messages.healthConversationsFilterStarred)}
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
        <Box
          display={['none', 'none', 'none', 'block']}
          style={{ whiteSpace: 'nowrap' }}
        >
          <LinkButton
            to={HealthPaths.HealthConversationsNew}
            text={formatMessage(messages.healthConversationsCreate)}
            variant="primary"
            size="small"
          />
        </Box>
      </Box>
      {loading && <CardLoader />}
      {error && <Problem error={error} noBorder={false} />}
      {!loading &&
        !error &&
        (filteredConversations?.length === 0 ? (
          <EmptyState title={messages.noData} />
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
              {filteredConversations?.map((item) => (
                <Box
                  key={item.id}
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
                      icon={item.hasAttachment ? 'document' : 'heart'}
                    />
                    <Box minWidth={0}>
                      <Text variant="medium">{item.lastSenderGroupName}</Text>
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
                      colorScheme="negative"
                      bookmarked={item.isStarred}
                      archived={item.isArchived}
                      onFav={() => {
                        if (item.isStarred) {
                          unstarMessage({
                            variables: { input: { id: item.id } },
                          })
                        } else {
                          starMessage({ variables: { input: { id: item.id } } })
                        }
                      }}
                      onStash={() => {
                        if (item.isArchived) {
                          unarchiveMessage({
                            variables: { input: { id: item.id } },
                          })
                        } else {
                          archiveMessage({
                            variables: { input: { id: item.id } },
                          })
                        }
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Stack>
          </>
        ))}
    </IntroWrapper>
  )
}

export default HealthConversations
