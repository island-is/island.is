import type { FC, PropsWithChildren } from 'react'
import { useState } from 'react'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import { FormContext } from '@island.is/judicial-system-web/src/components'
import {
  AppealCaseState,
  AppealCaseType,
  CaseType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { formatDateForServer } from '@island.is/judicial-system-web/src/utils/hooks/useCase/useCase.logic'
import { mockCase } from '@island.is/judicial-system-web/src/utils/mocks'
import { UserContextWrapper } from '@island.is/judicial-system-web/src/utils/testHelpers'

import VerdictAppealRulingDate from './VerdictAppealRulingDate'

const mockUpdateAppealCase = jest.fn()
// How often the picker has been mounted. The component puts the picker back to
// the stored date by remounting it, so a reset shows up here.
let mockPickerMounts = 0

jest.mock(
  '@island.is/judicial-system-web/src/utils/hooks/useAppealCase',
  () => ({
    __esModule: true,
    default: () => ({ updateAppealCase: mockUpdateAppealCase }),
  }),
)

// What the picker reports, chosen by the test. A date typed into the real
// picker is reported on the calendar closing, which jsdom does not do, so
// the picker is replaced by buttons that report the dates a user can reach
// by typing, along with what the picker shows and is limited to.
let mockReportedDates: {
  label: string
  date: Date | undefined
  valid: boolean
}[] = []

jest.mock(
  '@island.is/judicial-system-web/src/components/DateTime/DateTime',
  () => {
    const MockDateTime = ({
      selectedDate,
      minDate,
      maxDate,
      onChange,
    }: {
      selectedDate?: string | null
      minDate?: Date
      maxDate?: Date
      onChange: (date: Date | undefined, valid: boolean) => void
    }) => {
      const { useEffect } = jest.requireActual('react')

      useEffect(() => {
        mockPickerMounts += 1
      }, [])

      return (
        <div>
          <span data-testid="shownDate">{selectedDate ?? ''}</span>
          <span data-testid="minDate">{minDate?.toISOString() ?? ''}</span>
          <span data-testid="maxDate">{maxDate ? 'set' : ''}</span>
          {mockReportedDates.map(({ label, date, valid }) => (
            <button
              key={label}
              type="button"
              onClick={() => onChange(date, valid)}
            >
              {label}
            </button>
          ))}
        </div>
      )
    }

    return { __esModule: true, default: MockDateTime }
  },
)

// A save whose response the test hands back when it chooses.
const deferredSave = () => {
  let resolve: (value: unknown) => void = () => undefined
  const promise = new Promise((r) => {
    resolve = r
  })

  return { promise, resolve }
}

const startOfToday = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return today
}

const storedDate = new Date(2026, 5, 10).toISOString()

const theCase = {
  ...mockCase(CaseType.INDICTMENT),
  id: 'case-id',
  rulingDate: new Date(2026, 4, 20, 13, 0).toISOString(),
  verdictAppealCase: {
    id: 'verdict-appeal',
    appealType: AppealCaseType.VERDICT,
    appealState: AppealCaseState.COMPLETED,
    appealRulingDate: storedDate,
  },
} as unknown as WorkingCase

const StatefulFormContext: FC<PropsWithChildren<{ theCase: WorkingCase }>> = ({
  theCase,
  children,
}) => {
  const [workingCase, setWorkingCase] = useState(theCase)

  return (
    <FormContext.Provider
      value={{
        workingCase,
        setWorkingCase,
        isLoadingWorkingCase: false,
        caseNotFound: false,
        isCaseUpToDate: true,
        refreshCase: jest.fn(),
        getCase: jest.fn(),
        isCreating: false,
      }}
    >
      {children}
    </FormContext.Provider>
  )
}

const renderSection = (userRole: UserRole = UserRole.COURT_OF_APPEALS_JUDGE) =>
  render(
    <UserContextWrapper userRole={userRole}>
      <StatefulFormContext theCase={theCase}>
        <VerdictAppealRulingDate />
      </StatefulFormContext>
    </UserContextWrapper>,
  )

describe('VerdictAppealRulingDate', () => {
  beforeEach(() => {
    mockUpdateAppealCase.mockReset()
    mockPickerMounts = 0
    const tomorrow = startOfToday()
    tomorrow.setDate(tomorrow.getDate() + 1)

    mockReportedDates = [
      { label: 'today', date: startOfToday(), valid: true },
      { label: 'verdict day', date: new Date(2026, 4, 20), valid: true },
      { label: 'stored day', date: new Date(storedDate), valid: true },
      { label: 'tomorrow', date: tomorrow, valid: true },
      { label: 'half typed', date: new Date(202, 10, 25), valid: true },
      {
        label: 'before the verdict',
        date: new Date(2026, 4, 19),
        valid: true,
      },
      { label: 'empty', date: undefined, valid: false },
    ]
  })

  it('limits the picker to the days from the verdict to today', () => {
    renderSection()

    expect(screen.getByTestId('minDate')).toHaveTextContent(
      new Date(2026, 4, 20).toISOString(),
    )
    expect(screen.getByTestId('maxDate')).toHaveTextContent('set')
  })

  it('stores a date in range and shows it once the server has it', async () => {
    const today = formatDateForServer(startOfToday())
    mockUpdateAppealCase.mockResolvedValue({
      id: 'verdict-appeal',
      appealRulingDate: today,
    })
    renderSection()

    await userEvent.click(screen.getByRole('button', { name: 'today' }))

    expect(mockUpdateAppealCase).toHaveBeenCalledWith(
      'case-id',
      'verdict-appeal',
      { appealRulingDate: today },
    )
    await waitFor(() =>
      expect(screen.getByTestId('shownDate')).toHaveTextContent(today),
    )
  })

  it.each(['tomorrow', 'half typed', 'before the verdict', 'empty'])(
    'neither saves nor shows a date that is %s',
    async (label) => {
      renderSection()

      await userEvent.click(screen.getByRole('button', { name: label }))

      expect(mockUpdateAppealCase).not.toHaveBeenCalled()
      expect(screen.getByTestId('shownDate')).toHaveTextContent(storedDate)
    },
  )

  it('keeps the stored date when the save fails', async () => {
    mockUpdateAppealCase.mockResolvedValue(undefined)
    renderSection()

    await userEvent.click(screen.getByRole('button', { name: 'today' }))

    await waitFor(() => expect(mockUpdateAppealCase).toHaveBeenCalled())
    expect(screen.getByTestId('shownDate')).toHaveTextContent(storedDate)
  })

  describe('overlapping saves', () => {
    const today = formatDateForServer(startOfToday())
    const verdictDay = formatDateForServer(new Date(2026, 4, 20))

    const pickBoth = async () => {
      const first = deferredSave()
      const second = deferredSave()
      mockUpdateAppealCase
        .mockImplementationOnce(() => first.promise)
        .mockImplementationOnce(() => second.promise)
      renderSection()

      await userEvent.click(screen.getByRole('button', { name: 'verdict day' }))
      await userEvent.click(screen.getByRole('button', { name: 'today' }))
      expect(mockUpdateAppealCase).toHaveBeenCalledTimes(2)

      return { first, second }
    }

    it('keeps the later date when the earlier save answers last', async () => {
      const { first, second } = await pickBoth()

      await act(async () =>
        second.resolve({ id: 'verdict-appeal', appealRulingDate: today }),
      )
      await act(async () =>
        first.resolve({ id: 'verdict-appeal', appealRulingDate: verdictDay }),
      )

      expect(screen.getByTestId('shownDate')).toHaveTextContent(today)
    })

    it('does not reset the picker when an earlier save fails after a later one is stored', async () => {
      const { first, second } = await pickBoth()

      await act(async () =>
        second.resolve({ id: 'verdict-appeal', appealRulingDate: today }),
      )
      const mountsAfterSave = mockPickerMounts
      await act(async () => first.resolve(undefined))

      expect(screen.getByTestId('shownDate')).toHaveTextContent(today)
      expect(mockPickerMounts).toBe(mountsAfterSave)
    })

    it('shows the stored date again when the latest save fails', async () => {
      const { first, second } = await pickBoth()
      const mountsBefore = mockPickerMounts

      await act(async () => first.resolve(undefined))
      expect(mockPickerMounts).toBe(mountsBefore)

      await act(async () => second.resolve(undefined))

      expect(screen.getByTestId('shownDate')).toHaveTextContent(storedDate)
      expect(mockPickerMounts).toBe(mountsBefore + 1)
    })

    it('saves a return to the stored date while another date is still saving', async () => {
      const first = deferredSave()
      const second = deferredSave()
      mockUpdateAppealCase
        .mockImplementationOnce(() => first.promise)
        .mockImplementationOnce(() => second.promise)
      renderSection()

      await userEvent.click(screen.getByRole('button', { name: 'today' }))
      await userEvent.click(screen.getByRole('button', { name: 'stored day' }))

      expect(mockUpdateAppealCase).toHaveBeenCalledTimes(2)
      expect(mockUpdateAppealCase).toHaveBeenLastCalledWith(
        'case-id',
        'verdict-appeal',
        { appealRulingDate: formatDateForServer(new Date(storedDate)) },
      )

      await act(async () =>
        first.resolve({ id: 'verdict-appeal', appealRulingDate: today }),
      )
      await act(async () =>
        second.resolve({ id: 'verdict-appeal', appealRulingDate: storedDate }),
      )

      expect(screen.getByTestId('shownDate')).toHaveTextContent(storedDate)
    })

    it('still skips a pick of the stored date when nothing is being saved', async () => {
      renderSection()

      await userEvent.click(screen.getByRole('button', { name: 'stored day' }))

      expect(mockUpdateAppealCase).not.toHaveBeenCalled()
    })
  })

  it('is not shown outside the Court of Appeals', () => {
    renderSection(UserRole.PROSECUTOR)

    expect(screen.queryByText('Dagsetning lykta')).not.toBeInTheDocument()
    expect(screen.queryByTestId('shownDate')).not.toBeInTheDocument()
  })
})
