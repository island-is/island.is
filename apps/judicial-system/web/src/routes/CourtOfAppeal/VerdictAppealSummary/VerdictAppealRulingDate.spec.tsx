import type { FC, PropsWithChildren } from 'react'
import { useState } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
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
  () => ({
    __esModule: true,
    default: ({
      selectedDate,
      minDate,
      maxDate,
      onChange,
    }: {
      selectedDate?: string | null
      minDate?: Date
      maxDate?: Date
      onChange: (date: Date | undefined, valid: boolean) => void
    }) => (
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
    ),
  }),
)

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
    appealState: AppealCaseState.READY_TO_COMPLETE,
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
    const tomorrow = startOfToday()
    tomorrow.setDate(tomorrow.getDate() + 1)

    mockReportedDates = [
      { label: 'today', date: startOfToday(), valid: true },
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

  it('is not shown outside the Court of Appeals', () => {
    renderSection(UserRole.PROSECUTOR)

    expect(screen.queryByText('Dagsetning lykta')).not.toBeInTheDocument()
    expect(screen.queryByTestId('shownDate')).not.toBeInTheDocument()
  })
})
