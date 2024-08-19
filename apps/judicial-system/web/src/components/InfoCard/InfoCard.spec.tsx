import React from 'react'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'

import { SessionArrangements } from '@island.is/judicial-system-web/src/graphql/schema'
import { LocaleProvider } from '@island.is/localization'

import InfoCard from './InfoCard'

describe('InfoCard', () => {
  test('should display the assigned defender name if that info is provided even though the defender email is not', async () => {
    // Arrange
    render(
      <MockedProvider>
        <LocaleProvider locale="is" messages={{}}>
          <InfoCard
            data={[]}
            defendants={{ title: 'Titill', items: [{ id: 'def_id' }] }}
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
            defendants={{ title: 'Titill', items: [{ id: 'def_id' }] }}
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
    expect(
      await screen.findByText(
        (_, element) => element?.textContent === 'Joe, s. 555-5555',
      ),
    ).toBeTruthy()
  })

  test('should display the assigned defender name, email and phonenumber if that info is provided', async () => {
    // Arrange
    render(
      <MockedProvider>
        <LocaleProvider locale="is" messages={{}}>
          <InfoCard
            data={[]}
            defendants={{ title: 'Titill', items: [{ id: 'def_id' }] }}
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
    expect(
      await screen.findByText(
        (_, element) => element?.textContent === 'Joe, joe@joe.is, s. 455-5544',
        {},
      ),
    ).toBeTruthy()
  })

  test('should display a message saying that a defender has not been set if the defender info is missing', async () => {
    // Arrange

    render(
      <MockedProvider>
        <LocaleProvider locale="is" messages={{}}>
          <InfoCard
            data={[]}
            defendants={{ title: 'Titill', items: [{ id: 'def_id' }] }}
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
    expect(
      await screen.findByText('Verjandi: Hefur ekki verið skráður'),
    ).toBeTruthy()
  })
})
