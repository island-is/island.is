import type { SdfSearchAnswer } from '@island.is/application/types'
import { AsyncSearch, Box, InputError } from '@island.is/island-ui/core'
import { useEffect, useRef } from 'react'
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
  // Downshift can call several handlers in one event before the next render,
  // so handlers read the latest answer from this ref instead of the render
  // closure. It is updated on every publish and whenever the parent passes a
  // new value.
  const latestAnswerRef = useRef<Record<string, unknown>>(searchValue)
  useEffect(() => {
    latestAnswerRef.current = getObjectAnswer(currentValue)
  }, [currentValue])

  const clearPendingSearch = () => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current)
      searchDebounceRef.current = null
    }
  }
  useEffect(() => clearPendingSearch, [])

  const publishAnswer = (nextValue: SdfSearchAnswer) => {
    latestAnswerRef.current = nextValue
    handleChange(nextValue)
  }

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
            // Each change replaces the whole value under the field id, so
            // no other stored keys are carried over.
            const nextValue: SdfSearchAnswer = selection
              ? {
                  value: selection.value,
                  label: selectedOption?.label ?? selection.label ?? '',
                  query: selectedOption?.label ?? selection.label ?? '',
                }
              : { query: '' }
            // A pending search was scheduled with the previous answer; letting
            // it run would send that answer and overwrite this selection.
            clearPendingSearch()
            publishAnswer(nextValue)
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
          onInputValueChange={(nextQuery: string, { selectedItem }) => {
            const latestValue = getStringAnswerValue(
              latestAnswerRef.current,
              'value',
            )
            const latestLabel = getStringAnswerValue(
              latestAnswerRef.current,
              'label',
            )
            // Selecting a new item sets the input to its label and calls this
            // handler before `onChange`, with `selectedItem` already set to
            // the new item. `onChange` publishes that selection, so this
            // handler must neither publish the previous one nor start a
            // search. Otherwise `selectedItem` is Downshift's existing
            // selection (null, or the item whose value is already stored),
            // so typing, even the selected item's exact label, still
            // publishes the query.
            // This relies on Downshift (v5) calling `onInputValueChange`
            // before `onChange` on selection; recheck it when upgrading.
            const isNewSelection =
              selectedItem != null &&
              nextQuery === selectedItem.label &&
              selectedItem.value !== latestValue
            if (isNewSelection) {
              return
            }

            // Replaces the whole answer, as in `onChange` above.
            const nextValue: SdfSearchAnswer = {
              ...(latestValue ? { value: latestValue } : {}),
              ...(latestLabel ? { label: latestLabel } : {}),
              query: nextQuery,
            }
            clearPendingSearch()
            publishAnswer(nextValue)
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
        {selectedValue && (
          <input type="hidden" value={selectedValue} readOnly />
        )}
      </Box>
    </Box>
  )
}
