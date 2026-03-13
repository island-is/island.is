/**
 * Ported from: libs/portals/admin/regulations-admin/src/components/impacts/ImpactAmendingSelection.tsx
 *
 * Async search input for finding regulations to amend (for breytingareglugerð).
 * Users type a regulation number (e.g. "438/2022") and results are fetched.
 *
 * Key adaptations:
 * - Removed direct GraphQL lazy query — uses onSearch callback prop
 * - Parent component provides search results
 * - Simplified option formatting
 */
import { useState, useEffect } from 'react'
import { AsyncSearch, Text } from '@island.is/island-ui/core'
import { useDebounce } from 'react-use'
import * as s from './Impacts.css'

// ---------------------------------------------------------------------------

export type SelRegOption = {
  value: string
  label: string
  type?: string
  disabled?: boolean
  migrated?: boolean
}

type ImpactAmendingSelectionProps = {
  /** Callback when a regulation is selected */
  onSelect: (option: SelRegOption) => void
  /** Callback to search for regulations — parent handles the GraphQL query */
  onSearch: (query: string) => void
  /** Search results from parent */
  searchResults?: SelRegOption[]
  /** Whether the search is in progress */
  loading?: boolean
}

export const ImpactAmendingSelection = ({
  onSelect,
  onSearch,
  searchResults,
  loading,
}: ImpactAmendingSelectionProps) => {
  const [value, setValue] = useState<string | undefined>()
  const [isSearching, setIsSearching] = useState(false)

  useDebounce(
    () => {
      if (value && value.length > 0) {
        setIsSearching(true)
        onSearch(value)
      } else {
        setIsSearching(false)
      }
    },
    600,
    [value],
  )

  useEffect(() => {
    if (searchResults) {
      setIsSearching(false)
    }
  }, [searchResults])

  const updateValue = (val: string) => {
    setIsSearching(val !== value)
    setValue(val)
  }

  const options: SelRegOption[] = searchResults ?? []

  return (
    <div className={s.amendingSelectionOption}>
      <Text variant="eyebrow" color="blue400" marginBottom={1}>
        Reglugerð sem breytist
      </Text>
      <AsyncSearch
        placeholder="Sláðu inn númer stofnreglugerðar (Dæmi: 438/2022)"
        onInputValueChange={(newValue) => updateValue(newValue)}
        loading={loading || isSearching}
        onSubmit={(newValue) => {
          updateValue(newValue)
        }}
        options={options}
        inputValue={value}
        initialInputValue={undefined}
        onChange={(option) => {
          if (option && !('disabled' in option && option.disabled)) {
            onSelect(option as SelRegOption)
          }
        }}
      />
    </div>
  )
}
