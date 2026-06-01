import {
  Box,
  Button,
  Checkbox,
  Filter,
  Icon,
  Input,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  EmptyState,
  FavAndStash,
  IntroWrapper,
  formatDate,
  m,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { debounceTime } from '@island.is/shared/constants'
import debounce from 'lodash/debounce'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import {
  HealthDirectorateHealthConversation,
  HealthDirectorateHealthConversationStatusFilter,
} from '@island.is/api/schema'
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

const CircleLogo = ({
  fallbackIcon,
}: {
  fallbackIcon: 'heart' | 'document'
}) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="full"
      background="blue100"
      borderColor="blue200"
      borderWidth="standard"
      style={{ width: 48, height: 48, flexShrink: 0, overflow: 'hidden' }}
    >
      <Icon icon={fallbackIcon} type="outline" color="blue400" />
    </Box>
  )
}

const HealthConversations = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const [filterValues, setFilterValues] =
    useState<FilterValues>(defaultFilterValues)

  const { data, loading, error } = useGetHealthConversationsQuery({
    variables: {
      ...(filterValues.archived
        ? { status: HealthDirectorateHealthConversationStatusFilter.ARCHIVED }
        : {}),
      ...(filterValues.starred ? { starred: true } : {}),
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
    if (!data?.healthDirectorateHealthConversations) {
      return []
    }

    return healthConversations?.filter((message) => {
      const matchesSearch =
        message.title
          ?.toLowerCase()
          .includes(filterValues.searchQuery.toLowerCase()) ||
        message.lastSenderGroupName
          ?.toLowerCase()
          .includes(filterValues.searchQuery.toLowerCase())

      return matchesSearch
    })
  }, [
    filterValues,
    healthConversations,
    data?.healthDirectorateHealthConversations,
  ])

  return (
    <IntroWrapper
      title={m.messages}
      intro={messages.healthConversationsIntro}
      desktopContentSpan="10/12"
    >
      <Box display={['block', 'block', 'block', 'none']} marginBottom={3}>
        <Button
          variant="primary"
          size="small"
          iconType="outline"
          onClick={() => navigate(HealthPaths.HealthConversationsNew)}
        >
          {formatMessage(messages.healthConversationsCreate)}
        </Button>
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
            <Box style={{ width: '100%', maxWidth: 320 }}>
              <Input
                name="messageSearch"
                placeholder={formatMessage(
                  messages.healthConversationsSearchPlaceholder,
                )}
                onChange={(e) => handleSearchChange(e.target.value)}
                icon={{ type: 'outline', name: 'search' }}
                size="sm"
                backgroundColor="blue"
              />
            </Box>
          }
          onFilterClear={() => {
            debouncedSetSearchQuery.cancel()
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
          <Button
            variant="primary"
            size="small"
            iconType="outline"
            onClick={() => navigate(HealthPaths.HealthConversationsNew)}
          >
            {formatMessage(messages.healthConversationsCreate)}
          </Button>
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
                    <CircleLogo
                      fallbackIcon={item.hasAttachment ? 'document' : 'heart'}
                    />
                    <Box minWidth={0}>
                      <Text variant="medium">{item.lastSenderGroupName}</Text>
                      <Text
                        color="blue400"
                        truncate
                        fontWeight={item.isRead ? 'regular' : 'medium'}
                      >
                        {item.title}
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
                    <FavAndStash
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
