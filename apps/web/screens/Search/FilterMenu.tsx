import React, { Dispatch, ReactNode, SetStateAction } from 'react'

import {
  Filter,
  FilterMultiChoice,
  FilterProps,
} from '@island.is/island-ui/core'

export type FilterOptions = {
  category: Array<string>
  organization: Array<string>
}

interface FilterMenuProps {
  categories: ReadonlyArray<CategoriesProps>
  filter: FilterOptions
  setFilter: Dispatch<SetStateAction<FilterOptions>>
  clearFilter: () => void
  children?: ReactNode
  resultCount?: number
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
  label: string | ReactNode
  selected: Array<string>
  filters: Array<{ value: string; label: string | ReactNode }>
  inline?: boolean
  singleOption?: boolean
}

export const FilterMenu = ({
  categories,
  filter,
  setFilter,
  clearFilter,
  labelClear = 'Hreinsa síu',
  labelClearAll = 'Hreinsa allar síur',
  labelOpen = 'Sía niðurstöður',
  labelClose = 'Loka síu',
  labelTitle = 'Sía stofnanir',
  labelResult = 'Sýna niðurstöður',
  labelFilterBy = 'Sía eftir',
  variant,
  align,
  resultCount = 0,
}: FilterMenuProps & FilterLabels & Pick<FilterProps, 'variant' | 'align'>) => (
  <Filter
    labelClearAll={labelClearAll}
    labelClear={labelClear}
    labelOpen={labelOpen}
    labelClose={labelClose}
    labelTitle={labelTitle}
    labelResult={labelResult}
    labelFilterBy={labelFilterBy}
    variant={variant}
    align={align}
    resultCount={resultCount}
    reverse
    onFilterClear={clearFilter}
  >
    <FilterMultiChoice
      labelClear={labelClear}
      categories={categories}
      onChange={(event) => {
        setFilter({
          ...filter,
          [event.categoryId]: event.selected,
        })
      }}
      onClear={(categoryId) => {
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
