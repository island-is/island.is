import React from 'react'
import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import fetchMock from 'fetch-mock'

import {
  mockCaseQueries,
  mockJudgeQuery,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components'
import Overview from './[id]'

describe('/domari-krafa with an ID', () => {
  fetchMock.mock('/api/feature/CREATE_CUSTODY_COURT_CASE', true)

  test('should display the string "Ekki er farið fram á takmarkanir á gæslu" in custody restrictions if there are no custody restrictions', async () => {
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
          <Overview />
        </UserProvider>
      </MockedProvider>,
    )

    // Assert
    expect(
      await screen.findByText('Ekki er farið fram á takmarkanir á gæslu.'),
    ).toBeInTheDocument()
  })

  test('should display the approprieate custody restrictions if there are any', async () => {
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
          <Overview />
        </UserProvider>
      </MockedProvider>,
    )

    // Assert
    expect(await screen.findByText('B - Einangrun.')).toBeInTheDocument()
    expect(await screen.findByText('E - Fjölmiðlabann.')).toBeInTheDocument()
  })

  test('should display the appropriate custody provisions', async () => {
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
          <Overview />
        </UserProvider>
      </MockedProvider>,
    )

    // Assert
    expect(await screen.findByText('a-lið 1. mgr. 95. gr.')).toBeInTheDocument()
    expect(await screen.findByText('c-lið 1. mgr. 95. gr.')).toBeInTheDocument()
  })
})
