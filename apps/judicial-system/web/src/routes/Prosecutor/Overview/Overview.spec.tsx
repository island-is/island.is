import React from 'react'
import { render, waitFor } from '@testing-library/react'
import Overview from './Overview'
import * as Constants from '../../../utils/constants'
import { CaseCustodyProvisions } from '@island.is/judicial-system/types'
import { userContext } from '@island.is/judicial-system-web/src/utils/userContext'
import { mockProsecutor } from '../../../utils/mocks'
import fetchMock from 'fetch-mock'
import { MemoryRouter, Route } from 'react-router-dom'

describe(`${Constants.STEP_THREE_ROUTE}`, () => {
  test('should display the approprieate custody provisions', async () => {
    // Arrange
    fetchMock.mock(
      '/api/case/test_id',
      {
        id: 'test_id',
        custodyProvisions: [
          CaseCustodyProvisions._95_1_A,
          CaseCustodyProvisions._95_1_C,
        ],
      },
      { method: 'get' },
    )
    // Act
    const { getByText } = render(
      <userContext.Provider value={{ user: mockProsecutor }}>
        <MemoryRouter
          initialEntries={[`${Constants.STEP_THREE_ROUTE}/test_id`]}
        >
          <Route path={`${Constants.STEP_THREE_ROUTE}/:id`}>
            <Overview />
          </Route>
        </MemoryRouter>
      </userContext.Provider>,
    )

    // Assert
    await waitFor(() => getByText('a-lið 1. mgr. 95. gr.'))
    expect(getByText('a-lið 1. mgr. 95. gr.')).toBeTruthy()
    await waitFor(() => getByText('c-lið 1. mgr. 95. gr.'))
    expect(getByText('c-lið 1. mgr. 95. gr.')).toBeTruthy()
  })
})
