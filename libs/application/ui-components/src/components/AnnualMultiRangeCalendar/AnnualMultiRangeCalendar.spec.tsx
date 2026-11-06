import { ReactNode, useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { AnnualMultiRangeCalendar } from './AnnualMultiRangeCalendar'

jest.mock('@island.is/island-ui/core', () => {
  const React = jest.requireActual<typeof import('react')>('react')

  return {
    Box: ({ children }: { children?: ReactNode }) =>
      React.createElement('div', null, children),
    ErrorMessage: ({ children }: { children?: ReactNode }) =>
      React.createElement('span', null, children),
    Text: ({ children, id }: { children?: ReactNode; id?: string }) =>
      React.createElement('div', { id }, children),
    VisuallyHidden: ({
      children,
      id,
    }: {
      children?: ReactNode
      id?: string
    }) => React.createElement('span', { id }, children),
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
  formatRangeStartSelected: (date: Date) =>
    `Start ${date.toISOString()}`,
  formatRangeSelected: (from: Date, to: Date) =>
    `Selected ${from.toISOString()} to ${to.toISOString()}`,
  rangeRemoved: 'Range removed',
}

const CalendarHarness = () => {
  const [selectedDates, setSelectedDates] = useState<string[]>([])

  return (
    <>
      <output data-testid="selected-dates">
        {selectedDates.join(',')}
      </output>
      <AnnualMultiRangeCalendar
        id="test-calendar"
        year={2026}
        selectedDates={selectedDates}
        onChange={setSelectedDates}
        labels={labels}
      />
    </>
  )
}

describe('AnnualMultiRangeCalendar', () => {
  it('selects and removes a contiguous date range', () => {
    render(<CalendarHarness />)

    fireEvent.click(screen.getByRole('button', { name: '2 January 2026' }))
    fireEvent.click(screen.getByRole('button', { name: '4 January 2026' }))

    expect(screen.getByTestId('selected-dates').textContent).toBe(
      '2026-01-02,2026-01-03,2026-01-04',
    )

    fireEvent.click(screen.getByRole('button', { name: '3 January 2026' }))

    expect(screen.getByTestId('selected-dates').textContent).toBe('')
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
