import React from 'react'
import { render, screen } from '@testing-library/react'
import { UpdateCase } from '@island.is/judicial-system/types'
import userEvent from '@testing-library/user-event'
import {
  mockCaseQueries,
  mockJudgeQuery,
  mockUpdateCaseMutation,
  mockUsersQuery,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { MockedProvider } from '@apollo/client/testing'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components'
import { HearingArrangements } from './HearingArrangements'

describe('/domari-krafa/fyrirtokutimi', () => {
  test('should not allow users to continue unless every required field has been filled out', async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_2' },
    }))

    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockJudgeQuery,
          ...mockUsersQuery,
          ...mockUpdateCaseMutation(
            [
              {
                courtDate: '2020-09-12',
              } as UpdateCase,
              {
                courtDate: '2020-09-12T14:51:00.000Z',
              } as UpdateCase,
              {
                courtRoom: '999',
              } as UpdateCase,
              {
                defenderName: 'Saul Goodman',
              } as UpdateCase,
              {
                defenderEmail: 'saul@goodman.com',
              } as UpdateCase,
              {
                judgeId: 'judge_1',
              } as UpdateCase,
              {
                registrarId: 'registrar_1',
              } as UpdateCase,
            ],
            'test_id_2',
          ),
        ]}
        addTypename={false}
      >
        <UserProvider>
          <HearingArrangements />
        </UserProvider>
      </MockedProvider>,
    )

    // Act
    userEvent.type(await screen.findByLabelText('Dómsalur *'), '999')

    userEvent.click(await screen.findByText('Veldu dómara'))
    userEvent.click(await screen.findByText('Wonder Woman'))

    userEvent.click(await screen.findByText('Veldu dómritara'))
    userEvent.click(await screen.findByText('Alfred Thaddeus Crane Pennyworth'))

    // Assert
    expect(
      (await screen.findByRole('button', {
        name: /Halda áfram/i,
      })) as HTMLButtonElement,
    ).not.toBeDisabled()
  })

  test('should not allow users to continue if the case has a DRAFT status code', async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_3' },
    }))

    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockJudgeQuery,
          ...mockUsersQuery,
          ...mockUpdateCaseMutation(
            [
              {
                courtDate: '2020-09-12',
              } as UpdateCase,
              {
                courtDate: '2020-09-12T14:51:00.000Z',
              } as UpdateCase,
              {
                courtRoom: '999',
              } as UpdateCase,
              {
                defenderName: 'Saul Goodman',
              } as UpdateCase,
              {
                defenderEmail: 'saul@goodman.com',
              } as UpdateCase,
            ],
            'test_id_3',
          ),
        ]}
        addTypename={false}
      >
        <UserProvider>
          <HearingArrangements />
        </UserProvider>
      </MockedProvider>,
    )

    // Assert
    expect(
      await screen.findByRole('button', {
        name: /Halda áfram/i,
      }),
    ).toBeDisabled()
  })

  test("should have a info box that informs the user that they can't continue until the case is no longer a DRAFT", async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_3' },
    }))

    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockJudgeQuery,
          ...mockUsersQuery,
          ...mockUpdateCaseMutation(
            [
              {
                courtDate: '2020-09-12',
              } as UpdateCase,
              {
                courtDate: '2020-09-12T14:51:00.000Z',
              } as UpdateCase,
              {
                defenderName: 'Saul Goodman',
              } as UpdateCase,
              {
                defenderEmail: 'saul@goodman.com',
              } as UpdateCase,
            ],
            'test_id_3',
          ),
        ]}
        addTypename={false}
      >
        <UserProvider>
          <HearingArrangements />
        </UserProvider>
      </MockedProvider>,
    )

    // Act

    // Assert
    expect(
      await screen.findByText('Krafa hefur ekki verið staðfest af ákæranda'),
    ).toBeInTheDocument()

    expect(
      await screen.findByText(
        'Þú getur úthlutað fyrirtökutíma, dómsal og verjanda en ekki er hægt að halda áfram fyrr en ákærandi hefur staðfest kröfuna.',
      ),
    ).toBeInTheDocument()
  })

  test('should have a prefilled court date with requested date', async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_3' },
    }))

    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockJudgeQuery,
          ...mockUsersQuery,
          ...mockUpdateCaseMutation(
            [
              {
                courtDate: '2020-09-16',
              } as UpdateCase,
              {
                courtDate: '2020-09-16T19:51:00.000Z',
              } as UpdateCase,
            ],
            'test_id_3',
          ),
        ]}
        addTypename={false}
      >
        <UserProvider>
          <HearingArrangements />
        </UserProvider>
      </MockedProvider>,
    )

    // Assert
    expect(
      ((await screen.findByLabelText(
        'Veldu dagsetningu *',
      )) as HTMLInputElement).value,
    ).toEqual('16.09.2020')

    expect(
      ((await screen.findByLabelText(
        'Tímasetning (kk:mm) *',
      )) as HTMLInputElement).value,
    ).toEqual('19:51')
  })
})
