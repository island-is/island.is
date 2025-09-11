import { useIntl } from 'react-intl'
import sortBy from 'lodash/sortBy'

import {
  Box,
  Filter,
  FilterMultiChoice,
  FilterProps,
} from '@island.is/island-ui/core'
import { isDefined } from '@island.is/shared/utils'
import { GenericTag } from '@island.is/web/graphql/schema'

import { m } from '../messages'

export interface SearchState {
  status?: 'open' | 'closed'
  category?: Array<string>
  type?: Array<string>
  organization?: Array<string>
}

interface Props {
  onSearchUpdate: (
    categoryId: keyof SearchState,
    values?: Array<string>,
  ) => void
  onReset: () => void
  searchState?: SearchState
  tags: Array<GenericTag>
  url: string
  variant?: FilterProps['variant']
  hits?: number
}

export const GrantsSearchResultsFilter = ({
  onSearchUpdate,
  onReset,
  searchState,
  tags,
  url,
  variant = 'default',
  hits,
}: Props) => {
  const { formatMessage, locale } = useIntl()

  const sortedFilters = {
    categories: sortBy(
      tags?.filter((t) => t.genericTagGroup?.slug === 'grant-category'),
      'title',
    ),
    types: sortBy(
      tags?.filter((t) => t.genericTagGroup?.slug === 'grant-type'),
      'title',
    ),
  }

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
        labelOpen={formatMessage(m.search.openFilter)}
        labelClose={formatMessage(m.search.closeFilter)}
        labelClear={formatMessage(m.search.clearFilters)}
        labelTitle={formatMessage(m.search.filterTitle)}
        labelResult={formatMessage(m.search.viewResults)}
        resultCount={hits}
        onFilterClear={onReset}
        variant={variant}
        align={'right'}
        usePopoverDiscloureButtonStyling
      >
        <Box background="white" borderRadius="large">
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
                label: formatMessage(m.search.applicationStatus),
                singleOption: true,
                selected: searchState?.['status']
                  ? [searchState['status']]
                  : [],
                filters: [
                  {
                    value: 'open',
                    label: formatMessage(m.search.applicationOpen),
                  },
                  {
                    value: 'closed',
                    label: formatMessage(m.search.applicationClosed),
                  },
                ],
              },
              sortedFilters.categories
                ? {
                    id: 'category',
                    label: formatMessage(m.search.category),
                    selected: searchState?.['category'] ?? [],
                    filters: sortedFilters.categories.map((t) => ({
                      value: t.slug,
                      label: t.title,
                    })),
                  }
                : undefined,
              sortedFilters.types
                ? {
                    id: 'type',
                    label: formatMessage(m.search.type),
                    selected: searchState?.['type'] ?? [],
                    filters: sortedFilters.types.map((t) => ({
                      value: t.slug,
                      label: t.title,
                    })),
                  }
                : undefined,
              {
                id: 'organization',
                label: formatMessage(m.search.organization),

                selected: searchState?.['organization'] ?? [],
                filters: [
                  {
                    value:
                      locale === 'is'
                        ? 'rannis'
                        : 'the-icelandic-centre-for-research',
                    label: 'Rannís',
                  },
                  {
                    value:
                      locale === 'is'
                        ? 'Umhverfis- og orkustofnun'
                        : 'Environment and Energy Agency',
                    label: 'Umhverfis- og orkustofnun',
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
