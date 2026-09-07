import { act, fireEvent, render, screen } from '@testing-library/react'

import type { CourtSessionString } from '@island.is/judicial-system-web/src/graphql/schema'
import { IntlProviderWrapper } from '@island.is/judicial-system-web/src/utils/testHelpers'

import { CourtSessionMergedCaseEntries } from './CourtSessionMergedCaseEntries'

const DELAY = 500
const COURT_SESSION_ID = 'court-session-1'
const MERGED_CASE_ID = 'merged-case-1'

describe('CourtSessionMergedCaseEntries', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const advance = (ms: number) => act(() => jest.advanceTimersByTime(ms))

  const renderEntries = (value?: string) => {
    const patchCourtSessionStrings = jest.fn()

    const view = render(
      <IntlProviderWrapper>
        <CourtSessionMergedCaseEntries
          courtSessionId={COURT_SESSION_ID}
          courtCaseNumber="S-1/2025"
          courtSessionString={
            value === undefined ? undefined : ({ value } as CourtSessionString)
          }
          mergedCaseId={MERGED_CASE_ID}
          disabled={false}
          patchCourtSessionStrings={patchCourtSessionStrings}
        />
      </IntlProviderWrapper>,
    )

    return { patchCourtSessionStrings, view }
  }

  const persistedCalls = (patchCourtSessionStrings: jest.Mock) =>
    patchCourtSessionStrings.mock.calls.filter(
      ([, , , options]) => options?.persist,
    )

  const entriesInput = () =>
    screen.getByRole('textbox', {
      name: /Bókanir um sameiningu máls/,
    })

  it('should write optimistically on every keystroke but persist once', () => {
    const { patchCourtSessionStrings } = renderEntries('')

    fireEvent.change(entriesInput(), { target: { value: 'Málin sameinuð' } })

    expect(patchCourtSessionStrings).toHaveBeenCalledWith(
      COURT_SESSION_ID,
      MERGED_CASE_ID,
      { value: 'Málin sameinuð' },
    )
    expect(persistedCalls(patchCourtSessionStrings)).toHaveLength(0)

    advance(DELAY)

    expect(persistedCalls(patchCourtSessionStrings)).toEqual([
      [
        COURT_SESSION_ID,
        MERGED_CASE_ID,
        { value: 'Málin sameinuð' },
        { persist: true },
      ],
    ])
  })

  it('should persist immediately on blur', () => {
    const { patchCourtSessionStrings } = renderEntries('')
    const input = entriesInput()

    fireEvent.change(input, { target: { value: 'Málin sameinuð' } })
    fireEvent.blur(input)

    expect(persistedCalls(patchCourtSessionStrings)).toHaveLength(1)
  })

  it('should not persist on a blur that follows no edit', () => {
    const { patchCourtSessionStrings } = renderEntries('Málin sameinuð')

    fireEvent.blur(entriesInput())

    expect(patchCourtSessionStrings).not.toHaveBeenCalled()
  })

  it('should flush a pending edit on unmount', () => {
    const { patchCourtSessionStrings, view } = renderEntries('')

    fireEvent.change(entriesInput(), { target: { value: 'Málin sameinuð' } })
    view.unmount()

    expect(persistedCalls(patchCourtSessionStrings)).toEqual([
      [
        COURT_SESSION_ID,
        MERGED_CASE_ID,
        { value: 'Málin sameinuð' },
        { persist: true },
      ],
    ])
  })

  it('should not persist an empty value, since the entries are required', () => {
    const { patchCourtSessionStrings } = renderEntries('Málin sameinuð')
    const input = entriesInput()

    fireEvent.change(input, { target: { value: '' } })
    advance(DELAY)
    fireEvent.blur(input)

    expect(persistedCalls(patchCourtSessionStrings)).toHaveLength(0)
    expect(screen.getByText('Reitur má ekki vera tómur')).toBeTruthy()
  })

  it('should adopt a value that arrives after mount', () => {
    const { view } = renderEntries(undefined)

    expect(entriesInput()).toHaveValue('')

    view.rerender(
      <IntlProviderWrapper>
        <CourtSessionMergedCaseEntries
          courtSessionId={COURT_SESSION_ID}
          courtCaseNumber="S-1/2025"
          courtSessionString={{ value: 'Málin sameinuð' } as CourtSessionString}
          mergedCaseId={MERGED_CASE_ID}
          disabled={false}
          patchCourtSessionStrings={jest.fn()}
        />
      </IntlProviderWrapper>,
    )

    expect(entriesInput()).toHaveValue('Málin sameinuð')
  })
})
