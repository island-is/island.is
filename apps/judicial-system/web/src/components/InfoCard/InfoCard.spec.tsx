import React from 'react'

import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'

import { LocaleProvider } from '@island.is/localization'

import { DefendantInfo } from './DefendantInfo/DefendantInfo'
import InfoCard from './InfoCard'

const renderInfoCard = (sections: React.ComponentProps<typeof InfoCard>['sections']) =>
  render(
    <MockedProvider>
      <LocaleProvider locale="is" messages={{}}>
        <InfoCard sections={sections} />
      </LocaleProvider>
    </MockedProvider>,
  )

describe('InfoCard', () => {
  describe('empty item filtering', () => {
    test('does not render an item with an empty values array', async () => {
      renderInfoCard([
        {
          id: 'sec',
          items: [
            { id: 'empty', title: 'Hidden title', values: [] },
            { id: 'visible', title: 'Visible title', values: ['Visible value'] },
          ],
        },
      ])

      await screen.findByText('Visible title')
      expect(screen.queryByText('Hidden title')).toBeNull()
    })

    test('does not render an item whose first value is falsy', async () => {
      renderInfoCard([
        {
          id: 'sec',
          items: [
            { id: 'falsy', title: 'Falsy title', values: [null as unknown as string] },
            { id: 'visible', title: 'Visible title', values: ['Value'] },
          ],
        },
      ])

      await screen.findByText('Visible title')
      expect(screen.queryByText('Falsy title')).toBeNull()
    })
  })

  describe('empty section filtering', () => {
    test('does not render a section where all items are empty', async () => {
      renderInfoCard([
        {
          id: 'empty-section',
          items: [
            { id: 'a', title: 'Hidden A', values: [] },
            { id: 'b', title: 'Hidden B', values: [null as unknown as string] },
          ],
        },
        {
          id: 'visible-section',
          items: [{ id: 'c', title: 'Visible title', values: ['Value'] }],
        },
      ])

      await screen.findByText('Visible title')
      expect(screen.queryByText('Hidden A')).toBeNull()
      expect(screen.queryByText('Hidden B')).toBeNull()
    })
  })

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
                        workingCaseId="case_id"
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
                        workingCaseId="case_id"
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
                            workingCaseId="case_id"
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
                    values: [
                      <DefendantInfo
                        defendant={{ id: 'def_id' }}
                        workingCaseId="case_id"
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
        (_, element) =>
          element?.textContent === 'Verjandi: Hefur ekki verið skráður',
      ),
    ).toBeTruthy()
  })
})
