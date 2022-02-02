import React, { Dispatch, ReactNode, SetStateAction } from 'react'
import {
  Filter,
  FilterMultiChoice,
  FilterProps,
} from '@island.is/island-ui/core'

export type FilterOptions = {
  category: Array<string>
  organization: Array<string>
  refresh?: boolean
}

export const initialFilter: FilterOptions = {
  category: [],
  organization: [],
  refresh: false,
}

interface FilterMenuProps {
  categories: ReadonlyArray<CategoriesProps>
  filter: FilterOptions
  setFilter: Dispatch<SetStateAction<FilterOptions>>
  children?: ReactNode
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
    reverse
    onFilterClear={() => setFilter({ category: [], organization: [] })}
  >
    <FilterMultiChoice
      labelClear={labelClear}
      categories={categories}
      onChange={(event) => {
        setFilter({
          ...filter,
          [event.categoryId]: event.selected,
          refresh: true,
        })
      }}
      onClear={(categoryId) => {
        setFilter({
          ...filter,
          [categoryId]: [],
          refresh: true,
        })
      }}
      singleExpand
    />
  </Filter>
)

export default FilterMenu
