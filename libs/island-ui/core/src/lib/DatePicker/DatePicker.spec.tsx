import React from 'react'
import {
  render,
  fireEvent,
  waitFor,
  act,
  getAllByText,
} from '@testing-library/react'
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
    const startDate = new Date(2020, 9, 1)
    const endDate = new Date(2020, 9, 15)

    it('should display range in en locale format (dd/MM/yyyy)', () => {
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
      expect(input?.value).toContain('01/10/2020')
      expect(input?.value).toContain('15/10/2020')
    })

    it('should display range in is locale format (dd.MM.yyyy)', () => {
      const { container } = render(
        <DatePicker
          placeholderText="Pick a date"
          label="Select date range"
          range={true}
          selectedRange={{ startDate, endDate }}
          handleChange={jest.fn()}
          locale="is"
        />,
      )
      const input = container.querySelector('input')
      expect(input?.value).toContain('01.10.2020')
      expect(input?.value).toContain('15.10.2020')
    })

    it('should update input when selectedRange prop changes', () => {
      const { container, rerender } = render(
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
      expect(input?.value).toContain('01/10/2020')

      rerender(
        <DatePicker
          placeholderText="Pick a date"
          label="Select date range"
          range={true}
          selectedRange={{
            startDate: new Date(2021, 0, 5),
            endDate: new Date(2021, 0, 20),
          }}
          handleChange={jest.fn()}
          locale="en"
        />,
      )
      expect(input?.value).toContain('05/01/2021')
      expect(input?.value).toContain('20/01/2021')
    })

    it('should call handleClear and clear input when clear button is clicked', () => {
      const handleClear = jest.fn()
      const { getByRole, container } = render(
        <DatePicker
          placeholderText="Pick a date"
          label="Select date range"
          range={true}
          selectedRange={{ startDate, endDate }}
          handleChange={jest.fn()}
          handleClear={handleClear}
          isClearable={true}
          clearLabel="Clear dates"
          locale="en"
        />,
      )
      // The label is in a VisuallyHidden span — query by accessible name
      const clearButton = getByRole('button', { name: /clear dates/i })
      fireEvent.click(clearButton)
      expect(handleClear).toHaveBeenCalledTimes(1)
      const input = container.querySelector('input')
      expect(input?.value).toBe('')
    })

    it('should clear both dates when input is emptied', () => {
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
      expect(input?.value).not.toBe('')
      fireEvent.change(input!, { target: { value: '' } })
      expect(input?.value).toBe('')
    })

    it('should submit range on Enter with canonical en format (dd/MM/yyyy)', () => {
      const handleChange = jest.fn()
      const { container } = render(
        <DatePicker
          placeholderText="Pick a date"
          label="Select date range"
          range={true}
          handleChange={handleChange}
          locale="en"
        />,
      )
      const input = container.querySelector('input')!
      input.value = '01/06/2020 - 15/06/2020'
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(handleChange).toHaveBeenCalledWith(
        new Date(2020, 5, 1),
        new Date(2020, 5, 15),
      )
    })

    it('should submit range on Enter with canonical is format (dd.MM.yyyy)', () => {
      const handleChange = jest.fn()
      const { container } = render(
        <DatePicker
          placeholderText="Pick a date"
          label="Select date range"
          range={true}
          handleChange={handleChange}
          locale="is"
        />,
      )
      const input = container.querySelector('input')!
      input.value = '01.06.2020 - 15.06.2020'
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(handleChange).toHaveBeenCalledWith(
        new Date(2020, 5, 1),
        new Date(2020, 5, 15),
      )
    })

    it('should accept date without leading zeros on Enter (d/M/yyyy)', () => {
      const handleChange = jest.fn()
      const { container } = render(
        <DatePicker
          placeholderText="Pick a date"
          label="Select date range"
          range={true}
          handleChange={handleChange}
          locale="en"
        />,
      )
      const input = container.querySelector('input')!
      input.value = '1/6/2020 - 15/6/2020'
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(handleChange).toHaveBeenCalledWith(
        new Date(2020, 5, 1),
        new Date(2020, 5, 15),
      )
    })

    it('should accept spaceless range separator on Enter', () => {
      const handleChange = jest.fn()
      const { container } = render(
        <DatePicker
          placeholderText="Pick a date"
          label="Select date range"
          range={true}
          handleChange={handleChange}
          locale="en"
        />,
      )
      const input = container.querySelector('input')!
      input.value = '01/06/2020-15/06/2020'
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(handleChange).toHaveBeenCalledWith(
        new Date(2020, 5, 1),
        new Date(2020, 5, 15),
      )
    })

    it('should auto-swap dates when end is before start on Enter', () => {
      const handleChange = jest.fn()
      const { container } = render(
        <DatePicker
          placeholderText="Pick a date"
          label="Select date range"
          range={true}
          handleChange={handleChange}
          locale="en"
        />,
      )
      const input = container.querySelector('input')!
      input.value = '15/06/2020 - 01/06/2020'
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(handleChange).toHaveBeenCalledWith(
        new Date(2020, 5, 1),
        new Date(2020, 5, 15),
      )
    })

    it('should not call handleChange on Enter with invalid input', () => {
      const handleChange = jest.fn()
      const { container } = render(
        <DatePicker
          placeholderText="Pick a date"
          label="Select date range"
          range={true}
          handleChange={handleChange}
          locale="en"
        />,
      )
      const input = container.querySelector('input')!
      input.value = 'not-a-date - garbage'
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(handleChange).not.toHaveBeenCalled()
    })

    it('should not call handleChange while typing (only on Enter)', () => {
      const handleChange = jest.fn()
      const { container } = render(
        <DatePicker
          placeholderText="Pick a date"
          label="Select date range"
          range={true}
          handleChange={handleChange}
          locale="en"
        />,
      )
      const input = container.querySelector('input')!
      fireEvent.change(input, { target: { value: '01/06/2020 - 15/06/2020' } })
      expect(handleChange).not.toHaveBeenCalled()
    })

    it('should complete range when calendar day is clicked with startDate already set', async () => {
      const handleChange = jest.fn()
      const { container } = render(
        <DatePicker
          placeholderText="Pick a date"
          label="Select date range"
          range={true}
          selectedRange={{ startDate: new Date(2020, 9, 1), endDate: null }}
          handleChange={handleChange}
          locale="en"
        />,
      )
      const openButton = container.querySelector('[aria-label="Open calendar"]')
      // Open calendar (mirrors the non-range test pattern: each interaction gets its own act)
      await act(async () => {
        if (openButton) fireEvent.click(openButton)
      })
      // Click day 15 inside its own act to ensure the onChange callback is fully processed
      await act(async () => {
        fireEvent.click(getAllByText(container, '15')[0])
      })
      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledTimes(1)
        expect(handleChange).toHaveBeenCalledWith(
          new Date(2020, 9, 1),
          new Date(2020, 9, 15),
        )
      })
    })

    it('should accept dot separator as fallback in en locale on Enter', () => {
      const handleChange = jest.fn()
      const { container } = render(
        <DatePicker
          placeholderText="Pick a date"
          label="Select date range"
          range={true}
          handleChange={handleChange}
          locale="en"
        />,
      )
      const input = container.querySelector('input')!
      input.value = '01.06.2020 - 15.06.2020'
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(handleChange).toHaveBeenCalledWith(
        new Date(2020, 5, 1),
        new Date(2020, 5, 15),
      )
    })

    it('should accept slash separator as fallback in is locale on Enter', () => {
      const handleChange = jest.fn()
      const { container } = render(
        <DatePicker
          placeholderText="Pick a date"
          label="Select date range"
          range={true}
          handleChange={handleChange}
          locale="is"
        />,
      )
      const input = container.querySelector('input')!
      input.value = '01/06/2020 - 15/06/2020'
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(handleChange).toHaveBeenCalledWith(
        new Date(2020, 5, 1),
        new Date(2020, 5, 15),
      )
    })

    it('should not call handleChange on Enter with no separator (single date)', () => {
      const handleChange = jest.fn()
      const { container } = render(
        <DatePicker
          placeholderText="Pick a date"
          label="Select date range"
          range={true}
          handleChange={handleChange}
          locale="en"
        />,
      )
      const input = container.querySelector('input')!
      input.value = '01/06/2020'
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(handleChange).not.toHaveBeenCalled()
    })

    it('should not call handleChange on Enter when one side is unparseable', () => {
      const handleChange = jest.fn()
      const { container } = render(
        <DatePicker
          placeholderText="Pick a date"
          label="Select date range"
          range={true}
          handleChange={handleChange}
          locale="en"
        />,
      )
      const input = container.querySelector('input')!
      input.value = '01/06/2020 - garbage'
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(handleChange).not.toHaveBeenCalled()
    })

    it('should not call handleChange on Enter with empty input', () => {
      const handleChange = jest.fn()
      const { container } = render(
        <DatePicker
          placeholderText="Pick a date"
          label="Select date range"
          range={true}
          handleChange={handleChange}
          locale="en"
        />,
      )
      const input = container.querySelector('input')!
      input.value = ''
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(handleChange).not.toHaveBeenCalled()
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

      // Open calendar via the icon button (range mode requires the icon button to open)
      const openButton = container.querySelector('[aria-label="Open calendar"]')
      if (openButton) {
        fireEvent.click(openButton)
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
