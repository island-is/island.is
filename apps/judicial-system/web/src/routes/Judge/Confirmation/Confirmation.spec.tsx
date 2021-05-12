import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import {
  CaseAppealDecision,
  UpdateCase,
} from '@island.is/judicial-system/types'
import {
  mockCaseQueries,
  mockJudgeQuery,
  mockUpdateCaseMutation,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { MockedProvider } from '@apollo/client/testing'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components'
import userEvent from '@testing-library/user-event'
import { Confirmation } from './Confirmation'

describe('Confirmation route', () => {
  test(`should not allow users to continue unless every required field has been filled out`, async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_5' },
    }))

    // Act
    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockJudgeQuery,
          ...mockUpdateCaseMutation([
            {
              courtStartDate: '2020-09-16T15:55:000Z',
            } as UpdateCase,
          ]),
        ]}
        addTypename={false}
      >
        <UserProvider>
          <Confirmation />
        </UserProvider>
      </MockedProvider>,
    )

    // Assert
    expect(
      await screen.findByRole('button', {
        name: /Staðfesta og hefja undirritun/i,
      }),
    ).toBeDisabled()

    userEvent.type(
      await screen.findByLabelText('Þinghaldi lauk (kk:mm) *'),
      '15:55',
    )

    expect(
      await screen.findByRole('button', {
        name: /Staðfesta og hefja undirritun/i,
      }),
    ).not.toBeDisabled()
  })

  test(`should not allow users to continue if the user is not the assigned judge`, async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_6' },
    }))

    // Act
    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockJudgeQuery,
          ...mockUpdateCaseMutation([
            {
              courtStartDate: '2020-09-16T15:55:000Z',
            } as UpdateCase,
          ]),
        ]}
        addTypename={false}
      >
        <UserProvider>
          <Confirmation />
        </UserProvider>
      </MockedProvider>,
    )

    expect(
      await screen.findByText(
        'Einungis skráður dómari getur undirritað úrskurð',
      ),
    ).toBeInTheDocument()
  })

  test(`should not display prosecutor or judge appeal announcements if appeal decition is not ${CaseAppealDecision.APPEAL}`, async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_2' },
    }))

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockJudgeQuery]}
        addTypename={false}
      >
        <UserProvider>
          <Confirmation />
        </UserProvider>
      </MockedProvider>,
    )

    // Assert
    expect(
      await waitFor(() => screen.queryByText('accusedAppealAnnouncement test')),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText('prosecutorAppealAnnouncement test'),
    ).not.toBeInTheDocument()
  })

  test(`should display prosecutor and judge appeal announcements if appeal decition is ${CaseAppealDecision.APPEAL}`, async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id' },
    }))

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockJudgeQuery]}
        addTypename={false}
      >
        <UserProvider>
          <Confirmation />
        </UserProvider>
      </MockedProvider>,
    )

    // Assert
    expect(
      await screen.findByText('accusedAppealAnnouncement test'),
    ).toBeInTheDocument()

    expect(
      await screen.findByText('prosecutorAppealAnnouncement test'),
    ).toBeInTheDocument()
  })
})
