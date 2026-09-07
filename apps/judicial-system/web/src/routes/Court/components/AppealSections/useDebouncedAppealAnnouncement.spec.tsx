import type { FC, PropsWithChildren } from 'react'
import { act, renderHook } from '@testing-library/react'

import { FormContext } from '@island.is/judicial-system-web/src/components'
import type { Case } from '@island.is/judicial-system-web/src/graphql/schema'
import { AppealDecisionPartyRole } from '@island.is/judicial-system-web/src/graphql/schema'

import useDebouncedAppealAnnouncement from './useDebouncedAppealAnnouncement'

const mockUpdateCaseAppealDecision = jest.fn()

jest.mock(
  '@island.is/judicial-system-web/src/utils/hooks/useCaseAppealDecision',
  () => ({
    __esModule: true,
    default: () => ({
      updateCaseAppealDecision: mockUpdateCaseAppealDecision,
    }),
  }),
)

const DELAY = 500

// The debounce is the only path that persists typed announcement text - the
// input has no onBlur - so whatever it skips is silently lost on reload.
describe('useDebouncedAppealAnnouncement', () => {
  const caseId = 'case-1'

  const workingCase = {
    id: caseId,
    appealDecisions: [
      {
        id: 'decision-1',
        partyRole: AppealDecisionPartyRole.DEFENDANT,
        announcement: 'Ákærði kærir úrskurðinn til Landsréttar.',
      },
    ],
  } as unknown as Case

  const wrapper: FC<PropsWithChildren> = ({ children }) => (
    <FormContext.Provider
      value={
        {
          workingCase,
          setWorkingCase: jest.fn(),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any
      }
    >
      {children}
    </FormContext.Provider>
  )

  const renderAnnouncement = () =>
    renderHook(
      () => useDebouncedAppealAnnouncement(AppealDecisionPartyRole.DEFENDANT),
      { wrapper },
    )

  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
  })

  afterEach(() => jest.useRealTimers())

  it('reads the stored announcement of its party', () => {
    const { result } = renderAnnouncement()

    expect(result.current.value).toBe(
      'Ákærði kærir úrskurðinn til Landsréttar.',
    )
  })

  it('persists edited text after the debounce', () => {
    const { result } = renderAnnouncement()

    act(() => result.current.onChange('Leiðrétt yfirlýsing'))
    act(() => void jest.advanceTimersByTime(DELAY))

    expect(mockUpdateCaseAppealDecision).toHaveBeenCalledWith({
      caseId,
      partyRole: AppealDecisionPartyRole.DEFENDANT,
      announcement: 'Leiðrétt yfirlýsing',
    })
  })

  // Regression: the guard inherited from useDebouncedInput skipped the mutation
  // for an empty value, so clearing the field only cleared it locally and the
  // deleted text came back on the next reload.
  it('persists a cleared announcement', () => {
    const { result } = renderAnnouncement()

    act(() => result.current.onChange(''))
    act(() => void jest.advanceTimersByTime(DELAY))

    expect(mockUpdateCaseAppealDecision).toHaveBeenCalledWith({
      caseId,
      partyRole: AppealDecisionPartyRole.DEFENDANT,
      announcement: '',
    })
  })

  it('does not persist anything before the user edits', () => {
    renderAnnouncement()

    act(() => void jest.advanceTimersByTime(DELAY))

    expect(mockUpdateCaseAppealDecision).not.toHaveBeenCalled()
  })
})
