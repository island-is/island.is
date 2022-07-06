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
  labelClear = 'Hreinsa síu',
  labelClearAll = 'Hreinsa allar síur',
  labelOpen = 'Sía niðurstöður',
  labelClose = 'Loka síu',
  labelTitle = 'Sía stofnanir',
  labelResult = 'Sýna niðurstöður',
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
    variant={variant}
    align={align}
    resultCount={resultCount}
    reverse
    onFilterClear={() => {
      setFilter({ category: [], organization: [] })
    }}
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
