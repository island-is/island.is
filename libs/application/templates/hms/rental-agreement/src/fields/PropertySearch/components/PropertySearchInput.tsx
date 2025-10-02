import { Controller } from 'react-hook-form'
import { AsyncSearch } from '@island.is/island-ui/core'
import { AddressProps } from '../../../shared'
import { useLocale } from '@island.is/localization'
import { useCallback, useRef } from 'react'
import * as m from '../../../lib/messages'

type Props = {
  searchOptions: AddressProps[]
  id: string
  selectedAddress: AddressProps | undefined
  searchTerm: string
  handleAddressSelectionChange: (selection: { value: string } | null) => void
  setSearchTerm: (searchTerm: string) => void
  onSearchTermChange: (searchTerm: string) => void
  searchLoading: boolean
  propertycodeLoading: boolean
}

const DEBOUNCE_TIME = 300 // 300ms debounce delay
const MIN_SEARCH_LENGTH = 3 // Minimum characters required for search

export const PropertySearchInput = ({
  searchOptions,
  id,
  selectedAddress,
  searchTerm,
  handleAddressSelectionChange,
  setSearchTerm,
  onSearchTermChange,
  searchLoading,
  propertycodeLoading,
}: Props) => {
  const { formatMessage } = useLocale()
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const debouncedSearchTermChange = useCallback(
    (newValue: string) => {
      // Clear existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }

      setSearchTerm(newValue)

      // Only search if the string is long enough
      if (newValue.length >= MIN_SEARCH_LENGTH) {
        // Set new timeout for the actual search
        debounceTimeoutRef.current = setTimeout(() => {
          onSearchTermChange(newValue)
        }, DEBOUNCE_TIME)
      } else if (newValue.length === 0) {
        // Clear search results when input is empty
        onSearchTermChange(newValue)
      }
      // For strings 1-2 characters, do nothing (no search)
    },
    [setSearchTerm, onSearchTermChange],
  )

  return (
    <Controller
      name={`${id}`}
      defaultValue={{}}
      render={() => {
        return (
          <AsyncSearch
            options={searchOptions}
            placeholder={formatMessage(
              m.propertySearch.search.propertySearchPlaceholder,
            )}
            initialInputValue={selectedAddress ? selectedAddress.label : ''}
            inputValue={searchTerm}
            closeMenuOnSubmit
            openMenuOnFocus
            size="large"
            colored
            onChange={(selection: { value: string } | null) => {
              handleAddressSelectionChange(selection)
            }}
            onInputValueChange={debouncedSearchTermChange}
            loading={searchLoading || propertycodeLoading}
          />
        )
      }}
    />
  )
}
