import { type FC, useContext } from 'react'
import { useWindowSize } from 'react-use'
import {
  parseAsArrayOf,
  parseAsString,
  useQueryStates,
} from 'next-usequerystate'

import {
  Filter,
  FilterMultiChoice,
  type FilterMultiChoiceProps,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { GlobalContext } from '@island.is/web/context'
import type { TagCount } from '@island.is/web/graphql/schema'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'

type SearchableTagsFilterCategories = FilterMultiChoiceProps['categories']
type SearchableTagsFilterItems =
  FilterMultiChoiceProps['categories'][number]['filters']

type SearchableTagsFilterProps = {
  resultCount: number
  tags?: TagCount[]
  shallow?: boolean
}

const SearchableTagsFilter: FC<SearchableTagsFilterProps> = (props) => {
  const { resultCount, tags = [], shallow } = props
  const { globalNamespace } = useContext(GlobalContext)
  const n = useNamespace(globalNamespace)
  const { width } = useWindowSize()
  const { category, organization, setValue, reset } =
    useSearchableTagsFilter(shallow)
  const labelClear = n('filterClear', 'Hreinsa síu')

  const categories: SearchableTagsFilterCategories = [
    {
      id: 'category',
      label: n('serviceCategories', 'Þjónustuflokkar'),
      singleOption: true,
      filters: filtersFromTags(tags, 'category'),
      selected: category,
    },
    {
      id: 'organization',
      label: n('organizations', 'Opinberir aðilar'),
      singleOption: true,
      filters: filtersFromTags(tags, 'organization'),
      selected: organization,
    },
  ]

  return (
    <Filter
      labelClearAll={n('filterClearAll', 'Hreinsa allar síur')}
      labelClear={labelClear}
      labelOpen={n('filterOpen', 'Sía niðurstöður')}
      labelClose={n('filterClose', 'Loka síu')}
      labelResult={n('filterResults', 'Sjá niðurstöður')}
      variant={width < theme.breakpoints.md ? 'dialog' : 'popover'}
      align="right"
      resultCount={resultCount}
      reverse
      onFilterClear={reset}
    >
      <FilterMultiChoice
        labelClear={labelClear}
        categories={categories}
        onChange={({ categoryId, selected }) => setValue(categoryId, selected)}
        onClear={(categoryId) => setValue(categoryId, null)}
        singleExpand
      />
    </Filter>
  )
}

function filtersFromTags(tags: TagCount[], category: string) {
  return tags
    .filter((x) => x.value.trim() && x.type === category)
    .map(({ key, value }) => ({
      label: value,
      value: key,
    })) as SearchableTagsFilterItems
}

function useSearchableTagsFilter(shallow = false) {
  const [filter, setFilter] = useQueryStates(
    {
      category: parseAsArrayOf(parseAsString).withDefault([]),
      organization: parseAsArrayOf(parseAsString).withDefault([]),
    },
    { shallow },
  )
  const { category, organization } = filter

  const setValue = (key: string, value: string | string[] | null) => {
    setFilter({ [key]: value })
  }

  const reset = () => {
    setFilter({
      category: null,
      organization: null,
    })
  }

  return { category, organization, reset, setValue }
}

export { SearchableTagsFilter, useSearchableTagsFilter }
export type { SearchableTagsFilterProps, SearchableTagsFilterCategories }
