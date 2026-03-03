import { Filter, FilterMultiChoice } from '@island.is/island-ui/core'

import { SelectedFilters } from '../../hooks/useSecondarySchoolFilters'
import { m } from '../../messages/messages'

interface FilterSectionProps {
  variant: 'default' | 'dialog'
  filterCategories: Array<{
    id: string
    label: string
    selected: string[]
    filters: Array<{
      value: string
      label: string
    }>
  }>
  selectedFilters: SelectedFilters
  updateFilter: (category: keyof SelectedFilters, selected: string[]) => void
  clearFilter: (category: keyof SelectedFilters) => void
  handleClearAll: () => void
  resultCount: number
  formatMessage: (descriptor: { id: string; defaultMessage: string }) => string
  usePopoverDiscloureButtonStyling?: boolean
}

export const FilterSection = ({
  variant,
  filterCategories,
  selectedFilters,
  updateFilter,
  clearFilter,
  handleClearAll,
  resultCount,
  formatMessage,
  usePopoverDiscloureButtonStyling,
}: FilterSectionProps) => {
  return (
    <Filter
      resultCount={resultCount}
      variant={variant}
      usePopoverDiscloureButtonStyling={usePopoverDiscloureButtonStyling}
      labelClear={formatMessage(m.search.clear)}
      labelClearAll={formatMessage(m.search.clearAllFilters)}
      labelOpen={formatMessage(m.search.open)}
      labelClose={formatMessage(m.search.close)}
      labelResult={formatMessage(m.search.showResults)}
      labelTitle={formatMessage(m.search.filterResults)}
      onFilterClear={handleClearAll}
    >
      <FilterMultiChoice
        labelClear={formatMessage(m.search.clearFilter)}
        onChange={({ categoryId, selected }) => {
          updateFilter(categoryId as keyof typeof selectedFilters, selected)
        }}
        onClear={(categoryId) => {
          clearFilter(categoryId as keyof typeof selectedFilters)
        }}
        categories={filterCategories}
      />
    </Filter>
  )
}
