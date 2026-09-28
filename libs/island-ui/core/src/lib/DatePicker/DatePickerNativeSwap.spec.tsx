import React from 'react'
import { act, fireEvent, render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

import { DatePicker } from './DatePicker'
import { DatePickerNativeSwap } from './DatePickerNativeSwap'

describe.each([
  ['current', DatePicker],
  ['native swapRange', DatePickerNativeSwap],
])('%s reverse range selection', (_, Component) => {
  it('previews an earlier end date and commits a sorted range once', async () => {
    const handleChange = jest.fn()
    const firstClick = new Date(2020, 9, 20)
    const { container, getByText, getByRole } = render(
      <Component
        label="Range"
        placeholderText="Select a range"
        range
        selectedRange={{ startDate: firstClick, endDate: null }}
        handleChange={handleChange}
      />,
    )

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'Open calendar' }))
    })

    const earlierDay = getByText('15')
    await act(async () => {
      fireEvent.mouseEnter(earlierDay)
    })
    expect(earlierDay).toHaveClass('react-datepicker__day--in-selecting-range')

    await act(async () => {
      fireEvent.click(earlierDay)
    })
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledTimes(1)
    })
    expect(handleChange).toHaveBeenCalledWith(new Date(2020, 9, 15), firstClick)
    expect(container.querySelector('input')?.value).toContain('15/10/2020')
    expect(container.querySelector('input')?.value).toContain('20/10/2020')
  })
})
