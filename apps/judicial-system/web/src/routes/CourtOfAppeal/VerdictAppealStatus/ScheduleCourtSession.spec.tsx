import { useState } from 'react'
import addDays from 'date-fns/addDays'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { AppealCourtSession } from '@island.is/judicial-system-web/src/graphql/schema'
import { AppealCourtSessionType } from '@island.is/judicial-system-web/src/graphql/schema'
import { IntlProviderWrapper } from '@island.is/judicial-system-web/src/utils/testHelpers'

import ScheduleCourtSession from './ScheduleCourtSession'
import type { AppealCourtSessionDraft } from './VerdictAppealStatus.logic'

const onEdit = jest.fn()
const onDelete = jest.fn()

// The page owns the draft; this stands in for it.
const Harness = ({
  bookedSessions = [],
  editingSessionId,
}: {
  bookedSessions?: AppealCourtSession[]
  editingSessionId?: string
}) => {
  const [session, setSession] = useState<AppealCourtSessionDraft>({})

  return (
    <>
      <ScheduleCourtSession
        session={session}
        onChange={setSession}
        bookedSessions={bookedSessions}
        editingSessionId={editingSessionId}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      <output data-testid="session-date-valid">
        {String(session.isSessionDateValid)}
      </output>
    </>
  )
}

const renderSection = (props: Parameters<typeof Harness>[0] = {}) =>
  render(
    <IntlProviderWrapper>
      <Harness {...props} />
    </IntlProviderWrapper>,
  )

const bookedSessions = [
  {
    id: 'session-1',
    sessionType: AppealCourtSessionType.PREPARATORY_HEARING,
    sessionDate: new Date(2026, 10, 3, 9, 0).toISOString(),
    courtRoom: '2',
  },
  {
    id: 'session-2',
    sessionType: AppealCourtSessionType.MAIN_HEARING,
    sessionDate: new Date(2026, 11, 12, 14, 0).toISOString(),
    courtRoom: '1',
  },
]

// Tomorrow rather than a fixed day: the picker refuses dates in the past, so
// a fixed day would pass until the month moves on and then fail forever.
const pickTomorrow = async (user: ReturnType<typeof userEvent.setup>) => {
  const today = new Date()
  const tomorrow = addDays(today, 1)

  await user.click(screen.getByLabelText(/Dagsetning/))

  if (tomorrow.getMonth() !== today.getMonth()) {
    await user.click(screen.getByLabelText('Next month'))
  }

  // The calendar pads its grid with the neighbouring months' days, so the
  // number alone can match twice. Only a cell of the month on view counts.
  const cell = screen
    .getAllByText(String(tomorrow.getDate()))
    .find(
      (el) =>
        el.className.includes('react-datepicker__day') &&
        !el.className.includes('outside-month'),
    )

  if (!cell) {
    throw new Error('No calendar cell for tomorrow')
  }

  await user.click(cell)
}

// The menu item's role sits on the list item; what reacts is the button in it.
const clickMenuItem = async (name: string) =>
  userEvent.click(
    within(await screen.findByRole('menuitem', { name })).getByRole('button'),
  )

describe('ScheduleCourtSession', () => {
  // DateTime reports no date at all while the time is half typed. Writing
  // that straight back into the picker wiped the date the court had just
  // chosen, the moment they corrected a digit of the time.
  it('keeps the date while the time is being corrected', async () => {
    const user = userEvent.setup()
    renderSection()

    await pickTomorrow(user)
    const timeInput = screen.getByTestId('appeal-court-session-date-time')
    await user.type(timeInput, '14:00')

    const dateInput = screen.getByLabelText(/Dagsetning/) as HTMLInputElement
    const dateValue = dateInput.value
    expect(dateValue).not.toBe('')

    // Out of the time field and back, then one digit off the end.
    await user.click(screen.getByLabelText(/Dómsalur/))
    await user.click(timeInput)
    await user.type(timeInput, '{backspace}')

    expect(dateInput.value).toBe(dateValue)
    // Kept, but not counted: the time field is showing an error, and the
    // draft must not pass as complete until it is whole again.
    expect(screen.getByTestId('session-date-valid')).toHaveTextContent('false')

    await user.type(timeInput, '0')

    expect(screen.getByTestId('session-date-valid')).toHaveTextContent('true')
  })

  it('lists the booked sessions with a menu each', async () => {
    renderSection({ bookedSessions })

    const list = screen.getByRole('list', { name: 'Bókuð þinghöld' })
    expect(list).toHaveTextContent('Undirbúningsþinghald')
    expect(list).toHaveTextContent('03.11.2026 kl. 09:00 · Dómsalur 2')
    expect(list).toHaveTextContent('Aðalmeðferð')
    expect(list).toHaveTextContent('12.12.2026 kl. 14:00 · Dómsalur 1')

    await userEvent.click(
      screen.getByRole('button', { name: /^Valmynd fyrir Aðalmeðferð/ }),
    )
    await clickMenuItem('Breyta þinghaldi')

    expect(onEdit).toHaveBeenCalledWith(bookedSessions[1])

    await userEvent.click(
      screen.getByRole('button', {
        name: /^Valmynd fyrir Undirbúningsþinghald/,
      }),
    )
    await clickMenuItem('Eyða þinghaldi')

    expect(onDelete).toHaveBeenCalledWith(bookedSessions[0])
  })

  it('marks the session being changed and retitles the form', () => {
    renderSection({ bookedSessions, editingSessionId: 'session-2' })

    expect(
      screen.getByRole('heading', { name: 'Breyta þinghaldi' }),
    ).toBeInTheDocument()
    expect(screen.getAllByText('Verið að breyta')).toHaveLength(1)
    expect(screen.getByText('Aðalmeðferð').closest('li')).toHaveTextContent(
      'Verið að breyta',
    )
  })
})
