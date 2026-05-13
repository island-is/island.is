import {
  Box,
  Button,
  Filter,
  Icon,
  Input,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { FavAndStash, IntroWrapper, m } from '@island.is/portals/my-pages/core'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'

const CircleLogo = ({
  img,
  fallbackIcon,
}: {
  img?: string
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
      {img ? (
        <img
          src={img}
          alt=""
          style={{ width: 28, height: 28, objectFit: 'contain' }}
        />
      ) : (
        <Icon icon={fallbackIcon} type="outline" color="blue400" />
      )}
    </Box>
  )
}

const HealthMessages = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  const navigate = useNavigate()
  const [filterOpenOnly, setFilterOpenOnly] = useState(false)
  const [query, setQuery] = useState('')
  const [starredById, setStarredById] = useState<Record<string, boolean>>({})
  const [archivedById, setArchivedById] = useState<Record<string, boolean>>({})

  const baseItems = useMemo(
    () => [
      {
        id: '1',
        organization: 'Heilsugæslan Glæsibæ',
        title: 'Eftirfylgni meðferð',
        date: '17.02.2026',
        starred: false,
        icon: 'healthDirectorate' as const,
        status: 'open' as const,
      },
      {
        id: '2',
        organization: 'Meltingarsetrið',
        title: 'Leiðbeiningar fyrir magaspeglun',
        date: '27.10.2025',
        starred: false,
        icon: 'document' as const,
        status: 'open' as const,
      },
      {
        id: '3',
        organization: 'Heilsugæslan Glæsibæ',
        title: 'Niðurstaða rannsóknar',
        date: '17.02.2026',
        starred: true,
        icon: 'healthDirectorate' as const,
        status: 'open' as const,
      },
      {
        id: '4',
        organization: 'Ónæmisfræðideild',
        title: 'Almennt vottorð',
        date: '11.04.2025',
        starred: false,
        icon: 'document' as const,
        status: 'closed' as const,
      },
      {
        id: '5',
        organization: 'Landspítali',
        title: 'Niðurstöður PCR prófs vegna COVID-19',
        date: '15.05.2024',
        starred: false,
        icon: 'document' as const,
        status: 'closed' as const,
      },
    ],
    [],
  )

  const filtered = useMemo(() => {
    const openFiltered = filterOpenOnly
      ? baseItems.filter((i) => i.status === 'open')
      : baseItems

    const q = query.trim().toLowerCase()
    return q
      ? openFiltered.filter((i) =>
          [i.organization, i.title, i.date]
            .filter(Boolean)
            .some((v) => v.toLowerCase().includes(q)),
        )
      : openFiltered
  }, [baseItems, filterOpenOnly, query])

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
        {filtered.map((item) => {
          const starred = starredById[item.id] ?? item.starred ?? false
          const archived = archivedById[item.id] ?? false
          const rowIcon: 'heart' | 'document' =
            item.icon === 'healthDirectorate' ? 'heart' : 'document'

          return (
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
                <CircleLogo fallbackIcon={rowIcon} />
                <Box minWidth={0}>
                  <Text variant="medium">{item.organization}</Text>
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
                <Text variant="medium">{item.date}</Text>
                <FavAndStash
                  colorScheme="negative"
                  bookmarked={starred}
                  archived={archived}
                  onFav={(e) => {
                    e.stopPropagation()
                    setStarredById((prev) => ({
                      ...prev,
                      [item.id]: !(prev[item.id] ?? item.starred),
                    }))
                  }}
                  onStash={(e) => {
                    e.stopPropagation()
                    setArchivedById((prev) => ({
                      ...prev,
                      [item.id]: !prev[item.id],
                    }))
                  }}
                />
              </Box>
            </Box>
          )
        })}
      </Stack>
    </IntroWrapper>
  )
}

export default HealthMessages
