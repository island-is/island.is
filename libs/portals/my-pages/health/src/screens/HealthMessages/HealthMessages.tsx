import {
  Box,
  Button,
  Checkbox,
  Filter,
  GridColumn,
  GridContainer,
  GridRow,
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
import { Link, useNavigate } from 'react-router-dom'
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

  const [filterStarred, setFilterStarred] = useState(false)
  const [filterArchived, setFilterArchived] = useState(false)
  const [query, setQuery] = useState('')

  const { data, loading, error } = useGetHealthMessagesQuery({
    variables: {
      ...(filterArchived
        ? { status: HealthDirectorateHealthMessageStatusFilter.archived }
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
    >
      <GridContainer>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '10/12']}>
      <Box display="flex" justifyContent="spaceBetween" alignItems="center" marginBottom={3}>
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
            setFilterStarred(false)
            setFilterArchived(false)
            setQuery('')
          }}
        >
          <Box paddingX={3} paddingY={3}>
            <Text variant="h5" marginBottom={2}>
              {formatMessage(m.filterBy)}
            </Text>
            <Box>
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
        </Filter>
        <Box style={{ whiteSpace: 'nowrap' }}>
          <Button
            variant="primary"
            size="small"
            iconType="outline"
            onClick={() => navigate(HealthPaths.HealthMessagesNew)}
          >
            {formatMessage(messages.healthMessagesCreate)}
          </Button>
        </Box>
      </Box>
      {loading && <CardLoader />}
      {error && <Problem error={error} noBorder={false} />}
      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
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
                  >
                    {/* Left: logo + text (navigable link) */}
                    <Link
                      to={HealthPaths.HealthMessagesDetail.replace(
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
                          fontWeight={item.isRead ? 'regular' : 'semiBold'}
                        >
                          {item.title}
                        </Text>
                      </Box>
                    </Link>

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
                        onFav={() => {
                          if (item.isStarred) {
                            unstarMessage({ variables: { id: item.id } })
                          } else {
                            starMessage({ variables: { id: item.id } })
                          }
                        }}
                        onStash={() => {
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
        </>
      )}
          </GridColumn>
        </GridRow>
      </GridContainer>
    </IntroWrapper>
  )
}

export default HealthMessages
