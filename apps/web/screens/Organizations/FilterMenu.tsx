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
  asDialog?: boolean
  resultCount: number
  onBeforeUpdate: () => void
}

export type FilterLabels = Pick<
  FilterProps,
  'labelClear' | 'labelOpen' | 'labelClose' | 'labelTitle' | 'labelResult'
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
  asDialog,
  resultCount,
  onBeforeUpdate,
  labelClear = 'Hreinsa síu',
  labelOpen = 'Opna síu',
  labelClose = 'Loka síu',
  labelTitle = 'Sía stofnanir',
  labelResult = 'Sýna niðurstöður',
  inputPlaceholder = 'Sía eftir leitarorði',
}: FilterMenuProps & FilterLabels) => (
  <Filter
    labelClear={labelClear}
    labelOpen={labelOpen}
    labelClose={labelClose}
    labelTitle={labelTitle}
    labelResult={labelResult}
    resultCount={resultCount}
    isDialog={asDialog}
    onFilterClear={() =>
      setFilter({
        raduneyti: [],
        input: '',
      })
    }
  >
    <FilterInput
      name="filter-input"
      placeholder={inputPlaceholder}
      value={filter.input}
      onChange={(value) => setFilter({ ...filter, input: value })}
    />
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
    />
  </Filter>
)

export default FilterMenu
