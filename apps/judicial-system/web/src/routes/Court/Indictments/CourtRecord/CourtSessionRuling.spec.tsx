import { act, fireEvent, render, screen } from '@testing-library/react'

import {
  Case,
  CourtSessionResponse,
  CourtSessionRulingType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  FormContextWrapper,
  IntlProviderWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import CourtSessionRuling from './CourtSessionRuling'

// Mock the leaf hook (re-exported by the utils/hooks barrel) - requireActual on
// the barrel pulls in a circular dependency.
jest.mock(
  '@island.is/judicial-system-web/src/utils/hooks/useCourtSessions',
  () => ({
    __esModule: true,
    default: () => ({
      updateCourtSessionAppealDecision: jest.fn(),
    }),
  }),
)

const DELAY = 500
const COURT_SESSION_ID = 'court-session-1'

describe('CourtSessionRuling', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const advance = (ms: number) => act(() => jest.advanceTimersByTime(ms))

  const workingCase = { id: 'case-1' } as Case

  const courtSession = (
    overrides: Partial<CourtSessionResponse> = {},
  ): CourtSessionResponse =>
    ({
      id: COURT_SESSION_ID,
      isConfirmed: false,
      rulingType: CourtSessionRulingType.JUDGEMENT,
      ruling: '',
      closingEntries: '',
      ...overrides,
    } as CourtSessionResponse)

  const renderRuling = (overrides: Partial<CourtSessionResponse> = {}) => {
    const patchSession = jest.fn()

    const view = render(
      <IntlProviderWrapper>
        <FormContextWrapper theCase={workingCase}>
          <CourtSessionRuling
            courtSession={courtSession(overrides)}
            patchSession={patchSession}
          />
        </FormContextWrapper>
      </IntlProviderWrapper>,
    )

    return { patchSession, view }
  }

  const persistedCalls = (patchSession: jest.Mock) =>
    patchSession.mock.calls.filter(([, , options]) => options?.persist)

  describe('ruling', () => {
    it('should write optimistically on every keystroke but persist once', () => {
      const { patchSession } = renderRuling()
      const ruling = screen.getByTestId('ruling')

      fireEvent.change(ruling, { target: { value: 'Ákærði er sýknaður' } })

      expect(patchSession).toHaveBeenCalledWith(COURT_SESSION_ID, {
        ruling: 'Ákærði er sýknaður',
      })
      expect(persistedCalls(patchSession)).toHaveLength(0)

      advance(DELAY)

      expect(persistedCalls(patchSession)).toEqual([
        [COURT_SESSION_ID, { ruling: 'Ákærði er sýknaður' }, { persist: true }],
      ])
    })

    it('should persist immediately on blur', () => {
      const { patchSession } = renderRuling()
      const ruling = screen.getByTestId('ruling')

      fireEvent.change(ruling, { target: { value: 'Ákærði er sýknaður' } })
      fireEvent.blur(ruling)

      expect(persistedCalls(patchSession)).toEqual([
        [COURT_SESSION_ID, { ruling: 'Ákærði er sýknaður' }, { persist: true }],
      ])
    })

    it('should not persist an empty value, since a ruling is required', () => {
      const { patchSession } = renderRuling({ ruling: 'Ákærði er sýknaður' })
      const ruling = screen.getByTestId('ruling')

      fireEvent.change(ruling, { target: { value: '' } })
      advance(DELAY)
      fireEvent.blur(ruling)

      expect(persistedCalls(patchSession)).toHaveLength(0)
      expect(screen.getByText('Reitur má ekki vera tómur')).toBeTruthy()
    })

    it('should flush a pending edit on unmount', () => {
      const { patchSession, view } = renderRuling()

      fireEvent.change(screen.getByTestId('ruling'), {
        target: { value: 'Ákærði er sýknaður' },
      })

      expect(persistedCalls(patchSession)).toHaveLength(0)

      view.unmount()

      expect(persistedCalls(patchSession)).toEqual([
        [COURT_SESSION_ID, { ruling: 'Ákærði er sýknaður' }, { persist: true }],
      ])
    })

    // Moving the session to "no ruling" clears the ruling on the server and
    // unmounts this component. Pressing that radio moves focus off the textarea
    // first, so the blur flushes the pending save and the unmount cleanup has
    // nothing left to re-persist over the clear.
    it('should not re-persist a typed ruling on an unmount that follows a blur', () => {
      const { patchSession, view } = renderRuling()
      const ruling = screen.getByTestId('ruling')

      fireEvent.change(ruling, { target: { value: 'Ákærði er sýknaður' } })
      fireEvent.blur(ruling)
      view.unmount()

      expect(persistedCalls(patchSession)).toEqual([
        [COURT_SESSION_ID, { ruling: 'Ákærði er sýknaður' }, { persist: true }],
      ])
    })

    // Moving the session to "no ruling" clears the field on the server. A
    // debounced field ignores the persisted value once the user has typed, so
    // this only holds because the component unmounts with the ruling section.
    it('should drop an edit that the case no longer has after a remount', () => {
      const { view } = renderRuling()

      fireEvent.change(screen.getByTestId('ruling'), {
        target: { value: 'Ákærði er sýknaður' },
      })
      expect(screen.getByTestId('ruling')).toHaveValue('Ákærði er sýknaður')

      view.unmount()
      renderRuling({ ruling: '' })

      expect(screen.getByTestId('ruling')).toHaveValue('')
    })
  })

  describe('closing entries', () => {
    it('should persist a cleared value, since closing entries are optional', () => {
      const { patchSession } = renderRuling({ closingEntries: 'Bókað er' })
      const closingEntries = screen.getByTestId('closingEntries')

      fireEvent.change(closingEntries, { target: { value: '' } })
      advance(DELAY)

      expect(persistedCalls(patchSession)).toEqual([
        [COURT_SESSION_ID, { closingEntries: '' }, { persist: true }],
      ])
    })
  })
})
