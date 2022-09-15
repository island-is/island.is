import React from 'react'
import { render, screen } from '@testing-library/react'

import InfoCard from './InfoCard'
import { LocaleProvider } from '@island.is/localization'
import { MockedProvider } from '@apollo/client/testing'
import { SessionArrangements } from '@island.is/judicial-system/types'

describe('InfoCard', () => {
  test('should display the assigned defender name if that info is provided even though the defender email is not', async () => {
    // Arrange
    render(
      <MockedProvider>
        <LocaleProvider locale="is" messages={{}}>
          <InfoCard
            data={[]}
            defender={{
              name: 'Joe',
              sessionArrangement: SessionArrangements.ALL_PRESENT,
            }}
          />
        </LocaleProvider>
      </MockedProvider>,
    )

    // Act and Assert
    expect(await screen.findByText('Joe')).toBeTruthy()
  })

  test('should display the assigned defender name and phonenumber if that info is provided', async () => {
    // Arrange
    render(
      <MockedProvider>
        <LocaleProvider locale="is" messages={{}}>
          <InfoCard
            data={[]}
            defender={{
              name: 'Joe',
              phoneNumber: '555-5555',
              sessionArrangement: SessionArrangements.ALL_PRESENT,
            }}
          />
        </LocaleProvider>
      </MockedProvider>,
    )

    // Act and Assert
    expect(await screen.findByText('Joe, s. 555-5555')).toBeTruthy()
  })

  test('should display the assigned defender name, email and phonenumber if that info is provided', async () => {
    // Arrange
    render(
      <MockedProvider>
        <LocaleProvider locale="is" messages={{}}>
          <InfoCard
            data={[]}
            defender={{
              name: 'Joe',
              email: 'joe@joe.is',
              phoneNumber: '455-5544',
              sessionArrangement: SessionArrangements.ALL_PRESENT,
            }}
          />
        </LocaleProvider>
      </MockedProvider>,
    )

    // Act and Assert
    expect(await screen.findByText('Joe, joe@joe.is, s. 455-5544')).toBeTruthy()
  })

  test('should display a message saying that a defender has not been set if the defender info is missing', async () => {
    // Arrange
    render(
      <MockedProvider>
        <LocaleProvider locale="is" messages={{}}>
          <InfoCard
            data={[]}
            defender={{
              name: '',
              defenderNationalId: '',
              email: '',
              phoneNumber: '',
              sessionArrangement: SessionArrangements.ALL_PRESENT,
            }}
          />
        </LocaleProvider>
      </MockedProvider>,
    )

    // Act and Assert
    expect(await screen.findByText('Hefur ekki verið skráður')).toBeTruthy()
  })
})
