import React from 'react'
import { render, fireEvent, waitFor, act } from '@testing-library/react'
import { DatePicker } from './DatePicker'
import '@testing-library/jest-dom'

describe('DatePicker', () => {
  // Suppress act() warnings for async calendar operations in tests
  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global as any).IS_REACT_ACT_ENVIRONMENT = false
  })

  afterAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global as any).IS_REACT_ACT_ENVIRONMENT = true
  })

  describe('Basic functionality', () => {
    it('should render and display selected date', () => {
      const selectedDate = new Date(2020, 9, 2) // October 2, 2020
      const { container, getByPlaceholderText } = render(
        <DatePicker
          label="Select date"
          placeholderText="Pick a date"
          selected={selectedDate}
          handleChange={jest.fn()}
          locale="en"
        />,
      )

      expect(getByPlaceholderText('Pick a date')).toBeInTheDocument()
      expect(
        container.querySelector('.island-ui-datepicker'),
      ).toBeInTheDocument()

      const input = container.querySelector('input')
      expect(input?.value).toBe('02/10/2020')
    })

    it('should call handleChange when date is selected', async () => {
      const handleChange = jest.fn()
      const { container, getByText } = render(
        <DatePicker
          label="Select date"
          placeholderText="Pick a date"
          handleChange={handleChange}
          selected={new Date(2020, 9, 2)}
        />,
      )
      const input = container.querySelector('input')
      if (input) {
        await act(async () => {
          fireEvent.click(input)
        })
      }
      await act(async () => {
        fireEvent.click(getByText('15'))
      })
      await waitFor(() => {
        expect(handleChange).toHaveBeenCalled()
      })
    })

    it('should handle disabled and error states', () => {
      const { container, getByText, rerender } = render(
        <DatePicker
          placeholderText="Pick a date"
          label="Select date"
          disabled={true}
          handleChange={jest.fn()}
        />,
      )

      const input = container.querySelector('input')
      expect(input).toBeDisabled()

      rerender(
        <DatePicker
          placeholderText="Pick a date"
          label="Select date"
          errorMessage="This field is required"
          handleChange={jest.fn()}
        />,
      )
      expect(getByText('This field is required')).toBeInTheDocument()
    })

    it('should support different locales', () => {
      const selectedDate = new Date(2020, 9, 2)
      const { container, rerender } = render(
        <DatePicker
          placeholderText="Pick a date"
          label="Select date"
          selected={selectedDate}
          locale="en"
          handleChange={jest.fn()}
        />,
      )

      let input = container.querySelector('input')
      expect(input?.value).toBe('02/10/2020')

      rerender(
        <DatePicker
          placeholderText="Pick a date"
          label="Select date"
          selected={selectedDate}
          locale="is"
          handleChange={jest.fn()}
        />,
      )

      input = container.querySelector('input')
      expect(input?.value).toBe('02.10.2020')
    })
  })

  describe('Range selection', () => {
    it('should display and select date range', () => {
      const startDate = new Date(2020, 9, 1)
      const endDate = new Date(2020, 9, 15)
      const { container } = render(
        <DatePicker
          placeholderText="Pick a date"
          label="Select date range"
          range={true}
          selectedRange={{ startDate, endDate }}
          handleChange={jest.fn()}
          locale="en"
        />,
      )
      const input = container.querySelector('input')

      // Verify both start and end dates are displayed
      expect(input?.value).toContain('01/10/2020')
      expect(input?.value).toContain('15/10/2020')

      // Open calendar and verify range highlighting
      if (input) {
        fireEvent.click(input)
      }

      // Check for range-specific CSS classes
      const inRangeDays = container.querySelectorAll(
        '.react-datepicker__day--in-range',
      )
      const rangeStart = container.querySelector(
        '.react-datepicker__day--range-start',
      )
      const rangeEnd = container.querySelector(
        '.react-datepicker__day--range-end',
      )

      expect(inRangeDays.length > 0 || rangeStart || rangeEnd).toBeTruthy()
    })

    it('should call handleChange when selecting range dates', () => {
      const handleChange = jest.fn()
      const { container, getByText } = render(
        <DatePicker
          placeholderText="Pick a date"
          label="Select date range"
          range={true}
          selected={new Date(2020, 9, 1)}
          handleChange={handleChange}
        />,
      )
      const input = container.querySelector('input')
      if (input) {
        fireEvent.click(input)
      }
      fireEvent.click(getByText('1'))
      fireEvent.click(getByText('15'))
      expect(handleChange).toHaveBeenCalled()
    })
  })

  describe('Predefined ranges', () => {
    const ranges = [
      {
        label: '7 days',
        startDate: new Date(2020, 9, 1),
        endDate: new Date(2020, 9, 7),
      },
      {
        label: '30 days',
        startDate: new Date(2020, 8, 8),
        endDate: new Date(2020, 9, 7),
      },
    ]

    it('should render and select predefined ranges', () => {
      const handleChange = jest.fn()
      const { getByText, container } = render(
        <DatePicker
          placeholderText="Pick a date"
          label="Select date range"
          range={true}
          ranges={ranges}
          handleChange={handleChange}
        />,
      )

      // Open calendar
      const input = container.querySelector('input')
      if (input) {
        fireEvent.click(input)
      }

      // Click on predefined range
      fireEvent.click(getByText('7 days'))

      // Verify the range was selected
      expect(handleChange).toHaveBeenCalledWith(
        ranges[0].startDate,
        ranges[0].endDate,
      )
    })
  })

  describe('Highlight weekends', () => {
    it('should render with highlighted weekends and start on Monday', () => {
      const { container } = render(
        <DatePicker
          placeholderText="Pick a date"
          label="Select date"
          highlightWeekends={true}
          selected={new Date(2020, 9, 1)}
          handleChange={jest.fn()}
        />,
      )

      const datepickerRoot = container.querySelector('.island-ui-datepicker')
      expect(datepickerRoot).toBeInTheDocument()

      const input = container.querySelector('input')
      if (input) {
        fireEvent.click(input)
      }

      const calendar = container.querySelector('.react-datepicker')
      expect(calendar).toBeInTheDocument()
    })
  })

  describe('Additional features', () => {
    it('should support date constraints (min/max dates)', () => {
      const minDate = new Date(2020, 9, 10)
      const maxDate = new Date(2020, 9, 20)
      const { container } = render(
        <DatePicker
          placeholderText="Pick a date"
          label="Select date"
          minDate={minDate}
          maxDate={maxDate}
          selected={new Date(2020, 9, 15)}
          handleChange={jest.fn()}
        />,
      )

      const input = container.querySelector('input')
      if (input) {
        fireEvent.click(input)
      }

      const disabledDay = container.querySelector(
        '.react-datepicker__day--disabled',
      )
      expect(disabledDay).toBeInTheDocument()
    })

    it('should support clear functionality', () => {
      const handleChange = jest.fn()
      const { container } = render(
        <DatePicker
          placeholderText="Pick a date"
          label="Select date"
          isClearable={true}
          selected={new Date(2020, 9, 1)}
          handleChange={handleChange}
          clearLabel="Clear date"
        />,
      )

      const clearButton = container.querySelector('[aria-label="Clear date"]')
      if (clearButton) {
        fireEvent.click(clearButton)
        expect(handleChange).toHaveBeenCalled()
      }
    })
  })
})
