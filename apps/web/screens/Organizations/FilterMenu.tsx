import React, { Dispatch, SetStateAction } from 'react'

import {
  Filter,
  FilterInput,
  FilterMultiChoice,
  FilterProps,
} from '@island.is/island-ui/core'

export type FilterOptions = {
  raduneyti: Array<string>
  input: string
}

interface FilterMenuProps {
  categories: ReadonlyArray<CategoriesProps>
  filter: FilterOptions
  setFilter: Dispatch<SetStateAction<FilterOptions>>
  resultCount: number
  onBeforeUpdate: () => void
}

export type FilterLabels = Pick<
  FilterProps,
  | 'labelClear'
  | 'labelOpen'
  | 'labelClose'
  | 'labelTitle'
  | 'labelResult'
  | 'labelClearAll'
  | 'labelFilterBy'
> & { inputPlaceholder?: string }

export type CategoriesProps = {
  id: string
  label: string
  selected: Array<string>
  filters: Array<{ value: string; label: string }>
}

export const FilterMenu = ({
  categories,
  filter,
  setFilter,
  resultCount,
  onBeforeUpdate,
  labelClear = 'Hreinsa síu',
  labelClearAll = 'Hreinsa allar síur',
  labelOpen = 'Sía niðurstöður',
  labelClose = 'Loka síu',
  labelTitle = 'Sía stofnanir',
  labelResult = 'Sýna niðurstöður',
  labelFilterBy = 'Sía eftir',
  inputPlaceholder = 'Sía eftir leitarorði',
  variant,
  align,
}: FilterMenuProps & FilterLabels & Pick<FilterProps, 'variant' | 'align'>) => (
  <Filter
    labelClearAll={labelClearAll}
    labelClear={labelClear}
    labelOpen={labelOpen}
    labelClose={labelClose}
    labelTitle={labelTitle}
    labelResult={labelResult}
    labelFilterBy={labelFilterBy}
    resultCount={resultCount}
    variant={variant}
    align={align}
    filterInput={
      <FilterInput
        name="filter-input"
        placeholder={inputPlaceholder}
        value={filter.input}
        onChange={(value) => setFilter({ ...filter, input: value })}
      />
    }
    onFilterClear={() =>
      setFilter({
        raduneyti: [],
        input: '',
      })
    }
  >
    <FilterMultiChoice
      labelClear={labelClear}
      categories={categories}
      onChange={(event) => {
        onBeforeUpdate()
        setFilter({
          ...filter,
          [event.categoryId]: event.selected,
        })
      }}
      onClear={(categoryId) => {
        onBeforeUpdate()
        setFilter({
          ...filter,
          [categoryId]: [],
        })
      }}
      singleExpand
    />
  </Filter>
)

export default FilterMenu
