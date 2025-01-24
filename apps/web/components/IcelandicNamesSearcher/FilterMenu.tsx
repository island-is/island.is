import React, { Dispatch, ReactNode, SetStateAction } from 'react'

import {
  Filter,
  FilterInput,
  FilterMultiChoice,
  FilterProps,
} from '@island.is/island-ui/core'

export type FilterOptions = {
  kyn: Array<string>
  stada: Array<string>
  upphafsstafur: Array<string>
  input: string
}

export const initialFilter: FilterOptions = {
  kyn: [],
  stada: [],
  upphafsstafur: [],
  input: '',
}

interface FilterMenuProps {
  categories: ReadonlyArray<CategoriesProps>
  filter: FilterOptions
  setFilter: Dispatch<SetStateAction<FilterOptions>>
  setSearchQuery: Dispatch<SetStateAction<string>>
  resultCount: number
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
  setSearchQuery,
  resultCount,
  labelClear = 'Hreinsa síu',
  labelClearAll = 'Hreinsa allar síur',
  labelOpen = 'Sía niðurstöður',
  labelClose = 'Loka síu',
  labelTitle = 'Sía stofnanir',
  labelResult = 'Sýna niðurstöður',
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
    resultCount={resultCount}
    variant={variant}
    align={align}
    reverse
    filterInput={
      <FilterInput
        name="filter-input"
        backgroundColor="blue"
        placeholder={inputPlaceholder}
        value={filter.input}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            setSearchQuery((event.target as HTMLInputElement).value)
          }
        }}
        onChange={(value) =>
          setFilter({
            ...filter,
            upphafsstafur: [],
            input: value,
          })
        }
      />
    }
    onFilterClear={() =>
      setFilter({ kyn: [], stada: [], upphafsstafur: [], input: '' })
    }
  >
    <FilterMultiChoice
      labelClear={labelClear}
      categories={categories}
      onChange={(event) => {
        const selectedInitialLetter =
          event.categoryId === 'upphafsstafur' && event.selected.length

        if (selectedInitialLetter) {
          setSearchQuery('')
        }

        setFilter({
          ...filter,
          [event.categoryId]: event.selected,
          ...(selectedInitialLetter && { input: '' }),
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
