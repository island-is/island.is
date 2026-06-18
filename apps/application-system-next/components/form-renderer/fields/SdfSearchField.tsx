import { AsyncSearch, Box, InputError } from '@island.is/island-ui/core'
import { useRef } from 'react'
import {
  SDF_FIELD_CONTROL_PADDING_TOP,
  getSdfFieldMargins,
} from '../../sdfLayoutTokens'
import type { FieldRendererProps } from '../types'
import { getObjectAnswer, getStringAnswerValue } from '../utils'

export const SdfSearchField = ({
  component,
  currentValue,
  error,
  handleChange,
  dispatch,
  pendingRefetchTargets,
}: FieldRendererProps) => {
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchValue = getObjectAnswer(currentValue)
  const selectedValue = getStringAnswerValue(searchValue, 'value')
  const selectedLabel = getStringAnswerValue(searchValue, 'label')
  const query = getStringAnswerValue(searchValue, 'query') || selectedLabel
  const minQueryLength = component.minQueryLength ?? 3
  const searchRefetchPending = (component.refetchTargets ?? []).some((target) =>
    pendingRefetchTargets.includes(target),
  )

  return (
    <Box {...getSdfFieldMargins(component)}>
      <Box paddingTop={SDF_FIELD_CONTROL_PADDING_TOP}>
        <AsyncSearch
          options={component.options ?? []}
          placeholder={component.placeholder ?? ''}
          initialInputValue={selectedLabel}
          inputValue={query}
          closeMenuOnSubmit
          openMenuOnFocus
          size="large"
          colored
          loading={searchRefetchPending}
          onChange={(selection: { value: string; label?: string } | null) => {
            const selectedOption = component.options?.find(
              (option) => option.value === selection?.value,
            )
            const nextValue = selection
              ? {
                  ...searchValue,
                  value: selection.value,
                  label: selectedOption?.label ?? selection.label ?? '',
                  query: selectedOption?.label ?? selection.label ?? '',
                }
              : { query: '' }
            handleChange(nextValue)
            if (component.onSelectRefetchTemplateApis?.length && dispatch) {
              void dispatch(
                'REFETCH',
                component.id ? { [component.id]: nextValue } : undefined,
                undefined,
                undefined,
                component.onSelectRefetchTemplateApis,
                component.refetchTargets,
              )
            }
          }}
          onInputValueChange={(nextQuery: string) => {
            const nextValue = { ...searchValue, query: nextQuery }
            handleChange(nextValue)
            if (searchDebounceRef.current) {
              clearTimeout(searchDebounceRef.current)
            }
            if (
              !dispatch ||
              !component.searchAction ||
              (nextQuery.length > 0 && nextQuery.length < minQueryLength)
            ) {
              return
            }
            searchDebounceRef.current = setTimeout(() => {
              void dispatch(
                'REFETCH',
                component.id ? { [component.id]: nextValue } : undefined,
                undefined,
                undefined,
                [component.searchAction ?? ''],
                undefined,
              )
            }, 300)
          }}
        />
        {error && (
          <Box marginTop={1}>
            <InputError errorMessage={error} />
          </Box>
        )}
        {selectedValue && <input type="hidden" value={selectedValue} readOnly />}
      </Box>
    </Box>
  )
}
