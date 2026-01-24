import React from 'react'

import {
  Box,
  Button,
  Filter,
  FilterMultiChoice,
  Hidden,
  Input,
  Tag,
  Text,
} from '@island.is/island-ui/core'

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

interface SearchSectionProps {
  query: string
  onQueryChange: (query: string) => void
  filters: Record<string, string[]>
  filterOptions: FilterCategory[]
  onRemoveTag: (filterKey: string, value: string) => void
  onClearAllFilters: () => void
  onFilterTypeChange: (filterKey: string, values: string[]) => void
  onClearFilterType: (filterKey: string) => void
  totalCount: number
  n: TranslationFn
  titleRef: React.RefObject<HTMLDivElement>
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  query,
  onQueryChange,
  filters,
  filterOptions,
  onRemoveTag,
  onClearAllFilters,
  onFilterTypeChange,
  onClearFilterType,
  totalCount,
  n,
  titleRef,
}) => {
  return (
    <>
      <Text
        ref={titleRef}
        marginTop={0}
        marginBottom={2}
        variant="h2"
        as="h2"
        lineHeight="xs"
      >
        {n('searchTitle', 'Leitaðu að gögnum')}
      </Text>
      <Input
        placeholder={n('searchPlaceholder', 'Leitarorð')}
        id="searchOpenData"
        name="filterInput"
        value={query}
        backgroundColor="blue"
        onChange={(e) => onQueryChange(e.target.value)}
      />
      <Box
        paddingTop={2}
        display="flex"
        justifyContent="spaceBetween"
        flexWrap="wrap"
      >
        <Box
          display="flex"
          style={{ gap: '0.5rem', minHeight: '2rem' }}
          flexWrap="wrap"
        >
          {Object.keys(filters).map((key) =>
            (filters[key] || []).map((tag) => (
              <Tag key={`${key}-${tag}`}>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  style={{ gap: '0.5rem' }}
                >
                  <span>{tag}</span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveTag(key, tag)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        e.stopPropagation()
                        onRemoveTag(key, tag)
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    aria-label={`Remove ${tag}`}
                  >
                    ×
                  </span>
                </Box>
              </Tag>
            )),
          )}
        </Box>
        <Box style={{ flexShrink: 0 }}>
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

      <Hidden above="md">
        <Box width="full" marginTop={2}>
          <Filter
            resultCount={totalCount}
            variant="dialog"
            labelClear="Hreinsa"
            labelClearAll="Hreinsa allar síur"
            labelOpen="Opna"
            labelClose="Loka"
            labelResult="Sýna niðurstöður"
            labelTitle="Sía niðurstöður"
            onFilterClear={onClearAllFilters}
          >
            <FilterMultiChoice
              labelClear="Hreinsa val"
              onChange={({ categoryId, selected }) => {
                onFilterTypeChange(categoryId, selected)
              }}
              onClear={(categoryId) => {
                onClearFilterType(categoryId)
              }}
              categories={filterOptions.map((filter) => {
                const filterField = filter.field
                return {
                  id: filter.field,
                  label: filter.label,
                  selected: filters[filterField] || [],
                  filters: (filter.options || []).map((option) => {
                    const optionValue = typeof option === 'string' ? option : option.value
                    const optionLabel = typeof option === 'string' ? option : option.label
                    return {
                      value: optionValue,
                      label: optionLabel,
                    }
                  }),
                }
              })}
            />
          </Filter>
        </Box>
      </Hidden>
    </>
  )
}

export default SearchSection
