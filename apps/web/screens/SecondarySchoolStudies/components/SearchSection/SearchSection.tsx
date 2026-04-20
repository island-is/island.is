import { ReactNode, RefObject } from 'react'

import { Box, Button, Icon, Input, Tag, Text } from '@island.is/island-ui/core'

import { SelectedFilters } from '../../hooks/useSecondarySchoolFilters'
import { m } from '../../messages/messages'

interface SearchSectionProps {
  titleRef: RefObject<HTMLDivElement>
  inputValue: string
  handleSearchInput: (value: string) => void
  selectedFilters: SelectedFilters
  formatFilterLabel: (
    categoryId: keyof SelectedFilters,
    value: string,
  ) => ReactNode
  handleRemoveFilter: (categoryId: keyof SelectedFilters, value: string) => void
  handleClearAll: () => void
  formatMessage: (descriptor: { id: string; defaultMessage: string }) => string
}

export const SearchSection = ({
  titleRef,
  inputValue,
  handleSearchInput,
  selectedFilters,
  formatFilterLabel,
  handleRemoveFilter,
  handleClearAll,
  formatMessage,
}: SearchSectionProps) => {
  return (
    <Box display={'flex'} rowGap={2} flexDirection={'column'}>
      <Box ref={titleRef} tabIndex={-1}>
        <Text variant="h2" as="h2" lineHeight="xs">
          {formatMessage(m.search.searchResults)}
        </Text>
      </Box>
      <Input
        placeholder={formatMessage(m.search.searchPrograms)}
        id="searchprogrammes"
        name="filterInput"
        value={inputValue}
        icon={{ name: 'search' }}
        backgroundColor="blue"
        onChange={(e) => {
          handleSearchInput(e.target.value)
        }}
      />
      <Box display={'flex'} justifyContent={'spaceBetween'}>
        <Box
          display={'flex'}
          style={{ gap: '0.5rem', minHeight: '2rem' }}
          flexWrap={'wrap'}
        >
          {Object.keys(selectedFilters).map((key) =>
            selectedFilters[key as keyof typeof selectedFilters].map(
              (value) => (
                <Tag key={`${key}-${value}`}>
                  <Box
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    style={{ gap: '0.5rem' }}
                  >
                    {formatFilterLabel(
                      key as keyof typeof selectedFilters,
                      value,
                    )}
                    <button
                      aria-label="remove tag"
                      style={{ alignSelf: 'end' }}
                      onClick={() =>
                        handleRemoveFilter(
                          key as keyof typeof selectedFilters,
                          value,
                        )
                      }
                    >
                      <Icon icon={'close'} size="small" />
                    </button>
                  </Box>
                </Tag>
              ),
            ),
          )}
        </Box>
        <Box style={{ flexShrink: 0 }}>
          <Button
            variant="text"
            icon="reload"
            size="small"
            onClick={handleClearAll}
          >
            {formatMessage(m.search.clearAllFilters)}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
