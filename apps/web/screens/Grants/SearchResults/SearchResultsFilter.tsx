import { useIntl } from 'react-intl'

import {
  Box,
  Filter,
  FilterMultiChoice,
  FilterProps,
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
  variant?: FilterProps['variant']
}

export const GrantsSearchResultsFilter = ({
  onSearchUpdate,
  onReset,
  searchState,
  tags,
  url,
  variant = 'default',
}: Props) => {
  const { formatMessage } = useIntl()
  const categoryFilters = tags?.filter(
    (t) => t.genericTagGroup?.slug === 'grant-category',
  )

  const typeFilters = tags?.filter(
    (t) => t.genericTagGroup?.slug === 'grant-type',
  )

  return (
    <Box
      component="form"
      borderRadius="large"
      action={url}
      onSubmit={(e) => {
        e.preventDefault()
      }}
    >
      <Filter
        labelClearAll={formatMessage(m.search.clearFilters)}
        labelOpen=""
        labelClear=""
        onFilterClear={onReset}
        variant={variant}
      >
        <Box background="white" padding={[1, 1, 2]} borderRadius="large">
          <FilterMultiChoice
            labelClear={formatMessage(m.search.clearFilterCategory)}
            onChange={({ categoryId, selected }) => {
              onSearchUpdate(
                categoryId as keyof SearchState,
                selected.length ? selected : undefined,
              )
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
                ],
              },
              categoryFilters
                ? {
                    id: 'category',
                    label: 'Flokkun',
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
                ],
              },
            ].filter(isDefined)}
          />
        </Box>
      </Filter>
    </Box>
  )
}
