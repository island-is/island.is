import { createMemoryHistory } from 'history'
import React from 'react'
import { render } from '@testing-library/react'
import StepTwo from './StepTwo'
import { Router } from 'react-router-dom'

describe('Create detention request, step two', () => {
  test("should display the correct requestedCustodyEndTime if it's in localstorage", () => {
    // Arrange
    const history = createMemoryHistory()

    Storage.prototype.getItem = jest.fn(() => {
      return JSON.stringify({
        id: 'test_id',
        requestedCustodyEndDate: '2020-11-02T12:03:00Z',
        custodyProvisions: [],
        requestedCustodyRestrictions: [],
      })
    })

    // Act
    const { getByTestId } = render(
      <Router history={history}>
        <StepTwo />
      </Router>,
    )

    // Assert
    expect(
      (getByTestId('requestedCustodyEndTime') as HTMLInputElement).value,
    ).toEqual('12:03')
  })
})
