import React from 'react'
import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'

import {
  mockCaseQueries,
  mockJudgeQuery,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components'
import Overview from './Overview'

describe('/domari-krafa with an ID', () => {
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
    expect(await screen.findByText('B - Einangrun')).toBeInTheDocument()
    expect(await screen.findByText('E - Fjölmiðlabann')).toBeInTheDocument()
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

  test('should not show the "Open file" button if a judge has not been set', async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_8' },
    }))

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
    expect(screen.queryAllByRole('button', { name: 'Opna' })).toHaveLength(0)
  })

  test('should not show the "Open file" button if the currently logged in judge is not the judge that is assigned to the case', async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_4' },
    }))

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
    expect(screen.queryAllByRole('button', { name: 'Opna' })).toHaveLength(0)
  })

  test('should show the "Open file" button if the currently logged in judge is the same as is assigned to the case', async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_5' },
    }))

    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockJudgeQuery]}
        addTypename={false}
      >
        <UserProvider authenticated={true}>
          <Overview />
        </UserProvider>
      </MockedProvider>,
    )

    // Assert
    expect(await screen.findAllByRole('button', { name: 'Opna' })).toHaveLength(
      2,
    )
  })
})
