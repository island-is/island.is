import { ReactNode, useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { AnnualMultiRangeCalendar } from './AnnualMultiRangeCalendar'
import { CalendarDateRange } from './utils'

jest.mock('@island.is/island-ui/core', () => {
  const React = jest.requireActual<typeof import('react')>('react')

  return {
    Box: ({ children }: { children?: ReactNode }) =>
      React.createElement('div', null, children),
    ErrorMessage: ({ children }: { children?: ReactNode }) =>
      React.createElement('span', null, children),
    Text: ({ children, id }: { children?: ReactNode; id?: string }) =>
      React.createElement('div', { id }, children),
    VisuallyHidden: ({ children, id }: { children?: ReactNode; id?: string }) =>
      React.createElement('span', { id }, children),
  }
})

jest.mock('./AnnualMultiRangeCalendar.css', () => ({
  calendarGrid: 'calendarGrid',
  monthCard: 'monthCard',
  monthHeader: 'monthHeader',
  weekGrid: 'weekGrid',
  weekDay: 'weekDay',
  dayPlaceholder: 'dayPlaceholder',
  calendarDay: 'calendarDay',
  selectedDay: 'selectedDay',
  inRangeDay: 'inRangeDay',
  previewDay: 'previewDay',
  connectedLeft: 'connectedLeft',
  connectedRight: 'connectedRight',
  continuesFromPreviousMonth: 'continuesFromPreviousMonth',
  continuesIntoNextMonth: 'continuesIntoNextMonth',
}))

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const labels = {
  title: 'Calendar',
  description: 'Select ranges',
  months,
  weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  keyboardInstructions: 'Use arrow keys',
  formatDayAriaLabel: (date: Date) =>
    `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`,
  formatRangeStartSelected: (date: Date) => `Start ${date.toISOString()}`,
  formatRangeSelected: (from: Date, to: Date) =>
    `Selected ${from.toISOString()} to ${to.toISOString()}`,
  rangeRemoved: 'Range removed',
}

const CalendarHarness = () => {
  const [ranges, setRanges] = useState<CalendarDateRange[]>([])

  return (
    <>
      <output data-testid="ranges">
        {ranges.map(({ from, to }) => `${from}/${to}`).join(',')}
      </output>
      <AnnualMultiRangeCalendar
        id="test-calendar"
        year={2026}
        ranges={ranges}
        onChange={setRanges}
        labels={labels}
      />
    </>
  )
}

const clickDay = (name: string) =>
  fireEvent.click(screen.getByRole('button', { name }))

describe('AnnualMultiRangeCalendar', () => {
  it('selects and removes a date range', () => {
    render(<CalendarHarness />)

    clickDay('2 January 2026')
    clickDay('4 January 2026')

    expect(screen.getByTestId('ranges').textContent).toBe(
      '2026-01-02/2026-01-04',
    )

    clickDay('3 January 2026')

    expect(screen.getByTestId('ranges').textContent).toBe('')
  })

  it('keeps adjacent and touching ranges as separate ranges', () => {
    render(<CalendarHarness />)

    clickDay('1 July 2026')
    clickDay('3 July 2026')
    clickDay('4 July 2026')
    clickDay('6 July 2026')
    // The last day of a range can start the next one.
    clickDay('6 July 2026')
    clickDay('8 July 2026')

    expect(screen.getByTestId('ranges').textContent).toBe(
      '2026-07-01/2026-07-03,2026-07-04/2026-07-06,2026-07-06/2026-07-08',
    )
  })

  it('cancels a pending range when its start day is picked again', () => {
    render(<CalendarHarness />)

    clickDay('2 January 2026')
    clickDay('2 January 2026')
    clickDay('5 January 2026')
    clickDay('7 January 2026')

    expect(screen.getByTestId('ranges').textContent).toBe(
      '2026-01-05/2026-01-07',
    )
  })

  it('moves focus between days with the arrow keys', () => {
    render(<CalendarHarness />)

    const firstDay = screen.getByRole('button', {
      name: '1 January 2026',
    })
    firstDay.focus()
    fireEvent.keyDown(firstDay, { key: 'ArrowRight' })

    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: '2 January 2026' }),
    )
  })
})
