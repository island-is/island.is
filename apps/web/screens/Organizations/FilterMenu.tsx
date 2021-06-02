import React, { Dispatch, SetStateAction } from 'react'
import {
  Filter,
  FilterInput,
  FilterMultiChoice,
} from '@island.is/island-ui/core'

export type FilterProps = {
  raduneyti: Array<string>
  input: string
}

interface FilterMenuProps {
  categories: ReadonlyArray<CategoriesProps>
  filter: FilterProps
  setFilter: Dispatch<SetStateAction<FilterProps>>
  asDialog?: boolean
  resultCount: number
}

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
}: FilterMenuProps) => (
  <Filter
    labelClear="Hreinsa síu"
    labelOpen="Opna síu"
    labelClose="Loka síu"
    labelTitle="Sía stofnanir"
    labelResult="Sýna niðurstöður"
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
      placeholder="Sía eftir leitarorði"
      value={filter.input}
      onChange={(value) => setFilter({ ...filter, input: value })}
    />
    <FilterMultiChoice
      labelClear="Hreinsa val"
      categories={categories}
      onChange={(event) =>
        setFilter({
          ...filter,
          [event.categoryId]: event.selected,
        })
      }
      onClear={(categoryId) =>
        setFilter({
          ...filter,
          [categoryId]: [],
        })
      }
    />
  </Filter>
)

export default FilterMenu
