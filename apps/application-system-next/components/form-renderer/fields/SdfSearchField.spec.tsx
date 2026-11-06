import React, { act } from 'react'
import TestRenderer from 'react-test-renderer'

import { SdfSearchField } from './SdfSearchField'

const asyncSearchProps: Array<Record<string, unknown>> = []

jest.mock('@island.is/island-ui/core', () => ({
  Box: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  InputError: () => null,
  AsyncSearch: (props: Record<string, unknown>) => {
    asyncSearchProps.push(props)
    return null
  },
}))

type Selection = { value: string; label?: string } | null
type Option = { value: string; label: string }

// Unmounted after each test so rendered trees don't pile up.
const renderers: TestRenderer.ReactTestRenderer[] = []

const latestAsyncSearchProps = () =>
  asyncSearchProps[asyncSearchProps.length - 1]

const renderSearchField = ({
  currentValue,
  onSelectRefetchTemplateApis,
  searchAction,
  minQueryLength,
  refetchTargets,
}: {
  currentValue: unknown
  onSelectRefetchTemplateApis?: string[]
  searchAction?: string
  minQueryLength?: number
  refetchTargets?: string[]
}) => {
  const handleChange = jest.fn()
  const dispatch = jest.fn()

  const renderField = (value: unknown) => (
    <SdfSearchField
      component={{
        __typename: 'SdfSearchField',
        id: 'search',
        label: 'Search',
        options: [{ value: 'v2', label: 'Option 2' }],
        onSelectRefetchTemplateApis,
        searchAction,
        minQueryLength,
        refetchTargets,
      }}
      currentValue={value}
      answers={{}}
      onAnswerChange={jest.fn()}
      handleChange={handleChange}
      dispatch={dispatch}
      pendingRefetchTargets={[]}
      isRefetchPending={false}
    />
  )

  let renderer!: TestRenderer.ReactTestRenderer
  // `TestRenderer.create` renders asynchronously; wrap it in act() so the
  // tree is committed before asserting.
  act(() => {
    renderer = TestRenderer.create(renderField(currentValue))
  })
  renderers.push(renderer)

  // The handlers are read from the latest render at call time. `handleChange`
  // is a mock and does not re-render, so calls made before `rerender` use the
  // same render's handlers, as several Downshift callbacks in one event do.
  const select = (selection: Selection) =>
    (latestAsyncSearchProps().onChange as (selection: Selection) => void)(
      selection,
    )
  // Downshift passes its current selection as `selectedItem`.
  const type = (query: string, selectedItem: Option | null = null) =>
    (
      latestAsyncSearchProps().onInputValueChange as (
        query: string,
        stateAndHelpers: { selectedItem: Option | null },
      ) => void
    )(query, { selectedItem })

  return {
    handleChange,
    dispatch,
    select,
    type,
    // Downshift's order when an item is picked: the input changes to the
    // item's label (with `selectedItem` already set to it), then `onChange`.
    selectItem: (option: Option) => {
      type(option.label, option)
      select(option)
    },
    rerender: (value: unknown) => {
      act(() => {
        renderer.update(renderField(value))
      })
    },
    unmount: () => {
      act(() => {
        renderer.unmount()
      })
      renderers.splice(renderers.indexOf(renderer), 1)
    },
  }
}

const option2 = { value: 'v2', label: 'Option 2' }
const selectedOption2 = { value: 'v2', label: 'Option 2', query: 'Option 2' }

const valueWithExtraKey = {
  value: 'v',
  label: 'L',
  query: 'L',
  addressCode: 'x',
}

describe('SdfSearchField', () => {
  beforeEach(() => {
    asyncSearchProps.length = 0
  })

  afterEach(() => {
    act(() => {
      renderers.forEach((renderer) => renderer.unmount())
    })
    renderers.length = 0
  })

  it('publishes only value, label and query on select', () => {
    const { handleChange, select } = renderSearchField({
      currentValue: valueWithExtraKey,
    })

    select({ value: 'v2', label: 'ignored' })

    expect(handleChange).toHaveBeenCalledWith({
      value: 'v2',
      label: 'Option 2',
      query: 'Option 2',
    })
  })

  it('falls back to the selection label for a value not in options', () => {
    const { handleChange, select } = renderSearchField({
      currentValue: valueWithExtraKey,
    })

    select({ value: 'unknown', label: 'Typed' })

    expect(handleChange).toHaveBeenCalledWith({
      value: 'unknown',
      label: 'Typed',
      query: 'Typed',
    })
  })

  it('publishes an empty label and query for a selection with no label and no matching option', () => {
    const { handleChange, select } = renderSearchField({
      currentValue: valueWithExtraKey,
    })

    select({ value: 'unknown' })

    expect(handleChange).toHaveBeenCalledWith({
      value: 'unknown',
      label: '',
      query: '',
    })
  })

  it('keeps value and label and updates query while typing', () => {
    const { handleChange, type } = renderSearchField({
      currentValue: valueWithExtraKey,
    })

    type('Lau')

    expect(handleChange).toHaveBeenCalledWith({
      value: 'v',
      label: 'L',
      query: 'Lau',
    })
  })

  it('publishes only the query while typing when nothing is selected', () => {
    const { handleChange, type } = renderSearchField({
      currentValue: {},
    })

    type('Lau')

    expect(handleChange).toHaveBeenCalledWith({ query: 'Lau' })
  })

  it('publishes an empty query on clear', () => {
    const { handleChange, select } = renderSearchField({
      currentValue: valueWithExtraKey,
    })

    select(null)

    expect(handleChange).toHaveBeenCalledWith({ query: '' })
  })

  it('refetches with the selected value when onSelectRefetchTemplateApis is set', () => {
    const { dispatch, select } = renderSearchField({
      currentValue: valueWithExtraKey,
      onSelectRefetchTemplateApis: ['fetchProperty'],
      refetchTargets: ['t'],
    })

    select({ value: 'v2' })

    expect(dispatch).toHaveBeenCalledWith(
      'REFETCH',
      { search: { value: 'v2', label: 'Option 2', query: 'Option 2' } },
      undefined,
      undefined,
      ['fetchProperty'],
      ['t'],
    )
  })

  it('refetches with an empty query on clear when onSelectRefetchTemplateApis is set', () => {
    const { dispatch, select } = renderSearchField({
      currentValue: valueWithExtraKey,
      onSelectRefetchTemplateApis: ['fetchProperty'],
      refetchTargets: ['t'],
    })

    select(null)

    expect(dispatch).toHaveBeenCalledWith(
      'REFETCH',
      { search: { query: '' } },
      undefined,
      undefined,
      ['fetchProperty'],
      ['t'],
    )
  })

  it('does not dispatch on select when onSelectRefetchTemplateApis is not set', () => {
    const { dispatch, select } = renderSearchField({
      currentValue: valueWithExtraKey,
    })

    select({ value: 'v2' })

    expect(dispatch).not.toHaveBeenCalled()
  })

  it('publishes only the new selection when an item is selected', () => {
    const { handleChange, selectItem } = renderSearchField({
      currentValue: valueWithExtraKey,
    })

    selectItem(option2)

    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith(selectedOption2)
  })

  it('keeps a selection when the input changes again before re-rendering', () => {
    const { handleChange, selectItem, type } = renderSearchField({
      currentValue: valueWithExtraKey,
    })

    selectItem(option2)
    type('Opt', option2)

    expect(handleChange).toHaveBeenLastCalledWith({
      value: 'v2',
      label: 'Option 2',
      query: 'Opt',
    })
  })

  it('keeps value and label passed in by a later render while typing', () => {
    const { handleChange, rerender, type } = renderSearchField({
      currentValue: valueWithExtraKey,
    })

    rerender({ value: 's', label: 'S', query: 'S' })
    type('Sta')

    expect(handleChange).toHaveBeenCalledWith({
      value: 's',
      label: 'S',
      query: 'Sta',
    })
  })

  it("publishes the query when typing the selected item's exact label", () => {
    const { handleChange, type } = renderSearchField({
      currentValue: { value: 'v2', label: 'Option 2', query: 'Option ' },
    })

    type('Option 2', option2)

    expect(handleChange).toHaveBeenCalledWith(selectedOption2)
  })

  describe('search refetch while typing', () => {
    // Unless a test sets minQueryLength, the default of 3 applies.
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.clearAllTimers()
      jest.useRealTimers()
    })

    it('refetches once with the typed query after 300 ms', () => {
      const { dispatch, type } = renderSearchField({
        currentValue: valueWithExtraKey,
        searchAction: 'searchAddresses',
      })

      type('Lau')
      jest.advanceTimersByTime(299)

      expect(dispatch).not.toHaveBeenCalled()

      jest.advanceTimersByTime(1)

      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(dispatch).toHaveBeenCalledWith(
        'REFETCH',
        { search: { value: 'v', label: 'L', query: 'Lau' } },
        undefined,
        undefined,
        ['searchAddresses'],
        undefined,
      )
    })

    it('refetches only for the last query when typing quickly', () => {
      const { dispatch, type } = renderSearchField({
        currentValue: valueWithExtraKey,
        searchAction: 'searchAddresses',
      })

      type('Lau')
      jest.advanceTimersByTime(200)
      type('Laug')
      jest.advanceTimersByTime(200)
      type('Lauga')
      jest.advanceTimersByTime(300)

      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(dispatch).toHaveBeenCalledWith(
        'REFETCH',
        { search: { value: 'v', label: 'L', query: 'Lauga' } },
        undefined,
        undefined,
        ['searchAddresses'],
        undefined,
      )
    })

    it('does not refetch while typing when no searchAction is set', () => {
      const { dispatch, type } = renderSearchField({
        currentValue: valueWithExtraKey,
      })

      type('Lau')
      jest.advanceTimersByTime(1000)

      expect(dispatch).not.toHaveBeenCalled()
    })

    it('does not refetch for a query shorter than minQueryLength', () => {
      const { dispatch, type } = renderSearchField({
        currentValue: valueWithExtraKey,
        searchAction: 'searchAddresses',
      })

      type('La')
      jest.advanceTimersByTime(1000)

      expect(dispatch).not.toHaveBeenCalled()
    })

    it('uses a custom minQueryLength', () => {
      const { dispatch, type } = renderSearchField({
        currentValue: valueWithExtraKey,
        searchAction: 'searchAddresses',
        minQueryLength: 5,
      })

      type('Laug')
      jest.advanceTimersByTime(1000)

      expect(dispatch).not.toHaveBeenCalled()

      type('Lauga')
      jest.advanceTimersByTime(300)

      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(dispatch).toHaveBeenCalledWith(
        'REFETCH',
        { search: { value: 'v', label: 'L', query: 'Lauga' } },
        undefined,
        undefined,
        ['searchAddresses'],
        undefined,
      )
    })

    it('refetches with an empty query when the input is cleared', () => {
      const { dispatch, type } = renderSearchField({
        currentValue: valueWithExtraKey,
        searchAction: 'searchAddresses',
      })

      type('')
      jest.advanceTimersByTime(300)

      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(dispatch).toHaveBeenCalledWith(
        'REFETCH',
        { search: { value: 'v', label: 'L', query: '' } },
        undefined,
        undefined,
        ['searchAddresses'],
        undefined,
      )
    })

    it('refetches once with "Lau" after typing "La" then "Lau"', () => {
      const { dispatch, type } = renderSearchField({
        currentValue: valueWithExtraKey,
        searchAction: 'searchAddresses',
      })

      type('La')
      jest.advanceTimersByTime(200)
      type('Lau')
      jest.advanceTimersByTime(1000)

      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(dispatch).toHaveBeenCalledWith(
        'REFETCH',
        { search: { value: 'v', label: 'L', query: 'Lau' } },
        undefined,
        undefined,
        ['searchAddresses'],
        undefined,
      )
    })

    it('does not refetch after typing "Lau" then "La"', () => {
      // A query shorter than minQueryLength cancels a pending search and
      // schedules none.
      const { dispatch, type } = renderSearchField({
        currentValue: valueWithExtraKey,
        searchAction: 'searchAddresses',
      })

      type('Lau')
      jest.advanceTimersByTime(200)
      type('La')
      jest.advanceTimersByTime(1000)

      expect(dispatch).not.toHaveBeenCalled()
    })

    it('refetches once with "Lau" after typing "Lau", "La" then "Lau"', () => {
      const { dispatch, type } = renderSearchField({
        currentValue: valueWithExtraKey,
        searchAction: 'searchAddresses',
      })

      type('Lau')
      jest.advanceTimersByTime(200)
      type('La')
      jest.advanceTimersByTime(200)
      type('Lau')
      jest.advanceTimersByTime(1000)

      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(dispatch).toHaveBeenCalledWith(
        'REFETCH',
        { search: { value: 'v', label: 'L', query: 'Lau' } },
        undefined,
        undefined,
        ['searchAddresses'],
        undefined,
      )
    })

    it('refetches once with an empty query after typing "Lau" then clearing', () => {
      const { dispatch, type } = renderSearchField({
        currentValue: valueWithExtraKey,
        searchAction: 'searchAddresses',
      })

      type('Lau')
      jest.advanceTimersByTime(200)
      type('')
      jest.advanceTimersByTime(1000)

      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(dispatch).toHaveBeenCalledWith(
        'REFETCH',
        { search: { value: 'v', label: 'L', query: '' } },
        undefined,
        undefined,
        ['searchAddresses'],
        undefined,
      )
    })

    it('does not search with the previous answer when an item is selected', () => {
      const { handleChange, dispatch, selectItem } = renderSearchField({
        currentValue: valueWithExtraKey,
        searchAction: 'searchAddresses',
      })

      selectItem(option2)
      jest.advanceTimersByTime(1000)

      expect(handleChange).toHaveBeenLastCalledWith(selectedOption2)
      expect(dispatch).not.toHaveBeenCalled()
    })

    it('dispatches only the select refetch when an item is selected', () => {
      const { dispatch, selectItem } = renderSearchField({
        currentValue: valueWithExtraKey,
        searchAction: 'searchAddresses',
        onSelectRefetchTemplateApis: ['fetchProperty'],
        refetchTargets: ['t'],
      })

      selectItem(option2)
      jest.advanceTimersByTime(1000)

      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(dispatch).toHaveBeenCalledWith(
        'REFETCH',
        { search: selectedOption2 },
        undefined,
        undefined,
        ['fetchProperty'],
        ['t'],
      )
    })

    it('cancels a pending search when an item is selected', () => {
      const { dispatch, select, type } = renderSearchField({
        currentValue: valueWithExtraKey,
        searchAction: 'searchAddresses',
      })

      type('Lau')
      jest.advanceTimersByTime(200)
      select(option2)
      jest.advanceTimersByTime(1000)

      expect(dispatch).not.toHaveBeenCalled()
    })

    it('cancels a pending search on unmount', () => {
      const { dispatch, type, unmount } = renderSearchField({
        currentValue: valueWithExtraKey,
        searchAction: 'searchAddresses',
      })

      type('Lau')
      unmount()
      jest.advanceTimersByTime(1000)

      expect(dispatch).not.toHaveBeenCalled()
    })
  })
})
