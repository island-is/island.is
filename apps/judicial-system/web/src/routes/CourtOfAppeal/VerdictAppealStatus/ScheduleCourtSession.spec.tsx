import { useState } from 'react'
import addDays from 'date-fns/addDays'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { IntlProviderWrapper } from '@island.is/judicial-system-web/src/utils/testHelpers'

import ScheduleCourtSession from './ScheduleCourtSession'
import type { AppealCourtSessionDraft } from './VerdictAppealStatus.logic'

// The page owns the draft; this stands in for it.
const Harness = () => {
  const [session, setSession] = useState<AppealCourtSessionDraft>({})

  return (
    <>
      <ScheduleCourtSession
        session={session}
        onChange={setSession}
        bookedSessions={[]}
      />
      <output data-testid="session-date-valid">
        {String(session.isSessionDateValid)}
      </output>
    </>
  )
}

const renderSection = () =>
  render(
    <IntlProviderWrapper>
      <Harness />
    </IntlProviderWrapper>,
  )

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
})
