import React, { Dispatch, SetStateAction } from 'react'

import { FilterProps, Select, Stack } from '@island.is/island-ui/core'

export type FilterOptions = {
  category: Array<string>
  organization: Array<string>
}

interface FilterMenuProps {
  categories: ReadonlyArray<CategoriesProps>
  filter: FilterOptions
  setFilter: Dispatch<SetStateAction<FilterOptions>>
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
  label: string
  selected: Array<string>
  filters: Array<{ value: string; label: string }>
  inline?: boolean
  singleOption?: boolean
}

export const SidebarFilterMenu = ({
  categories,
  setFilter,
  filter,
}: FilterMenuProps) => (
  <Stack space={3}>
    {categories.map((category) => (
      <Select
        key={category.id}
        options={category.filters}
        size="xs"
        label={category.label}
        value={
          category.filters.find(
            (filter) => filter.value === category.selected?.[0],
          ) ?? category.filters[0]
        }
        onChange={(option) => {
          setFilter({
            ...filter,
            [category.id]: option?.value ? [option.value] : [],
          })
        }}
      />
    ))}
  </Stack>
)
