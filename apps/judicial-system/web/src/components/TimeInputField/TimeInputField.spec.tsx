import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import TimeInputField from './TimeInputField'

describe('TimeInputField', () => {
  test('should add a : character when the user enters two digits', async () => {
    // Arrange
    const user = userEvent.setup()
    render(
      <TimeInputField>
        <input type="text" />
      </TimeInputField>,
    )

    // Act
    await user.type(await screen.findByRole('textbox'), '11')

    // Assert
    expect(
      ((await screen.findByRole('textbox')) as HTMLInputElement).value,
    ).toEqual('11:')
  })
})
