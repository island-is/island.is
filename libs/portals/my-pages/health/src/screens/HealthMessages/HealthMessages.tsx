import {
  Box,
  Button,
  Checkbox,
  Filter,
  Icon,
  Input,
  Stack,
  Text,
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
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { HealthDirectorateHealthMessageStatusFilter } from '@island.is/api/schema'
import {
  useGetHealthMessagesQuery,
  useStarHealthMessageMutation,
  useUnstarHealthMessageMutation,
  useArchiveHealthMessageMutation,
  useUnarchiveHealthMessageMutation,
} from './HealthMessages.generated'

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

const HealthMessages = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const [filterOpenOnly, setFilterOpenOnly] = useState(false)
  const [filterStarred, setFilterStarred] = useState(false)
  const [filterArchived, setFilterArchived] = useState(false)
  const [query, setQuery] = useState('')

  const { data, loading, error } = useGetHealthMessagesQuery({
    variables: {
      ...(filterArchived
        ? { status: HealthDirectorateHealthMessageStatusFilter.archived }
        : filterOpenOnly
        ? { status: HealthDirectorateHealthMessageStatusFilter.active }
        : {}),
      ...(filterStarred ? { starred: true } : {}),
    },
  })

  const [starMessage] = useStarHealthMessageMutation({
    refetchQueries: ['GetHealthMessages'],
  })
  const [unstarMessage] = useUnstarHealthMessageMutation({
    refetchQueries: ['GetHealthMessages'],
  })
  const [archiveMessage] = useArchiveHealthMessageMutation({
    refetchQueries: ['GetHealthMessages'],
  })
  const [unarchiveMessage] = useUnarchiveHealthMessageMutation({
    refetchQueries: ['GetHealthMessages'],
  })

  const items = data?.healthDirectorateHealthMessages ?? []

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((i) =>
      [i.title, i.lastSenderGroupName]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q)),
    )
  }, [items, query])

  return (
    <IntroWrapper
      title={m.messages}
      intro={messages.healthMessagesIntro}
      buttonGroup={{
        alignment: 'spaceBetween',
        actions: [
          <Filter
            key="filter"
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
                    messages.healthMessagesSearchPlaceholder,
                  )}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  icon={{ type: 'outline', name: 'search' }}
                  size="sm"
                  backgroundColor="blue"
                />
              </Box>
            }
            onFilterClear={() => {
              setFilterOpenOnly(false)
              setFilterStarred(false)
              setFilterArchived(false)
              setQuery('')
            }}
          >
            <Box paddingX={3} paddingY={3}>
              <Text variant="h5" marginBottom={2}>
                {formatMessage(m.filterBy)}
              </Text>
              <Button
                variant={filterOpenOnly ? 'primary' : 'utility'}
                size="small"
                onClick={() => setFilterOpenOnly((v) => !v)}
              >
                {filterOpenOnly
                  ? formatMessage(messages.healthMessagesShowAll)
                  : formatMessage(messages.healthMessagesShowOpen)}
              </Button>
              <Box paddingTop={2}>
                <Checkbox
                  id="filter-starred"
                  label={formatMessage(messages.healthMessagesFilterStarred)}
                  checked={filterStarred}
                  onChange={(e) => setFilterStarred(e.target.checked)}
                />
              </Box>
              <Box paddingTop={1}>
                <Checkbox
                  id="filter-archived"
                  label={formatMessage(messages.healthMessagesFilterArchived)}
                  checked={filterArchived}
                  onChange={(e) => setFilterArchived(e.target.checked)}
                />
              </Box>
            </Box>
          </Filter>,
          <Box key="create" style={{ whiteSpace: 'nowrap' }}>
            <Button
              variant="primary"
              size="small"
              iconType="outline"
              onClick={() => undefined}
            >
              {formatMessage(messages.healthMessagesCreate)}
            </Button>
          </Box>,
        ],
      }}
    >
      {loading && <CardLoader />}
      {error && <Problem error={error} noBorder={false} />}
      {!loading && !error && (
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

          {filtered.length === 0 && (
            <EmptyState title={messages.noData} />
          )}

          <Stack space={0}>
            {filtered.map((item) => (
              <Box
                key={item.id}
                display="flex"
                alignItems="center"
                justifyContent="spaceBetween"
                borderColor="blue200"
                borderBottomWidth="standard"
                paddingX={2}
                paddingY="p2"
                columnGap={2}
                cursor="pointer"
                onClick={() =>
                  navigate(
                    HealthPaths.HealthMessagesDetail.replace(':id', item.id),
                  )
                }
              >
                {/* Left: logo + text */}
                <Box
                  display="flex"
                  alignItems="center"
                  columnGap={2}
                  minWidth={0}
                >
                  <CircleLogo
                    fallbackIcon={item.hasAttachment ? 'document' : 'heart'}
                  />
                  <Box minWidth={0}>
                    <Text variant="medium">{item.lastSenderGroupName}</Text>
                    <Text color="blue400" truncate fontWeight="regular">
                      {item.title}
                    </Text>
                  </Box>
                </Box>

                {/* Right: date above, icons below */}
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
                    onFav={(e) => {
                      e.stopPropagation()
                      if (item.isStarred) {
                        unstarMessage({ variables: { id: item.id } })
                      } else {
                        starMessage({ variables: { id: item.id } })
                      }
                    }}
                    onStash={(e) => {
                      e.stopPropagation()
                      if (item.isArchived) {
                        unarchiveMessage({ variables: { id: item.id } })
                      } else {
                        archiveMessage({ variables: { id: item.id } })
                      }
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Stack>
        </>
      )}
    </IntroWrapper>
  )
}

export default HealthMessages
