import React from 'react'

import {
  Accordion,
  AccordionItem,
  Box,
  Button,
  Checkbox,
  Hidden,
} from '@island.is/island-ui/core'

import * as styles from '../Index.css'

interface FilterOption {
  value: string
  label: string
}

interface FilterCategory {
  id?: string
  field: string
  label: string
  options?: Array<FilterOption | string>
}

interface TranslationFn {
  (key: string, fallback: string): string
}

interface FilterSidebarProps {
  filterOptions: FilterCategory[]
  filters: Record<string, string[]>
  isOpen: boolean[]
  onFilterChange: (filterKey: string, filterValue: string, checked: boolean) => void
  onClearFilterType: (filterKey: string) => void
  onClearAllFilters: () => void
  onToggleIsOpen: (index: number, value: boolean) => void
  onToggleOpenAll: () => void
  onToggleCloseAll: () => void
  areAnyFiltersOpen: () => boolean
  n: TranslationFn
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filterOptions,
  filters,
  isOpen,
  onFilterChange,
  onClearFilterType,
  onClearAllFilters,
  onToggleIsOpen,
  onToggleOpenAll,
  onToggleCloseAll,
  areAnyFiltersOpen,
  n,
}) => {
  return (
    <Box>
      <Hidden below="md">
        <Box
          height="full"
          className={styles.filterWrapper}
          display="flex"
          flexDirection="column"
          paddingTop={0}
        >
          <Box
            display="inline"
            style={{ alignSelf: 'flex-end' }}
            marginBottom={1}
          >
            <Button
              variant="text"
              icon={areAnyFiltersOpen() ? 'remove' : 'add'}
              size="small"
              onClick={() =>
                areAnyFiltersOpen() ? onToggleCloseAll() : onToggleOpenAll()
              }
            >
              {areAnyFiltersOpen()
                ? n('closeAllFilters', 'Loka öllum síum')
                : n('openAllFilters', 'Opna allar síur')}
            </Button>
          </Box>
          <Accordion
            singleExpand={false}
            dividerOnTop={false}
            dividerOnBottom={false}
          >
            {filterOptions.map((filter, index) => {
              const filterField = filter.field
              const selectedValues = filters[filterField] || []
              return (
                <AccordionItem
                  key={filter.id || filter.field}
                  id={filter.field}
                  label={filter.label}
                  labelVariant="h5"
                  iconVariant="small"
                  expanded={isOpen[index] ?? false}
                  onToggle={(isOpenValue) => onToggleIsOpen(index, isOpenValue)}
                >
                  <Box paddingY={1}>
                    {filter.options?.slice(0, 10).map((option) => {
                      const optionValue = typeof option === 'string' ? option : option.value
                      const optionLabel = typeof option === 'string' ? option : option.label
                      return (
                        <Box paddingY={1} key={optionValue}>
                          <Checkbox
                            label={optionLabel}
                            checked={selectedValues.includes(optionValue)}
                            onChange={(e) =>
                              onFilterChange(
                                filter.field,
                                optionValue,
                                e.target.checked,
                              )
                            }
                          />
                        </Box>
                      )
                    })}
                    {selectedValues.length > 0 && (
                      <Box paddingTop={2} display="flex" justifyContent="flexEnd">
                        <Button
                          variant="text"
                          size="small"
                          icon="reload"
                          onClick={() => onClearFilterType(filter.field)}
                        >
                          {n('clearSelection', 'Hreinsa val')}
                        </Button>
                      </Box>
                    )}
                  </Box>
                </AccordionItem>
              )
            })}
          </Accordion>
          <Box
            background="blue100"
            width="full"
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            style={{ height: 72 }}
          >
            <Button
              variant="text"
              icon="reload"
              size="small"
              onClick={onClearAllFilters}
            >
              {n('clearAllFilters', 'Hreinsa allar síur')}
            </Button>
          </Box>
        </Box>
      </Hidden>
    </Box>
  )
}

export default FilterSidebar
