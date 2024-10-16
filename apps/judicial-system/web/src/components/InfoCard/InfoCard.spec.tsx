import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'

import { LocaleProvider } from '@island.is/localization'

import { DefendantInfo } from './DefendantInfo/DefendantInfo'
import InfoCard from './InfoCard'

describe('InfoCard', () => {
  test('should display the assigned defender name if that info is provided even though the defender email is not', async () => {
    // Arrange
    render(
      <MockedProvider>
        <LocaleProvider locale="is" messages={{}}>
          <InfoCard
            sections={[
              {
                id: 'sec_id',
                items: [
                  {
                    id: 'itm_id',
                    title: 'Titill',
                    values: [
                      <DefendantInfo
                        defendant={{ id: 'def_id', defenderName: 'Joe' }}
                      />,
                    ],
                  },
                ],
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
            sections={[
              {
                id: 'sec_id',
                items: [
                  {
                    id: 'itm_id',
                    title: 'Titill',
                    values: [
                      <DefendantInfo
                        defendant={{
                          id: 'def_id',
                          defenderName: 'Joe',
                          defenderPhoneNumber: '555-5555',
                        }}
                      />,
                    ],
                  },
                ],
              },
            ]}
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
          render(
          <MockedProvider>
            <LocaleProvider locale="is" messages={{}}>
              <InfoCard
                sections={[
                  {
                    id: 'sec_id',
                    items: [
                      {
                        id: 'itm_id',
                        title: 'Titill',
                        values: [
                          <DefendantInfo
                            defendant={{
                              id: 'def_id',
                              defenderName: 'Joe',
                              defenderEmail: 'joe@joe.is',
                              defenderPhoneNumber: '455-5544',
                            }}
                          />,
                        ],
                      },
                    ],
                  },
                ]}
              />
            </LocaleProvider>
          </MockedProvider>
          , )
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
            sections={[
              {
                id: 'sec_id',
                items: [
                  {
                    id: 'itm_id',
                    title: 'Titill',
                    values: [<DefendantInfo defendant={{ id: 'def_id' }} />],
                  },
                ],
              },
            ]}
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
