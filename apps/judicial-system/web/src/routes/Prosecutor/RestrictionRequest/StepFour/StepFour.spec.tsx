import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockedProvider } from '@apollo/client/testing'

import { UpdateCase } from '@island.is/judicial-system/types'
import {
  mockCaseQueries,
  mockProsecutorQuery,
  mockUpdateCaseMutation,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components'
import StepFour from './StepFour'

describe('Custody petition, step four', () => {
  test('should not allow users to continue unless every required field has been filled out', async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_11' },
    }))

    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockProsecutorQuery,
          ...mockUpdateCaseMutation(
            [
              {
                demands:
                  'Þess er krafist að Jon Harring, kt. 000000-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms Reykjavíkur, til miðvikudagsins 16. september 2020, kl. 19:51.',
              },
              { caseFacts: 'Lorem ipsum dolor sit amet,' } as UpdateCase,
              {
                legalArguments: 'Lorem ipsum dolor sit amet,',
              } as UpdateCase,
            ],
            'test_id_11',
          ),
        ]}
        addTypename={false}
      >
        <UserProvider>
          <StepFour />
        </UserProvider>
      </MockedProvider>,
    )

    // Act and Assert
    userEvent.type(
      await screen.findByLabelText('Málsatvik *'),
      'Lorem ipsum dolor sit amet,',
    )

    expect(
      (await screen.findByRole('button', {
        name: /Halda áfram/i,
      })) as HTMLButtonElement,
    ).toBeDisabled()

    userEvent.type(
      await screen.findByLabelText('Lagarök *'),
      'Lorem ipsum dolor sit amet,',
    )

    expect(
      await screen.findByRole('button', {
        name: /Halda áfram/i,
      }),
    ).not.toBeDisabled()
  })

  test('should not have a disabled continue button if step is valid when a valid request is opened', async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id' },
    }))

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <UserProvider>
          <StepFour />
        </UserProvider>
      </MockedProvider>,
    )

    // Assert
    expect(
      await screen.findByRole('button', {
        name: /Halda áfram/i,
      }),
    ).not.toBeDisabled()
  })
})
