import {
  ActionCard,
  Box,
  Filter,
  Input,
  SkeletonLoader,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatDate, IntroWrapper, m } from '@island.is/portals/my-pages/core'
import { debounceTime } from '@island.is/shared/constants'
import debounce from 'lodash/debounce'
import { useMemo, useState } from 'react'
import { messages } from '../../lib/messages'

interface EducationalMaterialItem {
  id: string
  institution: string
  title: string
  sentDate: string
  url: string
}

// Mock data until service endpoint is available
const MOCK_EDUCATIONAL_MATERIALS: EducationalMaterialItem[] = [
  {
    id: '1',
    institution: 'Landsspítalinn',
    title: 'Mataræði á meðgöngu',
    sentDate: '2025-08-14',
    url: 'https://www.landspitali.is',
  },
  {
    id: '2',
    institution: 'Landsspítalinn',
    title: 'Meðgangan í vikum',
    sentDate: '2025-08-14',
    url: 'https://www.landspitali.is',
  },
  {
    id: '3',
    institution: 'Landsspítalinn',
    title: 'Ógleði og uppköst',
    sentDate: '2025-08-14',
    url: 'https://www.landspitali.is',
  },
  {
    id: '4',
    institution: 'Landsspítalinn',
    title: 'Hægðatregða',
    sentDate: '2025-08-14',
    url: 'https://www.landspitali.is',
  },
]

const EducationalMaterial = () => {
  const { formatMessage } = useLocale()
  const [searchQuery, setSearchQuery] = useState('')

  const loading = false

  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchQuery(value)
      }, debounceTime.search),
    [],
  )

  const filteredMaterials = MOCK_EDUCATIONAL_MATERIALS.filter((item) => {
    const query = searchQuery.toLowerCase()
    return (
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.institution.toLowerCase().includes(query)
    )
  })

  return (
    <IntroWrapper
      title={messages.infoMaterial}
      intro={messages.infoMaterialIntro}
      childrenWidthFull
    >
      <Filter
        variant="popover"
        align="left"
        reverse
        labelClearAll={formatMessage(m.clearAllFilters)}
        labelClear={formatMessage(m.clearFilter)}
        labelOpen={formatMessage(m.openFilter)}
        onFilterClear={() => {
          debouncedSetSearch.cancel()
          setSearchQuery('')
        }}
        filterInput={
          <Input
            placeholder={formatMessage(m.searchPlaceholder)}
            name="fraedslufni-input"
            size="xs"
            label={formatMessage(m.searchLabel)}
            onChange={(e) => debouncedSetSearch(e.target.value)}
            backgroundColor="blue"
            icon={{ name: 'search' }}
          />
        }
      >
        {/* No additional filter options needed for now */}
        <Box />
      </Filter>
      <Box marginTop={5}>
        {loading ? (
          <SkeletonLoader
            space={2}
            repeat={4}
            display="block"
            width="full"
            height={96}
          />
        ) : (
          <Stack space={3}>
            {filteredMaterials.map((item) => (
              <ActionCard
                key={item.id}
                eyebrow={item.institution}
                eyebrowColor="purple400"
                heading={item.title}
                headingVariant="h4"
                text={formatMessage(messages.sentDate, {
                  date: formatDate(item.sentDate, 'dd.MM.yyyy'),
                })}
                cta={{
                  label: formatMessage(messages.viewMaterial),
                  variant: 'text',
                  icon: 'open',
                  iconType: 'outline',
                  onClick: () => window.open(item.url, '_blank', 'noreferrer'),
                }}
              />
            ))}
          </Stack>
        )}
      </Box>
    </IntroWrapper>
  )
}

export default EducationalMaterial
