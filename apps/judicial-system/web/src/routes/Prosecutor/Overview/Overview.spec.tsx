import React from 'react'
import { render, waitFor } from '@testing-library/react'
import Overview from './Overview'
import * as Constants from '../../../utils/constants'
import { CaseCustodyProvisions } from '@island.is/judicial-system/types'
import { userContext } from '@island.is/judicial-system-web/src/utils/userContext'
import { mockProsecutorUserContext } from '../../../utils/mocks'
import { MockedProvider } from '@apollo/client/testing'

describe(`${Constants.STEP_THREE_ROUTE}`, () => {
  test('should display the approprieate custody provisions', async () => {
    // Arrange
    Storage.prototype.getItem = jest.fn(() => {
      return JSON.stringify({
        id: 'b5041539-27c0-426a-961d-0f268fe45165',
        created: '2020-09-16T19:50:08.033Z',
        modified: '2020-09-16T19:51:39.466Z',
        state: 'DRAFT',
        court: 'string',
        comments: 'string',
        policeCaseNumber: 'string',
        accusedNationalId: 'string',
        accusedName: 'string',
        accusedAddress: 'string',
        arrestDate: '2020-09-16T19:51:28.224Z',
        requestedCourtDate: '2020-09-16T19:51:28.224Z',
        requestedCustodyEndDate: '2020-09-16T19:51:28.224Z',
        lawsBroken: 'string',
        custodyProvisions: [
          CaseCustodyProvisions._95_1_A,
          CaseCustodyProvisions._95_1_C,
        ],
        requestedCustodyRestrictions: ['ISOLATION', 'MEDIA'],
        caseFacts: 'string',
        legalArguments: 'string',
      })
    })

    // Act
    const { getByText } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <userContext.Provider value={mockProsecutorUserContext}>
          <Overview />
        </userContext.Provider>
      </MockedProvider>,
    )

    // Assert
    await waitFor(() => getByText('a-lið 1. mgr. 95. gr.'))
    expect(getByText('a-lið 1. mgr. 95. gr.')).toBeTruthy()
    await waitFor(() => getByText('c-lið 1. mgr. 95. gr.'))
    expect(getByText('c-lið 1. mgr. 95. gr.')).toBeTruthy()
  })
})
