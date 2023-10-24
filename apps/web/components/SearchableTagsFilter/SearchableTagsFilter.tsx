import { useContext, useState, type FC, useEffect } from 'react'
import { useWindowSize } from 'react-use'
import {
  Filter,
  FilterMultiChoice,
  FilterMultiChoiceProps,
  FilterInput,
  type FilterInputProps,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { parseAsArrayOf, parseAsString, useQueryStates } from 'next-usequerystate'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { GlobalContext } from '@island.is/web/context'
import { TagCount } from '@island.is/web/graphql/schema'

type SearchableTagsFilterCategories = FilterMultiChoiceProps['categories'];
type SearchableTagsFilterItems = FilterMultiChoiceProps['categories'][number]['filters'];

type SearchableTagsFilterProps = {
  resultCount: number
  tags?: TagCount[]
}

const SearchableTagsFilter: FC<SearchableTagsFilterProps> = (props) => {
  const { resultCount, tags = [] } = props;
  const { globalNamespace } = useContext(GlobalContext)
  const n = useNamespace(globalNamespace)
  const { width } = useWindowSize()
  const { category, organization, setValue, reset } = useSearchableTagsFilter();
  const labelClear = n('filterClear', 'Hreinsa síu')

  const categories: SearchableTagsFilterCategories = [
    {
      id: 'category',
      label: n('serviceCategories', 'Þjónustuflokkar'),
      singleOption: true,
      filters: filtersFromTags(tags, 'category'),
      selected: category
    },
    {
      id: 'organization',
      label: n('organizations', 'Opinberir aðilar'),
      singleOption: true,
      filters: filtersFromTags(tags, 'organization'),
      selected: organization
    }
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

const SearchableTagsFilterInput: FC = () => {
  const { globalNamespace } = useContext(GlobalContext)
  const n = useNamespace(globalNamespace)
  const { query, setValue: setQueryValue } = useSearchableTagsFilter();
  const [value, setValue] = useState<string>('')

  const handleKeyDown: FilterInputProps['onKeyDown'] = (event) => {
    const { value } = event.currentTarget

    if (event.key === 'Enter') {
      event.currentTarget.blur()
      setQueryValue('q', value);
    }
  }

  useEffect(() => {
    setValue(query ?? '')
  }, [query])

  return (
    <FilterInput
      name="filter-input"
      placeholder={n('filterInputPlaceholder', 'Sláðu inn leitarorð')}
      value={value}
      onChange={setValue} // Why is this a requred prop?
      onKeyDown={handleKeyDown}
    />
  )
}

function filtersFromTags(tags: TagCount[], category: string) {
  return (tags)
    .filter((x) => x.value.trim() && x.type === category)
    .map(({ key, value }) => ({
      label: value,
      value: key,
    })) as SearchableTagsFilterItems
}

function useSearchableTagsFilter() {
  const [filter, setFilter] = useQueryStates({
    category: parseAsArrayOf(parseAsString).withDefault([]),
    organization: parseAsArrayOf(parseAsString).withDefault([]),
    q: parseAsString,
  }, { shallow: false })
  const { q: query, category, organization } = filter

  const setValue = (key: string, value: string | string[] | null) => {
    setFilter({ [key]: value })
  }

  const reset = () => {
    setFilter({
      category: null,
      organization: null,
      q: null,
    })
  }

  return { query, category, organization, reset, setValue }

}

export { SearchableTagsFilter, SearchableTagsFilterInput, useSearchableTagsFilter }
export type { SearchableTagsFilterProps, SearchableTagsFilterCategories }
