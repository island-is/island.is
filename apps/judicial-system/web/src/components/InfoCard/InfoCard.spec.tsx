import React from 'react'
import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'

import { LocaleProvider } from '@island.is/localization'

import InfoCard from './InfoCard'
import { SessionArrangements } from '../../graphql/schema'

describe('InfoCard', () => {
  test('should display the assigned defender name if that info is provided even though the defender email is not', async () => {
    // Arrange
    render(
      <MockedProvider>
        <LocaleProvider locale="is" messages={{}}>
          <InfoCard
            data={[]}
            defenders={[
              {
                name: 'Joe',
                sessionArrangement: SessionArrangements.AllPresent,
              },
            ]}
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
            defenders={[
              {
                name: 'Joe',
                phoneNumber: '555-5555',
                sessionArrangement: SessionArrangements.AllPresent,
              },
            ]}
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
            defenders={[
              {
                name: 'Joe',
                email: 'joe@joe.is',
                phoneNumber: '455-5544',
                sessionArrangement: SessionArrangements.AllPresent,
              },
            ]}
          />
        </LocaleProvider>
      </MockedProvider>,
    )

    // Act and Assert
    expect(await screen.findByText('Joe, joe@joe.is, s. 455-5544')).toBeTruthy()
  })

  test('should display multiple defenders', async () => {
    // Arrange
    render(
      <MockedProvider>
        <LocaleProvider locale="is" messages={{}}>
          <InfoCard
            data={[]}
            defenders={[
              {
                name: 'Joe',
                email: 'joe@joe.is',
                phoneNumber: '455-5544',
                sessionArrangement: SessionArrangements.AllPresent,
              },
              {
                name: 'Melissa',
                email: 'mel@issa.is',
                phoneNumber: '411-1114',
              },
            ]}
          />
        </LocaleProvider>
      </MockedProvider>,
    )

    // Act and Assert
    expect(await screen.findByText('Joe, joe@joe.is, s. 455-5544')).toBeTruthy()
    expect(
      await screen.findByText('Melissa, mel@issa.is, s. 411-1114'),
    ).toBeTruthy()
  })

  test('should display a message saying that a defender has not been set if the defender info is missing', async () => {
    // Arrange
    render(
      <MockedProvider>
        <LocaleProvider locale="is" messages={{}}>
          <InfoCard
            data={[]}
            defenders={[
              {
                name: '',
                defenderNationalId: '',
                email: '',
                phoneNumber: '',
                sessionArrangement: SessionArrangements.AllPresent,
              },
            ]}
          />
        </LocaleProvider>
      </MockedProvider>,
    )

    // Act and Assert
    expect(await screen.findByText('Hefur ekki verið skráður')).toBeTruthy()
  })
})
