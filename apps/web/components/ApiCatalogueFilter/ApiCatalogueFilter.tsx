import {
  Filter,
  FilterInput,
  FilterMultiChoice,
} from '@island.is/island-ui/core'
import React from 'react'

type FilterCategory = {
  /** Id for the category. */
  id: string
  /** The category label to display on screen. */
  label: string
  /** The array of currently selected active filters. */
  selected: Array<string>
  /** Array of available filters in this category. */
  filters: Array<FilterItem>
}

type FilterItem = {
  value: string
  label: string
}

interface ApiCatalogueFilterProps {
  isDialog?: boolean
  labelClear: string
  labelOpen: string
  labelClose: string
  labelResult: string
  labelTitle: string
  resultCount: number
  onFilterClear: () => void
  inputPlaceholder: string
  inputValue: string
  onInputChange: (any) => void
  labelCategoryClear: string
  onCategoryChange: (any) => void
  onCategoryClear: (any) => void
  categories: Array<FilterCategory>
}

export const ApiCatalogueFilter: React.FC<ApiCatalogueFilterProps> = ({
  isDialog = false,
  labelClear,
  labelOpen,
  labelClose,
  labelResult,
  labelTitle,
  resultCount,
  onFilterClear,
  inputPlaceholder,
  inputValue,
  onInputChange,
  labelCategoryClear,
  onCategoryChange,
  onCategoryClear,
  categories,
}) => {
  return (
    <Filter
      labelClear={labelClear}
      labelOpen={labelOpen}
      labelClose={labelClose}
      labelResult={labelResult}
      labelTitle={labelTitle}
      isDialog={isDialog}
      resultCount={resultCount}
      onFilterClear={onFilterClear}
    >
      <FilterInput
        placeholder={inputPlaceholder}
        name="filterInput"
        value={inputValue}
        onChange={onInputChange}
      ></FilterInput>
      <FilterMultiChoice
        labelClear={labelCategoryClear}
        onChange={onCategoryChange}
        onClear={onCategoryClear}
        categories={categories}
      ></FilterMultiChoice>
    </Filter>
  )
}
