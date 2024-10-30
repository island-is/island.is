import { useIntl } from 'react-intl'

import {
  Box,
  Filter,
  FilterMultiChoice,
  Input,
  Text,
} from '@island.is/island-ui/core'
import { isDefined } from '@island.is/shared/utils'
import { GenericTag } from '@island.is/web/graphql/schema'

import { m } from '../messages'
import { SearchState } from './SearchResults'

interface Props {
  onSearchUpdate: (categoryId: keyof SearchState, value: unknown) => void
  onReset: () => void
  searchState?: SearchState
  tags: Array<GenericTag>
  url: string
}

export const GrantsSearchResultsFilter = ({
  onSearchUpdate,
  onReset,
  searchState,
  tags,
  url,
}: Props) => {
  const { formatMessage } = useIntl()

  const categoryFilters = tags?.filter(
    (t) => t.genericTagGroup?.slug === 'grant-category',
  )

  const typeFilters = tags?.filter(
    (t) => t.genericTagGroup?.slug === 'grant-type',
  )

  return (
    <Box component="form" borderRadius="large" action={url}>
      <Box marginBottom={[1, 1, 2]}>
        <Text variant="h4">{formatMessage(m.search.search)}</Text>

        <Input
          name="q"
          placeholder={formatMessage(m.search.inputPlaceholder)}
          size="xs"
          value={searchState?.query}
          onChange={(e) => onSearchUpdate('query', e.target.value)}
        />
      </Box>
      <Box background="white" padding={[1, 1, 2]}>
        <Filter
          labelClearAll="Hreinsa síur"
          labelOpen=""
          labelClear=""
          onFilterClear={onReset}
        >
          <FilterMultiChoice
            labelClear={'Hreinsa flokk'}
            onChange={({ categoryId, selected }) => {
              onSearchUpdate(categoryId as keyof SearchState, selected)
            }}
            onClear={(categoryId) => {
              onSearchUpdate(categoryId as keyof SearchState, undefined)
            }}
            categories={[
              {
                id: 'status',
                label: 'Staða umsóknar',
                selected: searchState?.['status'] ?? [],
                filters: [
                  {
                    value: 'open',
                    label: 'Opið fyrir umsóknir',
                  },
                  {
                    value: 'open-soon',
                    label: 'Opnar fljótlega',
                  },
                  {
                    value: 'closed',
                    label: 'Lokað fyrir umsóknir',
                  },
                  {
                    value: 'inactive',
                    label: 'Óvirkur sjóður',
                  },
                ],
              },
              categoryFilters
                ? {
                    id: 'category',
                    label: 'Flokkur',
                    selected: searchState?.['category'] ?? [],
                    filters: categoryFilters.map((t) => ({
                      value: t.slug,
                      label: t.title,
                    })),
                  }
                : undefined,
              typeFilters
                ? {
                    id: 'type',
                    label: 'Tegund',
                    selected: searchState?.['type'] ?? [],
                    filters: typeFilters.map((t) => ({
                      value: t.slug,
                      label: t.title,
                    })),
                  }
                : undefined,
              {
                id: 'organization',
                label: 'Stofnun',

                selected: searchState?.['organization'] ?? [],
                filters: [
                  {
                    value: 'rannis',
                    label: 'Rannís',
                  },
                  {
                    value: 'tonlistarmidstod',
                    label: 'Tónlistarmiðstöð',
                  },
                  {
                    value: 'kvikmyndastod',
                    label: 'Kvikmyndastöð',
                  },
                  {
                    value: 'felags-og-vinnumarkadsraduneytid',
                    label: 'Félags- og vinnumarkaðsráðuneytið',
                  },
                  {
                    value: 'menningar-og-vidskiptaraduneytid',
                    label: 'Menningar- og viðskiptaráðuneytið',
                  },
                ],
              },
            ].filter(isDefined)}
          />
        </Filter>
      </Box>
    </Box>
  )
}
