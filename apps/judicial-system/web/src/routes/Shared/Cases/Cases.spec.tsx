import { MockedProvider } from '@apollo/client/testing'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { UserProvider } from '@island.is/judicial-system-web/src/components'
import {
  CaseAppealDecision,
  CaseState,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  mockJudgeQuery,
  mockProsecutorQuery,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { LocaleProvider } from '@island.is/localization'

import Cases from './Cases'
import { CasesDocument } from './cases.generated'

import '@testing-library/jest-dom'

const mockCasesQuery = [
  {
    request: {
      query: CasesDocument,
    },
    result: {
      data: {
        cases: [
          {
            id: 'test_id_1',
            modified: '2020-09-16T19:51:39.466Z',
            created: '2020-09-16T19:50:08.033Z',
            state: CaseState.DRAFT,
            policeCaseNumbers: ['string'],
            defendants: [{ nationalId: 'string', name: 'Jon Harring Sr.' }],
            validToDate: null,
            parentCase: {
              id: '1337',
            },
          },
          {
            id: 'test_id_2',
            created: '2020-12-16T19:50:08.033Z',
            modified: '2020-12-16T19:51:39.466Z',
            state: CaseState.DRAFT,
            policeCaseNumbers: ['string'],
            defendants: [{ nationalId: 'string', name: 'Jon Harring' }],
            validToDate: null,
          },
          {
            id: 'test_id_3',
            created: '2020-05-16T19:50:08.033Z',
            modified: '2020-09-16T19:51:39.466Z',
            state: CaseState.ACCEPTED,
            policeCaseNumbers: ['008-2020-X'],
            defendants: [{ nationalId: '012345-6789', name: 'Mikki Refur' }],
            validToDate: '2020-11-11T12:31:00.000Z',
            accusedAppealDecision: CaseAppealDecision.APPEAL,
            rulingSignatureDate: '2020-09-16T19:51:39.466Z',
          },
          {
            id: 'test_id_4',
            created: '2020-08-16T19:50:08.033Z',
            modified: '2020-09-16T19:51:39.466Z',
            state: CaseState.NEW,
            policeCaseNumbers: ['008-2020-X'],
            defendants: [
              { nationalId: '012345-6789', name: 'Erlingur L Kristinsson' },
            ],
            validToDate: '2020-11-11T12:31:00.000Z',
          },
          {
            id: 'test_id_5',
            created: '2020-08-16T19:50:08.033Z',
            modified: '2020-09-16T19:51:39.466Z',
            state: CaseState.DELETED,
            policeCaseNumbers: ['008-2020-X'],
            defendants: [
              { nationalId: '012345-6789', name: 'Erlingur L Kristinsson' },
            ],
            validToDate: '2020-11-11T12:31:00.000Z',
          },
          {
            id: 'test_id_6',
            created: '2021-01-16T19:50:08.033Z',
            modified: '2021-01-16T19:51:39.466Z',
            state: CaseState.RECEIVED,
            policeCaseNumbers: ['008-2020-X'],
            defendants: [{ nationalId: '012345-6789', name: 'D. M. Kil' }],
            validToDate: '2020-11-11T12:31:00.000Z',
          },
          {
            id: 'test_id_7',
            created: '2021-02-16T19:50:08.033Z',
            modified: '2021-02-16T19:51:39.466Z',
            state: CaseState.SUBMITTED,
            policeCaseNumbers: ['008-2020-X'],
            defendants: [{ nationalId: '012345-6789', name: 'Moe' }],
            validToDate: '2020-11-11T12:31:00.000Z',
          },
        ],
      },
    },
  },
]

const mockCourtCasesQuery = [
  {
    request: {
      query: CasesDocument,
    },
    result: {
      data: {
        cases: [
          {
            id: 'test_id_1',
            modified: '2020-09-16T19:51:39.466Z',
            created: '2020-09-16T19:50:08.033Z',
            state: CaseState.DRAFT,
            policeCaseNumbers: ['string'],
            defendants: [{ nationalId: 'string', name: 'Jon Harring Sr.' }],
            validToDate: null,
            parentCase: {
              id: '1337',
            },
          },
          {
            id: 'test_id_2',
            created: '2020-12-16T19:50:08.033Z',
            modified: '2020-12-16T19:51:39.466Z',
            state: CaseState.DRAFT,
            policeCaseNumbers: ['string'],
            defendants: [{ nationalId: 'string', name: 'Jon Harring' }],
            validToDate: null,
          },
          {
            id: 'test_id_3',
            created: '2020-05-16T19:50:08.033Z',
            modified: '2020-09-16T19:51:39.466Z',
            state: CaseState.ACCEPTED,
            policeCaseNumbers: ['008-2020-X'],
            defendants: [{ nationalId: '012345-6789', name: 'Mikki Refur' }],
            validToDate: '2020-11-11T12:31:00.000Z',
            accusedAppealDecision: CaseAppealDecision.APPEAL,
            rulingSignatureDate: '2020-09-16T19:51:39.466Z',
          },
          {
            id: 'test_id_5',
            created: '2020-08-16T19:50:08.033Z',
            modified: '2020-09-16T19:51:39.466Z',
            state: CaseState.DELETED,
            policeCaseNumbers: ['008-2020-X'],
            defendants: [
              { nationalId: '012345-6789', name: 'Erlingur L Kristinsson' },
            ],
            validToDate: '2020-11-11T12:31:00.000Z',
          },
          {
            id: 'test_id_6',
            created: '2021-01-16T19:50:08.033Z',
            modified: '2021-01-16T19:51:39.466Z',
            state: CaseState.RECEIVED,
            policeCaseNumbers: ['008-2020-X'],
            defendants: [{ nationalId: '012345-6789', name: 'D. M. Kil' }],
            validToDate: '2020-11-11T12:31:00.000Z',
          },
          {
            id: 'test_id_7',
            created: '2021-02-16T19:50:08.033Z',
            modified: '2021-02-16T19:51:39.466Z',
            state: CaseState.SUBMITTED,
            policeCaseNumbers: ['008-2020-X'],
            defendants: [{ nationalId: '012345-6789', name: 'Moe' }],
            validToDate: '2020-11-11T12:31:00.000Z',
          },
        ],
      },
    },
  },
]

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '',
    }
  },
}))

describe('Cases', () => {
  describe('Prosecutor users', () => {
    test('should not show deleted or past cases', async () => {
      render(
        <MockedProvider
          mocks={[...mockCasesQuery, ...mockProsecutorQuery]}
          addTypename={false}
        >
          <UserProvider authenticated={true}>
            <LocaleProvider locale="is" messages={{}}>
              <Cases />
            </LocaleProvider>
          </UserProvider>
        </MockedProvider>,
      )

      expect(
        await waitFor(() => screen.getAllByTestId('tableRow').length),
      ).toEqual(5)
    })

    test('should display the prosecutor logo', async () => {
      render(
        <MockedProvider
          mocks={[...mockCasesQuery, ...mockProsecutorQuery]}
          addTypename={false}
        >
          <UserProvider authenticated={true}>
            <LocaleProvider locale="is" messages={{}}>
              <Cases />
            </LocaleProvider>
          </UserProvider>
        </MockedProvider>,
      )

      expect(await screen.findByText('Lögreglustjórinn á')).toBeInTheDocument()
      expect(await screen.findByText('höfuðborgarsvæðinu')).toBeInTheDocument()
    })

    test('should list all active cases in a list', async () => {
      render(
        <MockedProvider
          mocks={[...mockCasesQuery, ...mockProsecutorQuery]}
          addTypename={false}
        >
          <UserProvider authenticated={true}>
            <LocaleProvider locale="is" messages={{}}>
              <Cases />
            </LocaleProvider>
          </UserProvider>
        </MockedProvider>,
      )

      expect((await screen.findAllByTestId('tableRow')).length).toEqual(5)
    })
  })

  describe('Court users', () => {
    test('should display the judge logo', async () => {
      render(
        <MockedProvider
          mocks={[...mockCourtCasesQuery, ...mockJudgeQuery]}
          addTypename={false}
        >
          <UserProvider authenticated={true}>
            <LocaleProvider locale="is" messages={{}}>
              <Cases />
            </LocaleProvider>
          </UserProvider>
        </MockedProvider>,
      )

      expect(await screen.findByText('Héraðsdómur')).toBeInTheDocument()
      expect(await screen.findByText('Reykjavíkur')).toBeInTheDocument()
    })

    test('should not display a button to create a cases', async () => {
      render(
        <MockedProvider
          mocks={[...mockCourtCasesQuery, ...mockJudgeQuery]}
          addTypename={false}
        >
          <UserProvider>
            <LocaleProvider locale="is" messages={{}}>
              <Cases />
            </LocaleProvider>
          </UserProvider>
        </MockedProvider>,
      )

      expect(
        await waitFor(() => screen.queryByTestId('createCaseDropdown')),
      ).not.toBeInTheDocument()
    })

    test('should not display a button to delete a cases', async () => {
      render(
        <MockedProvider
          mocks={[...mockCourtCasesQuery, ...mockJudgeQuery]}
          addTypename={false}
        >
          <UserProvider>
            <LocaleProvider locale="is" messages={{}}>
              <Cases />
            </LocaleProvider>
          </UserProvider>
        </MockedProvider>,
      )

      expect(
        await waitFor(() => screen.queryByLabelText('Viltu eyða drögum?')),
      ).not.toBeInTheDocument()
    })
  })

  describe('All user types - sorting', () => {
    test('should order the table data by accused name in ascending order when the user clicks the accused name table header', async () => {
      const user = userEvent.setup()
      render(
        <MockedProvider
          mocks={[...mockCasesQuery, ...mockProsecutorQuery]}
          addTypename={false}
        >
          <UserProvider authenticated={true}>
            <LocaleProvider locale="is" messages={{}}>
              <Cases />
            </LocaleProvider>
          </UserProvider>
        </MockedProvider>,
      )

      await user.click(await screen.findByTestId('defendantsSortButton'))

      const tableRows = await screen.findAllByTestId('tableRow')

      expect(tableRows[0]).toHaveTextContent('D. M. Kil')
      expect(tableRows[1]).toHaveTextContent('Erlingur L Kristinsson')
      expect(tableRows[2]).toHaveTextContent('Jon Harring')
      expect(tableRows[3]).toHaveTextContent('Jon Harring Sr.')
      expect(tableRows[4]).toHaveTextContent('Moe')
    })

    test('should order the table data by accused name in descending order when the user clicks the accused name table header twice', async () => {
      const user = userEvent.setup()
      render(
        <MockedProvider
          mocks={[...mockCasesQuery, ...mockProsecutorQuery]}
          addTypename={false}
        >
          <UserProvider authenticated={true}>
            <LocaleProvider locale="is" messages={{}}>
              <Cases />
            </LocaleProvider>
          </UserProvider>
        </MockedProvider>,
      )

      await user.dblClick(await screen.findByTestId('defendantsSortButton'))

      const tableRows = await screen.findAllByTestId('tableRow')

      expect(tableRows[0]).toHaveTextContent('D. M. Kil')
      expect(tableRows[1]).toHaveTextContent('Erlingur L Kristinsson')
      expect(tableRows[2]).toHaveTextContent('Jon Harring')
      expect(tableRows[3]).toHaveTextContent('Jon Harring Sr.')
      expect(tableRows[4]).toHaveTextContent('Moe')
    })

    test('should order the table data by created in ascending order when the user clicks the created table header', async () => {
      const user = userEvent.setup()
      render(
        <MockedProvider
          mocks={[...mockCasesQuery, ...mockProsecutorQuery]}
          addTypename={false}
        >
          <UserProvider authenticated={true}>
            <LocaleProvider locale="is" messages={{}}>
              <Cases />
            </LocaleProvider>
          </UserProvider>
        </MockedProvider>,
      )

      await user.click(await screen.findByTestId('createdSortButton'))

      const tableRows = await screen.findAllByTestId('tableRow')

      expect(tableRows[0]).toHaveTextContent('Erlingur L Kristinsson')
      expect(tableRows[1]).toHaveTextContent('Jon Harring Sr.')
      expect(tableRows[2]).toHaveTextContent('Jon Harring')
      expect(tableRows[3]).toHaveTextContent('D. M. Kil')
      expect(tableRows[4]).toHaveTextContent('Moe')
    })

    test('should order the table data by created in acending order when the user clicks the created table header twice', async () => {
      const user = userEvent.setup()
      render(
        <MockedProvider
          mocks={[...mockCasesQuery, ...mockProsecutorQuery]}
          addTypename={false}
        >
          <UserProvider authenticated={true}>
            <LocaleProvider locale="is" messages={{}}>
              <Cases />
            </LocaleProvider>
          </UserProvider>
        </MockedProvider>,
      )

      await user.dblClick(await screen.findByTestId('createdSortButton'))

      const tableRows = await screen.findAllByTestId('tableRow')

      expect(tableRows[0]).toHaveTextContent('Erlingur L Kristinsson')
      expect(tableRows[1]).toHaveTextContent('Jon Harring Sr.')
      expect(tableRows[2]).toHaveTextContent('Jon Harring')
      expect(tableRows[3]).toHaveTextContent('D. M. Kil')
      expect(tableRows[4]).toHaveTextContent('Moe')
    })
  })

  describe('All user types - error handling', () => {
    test('should display an error alert if the api call fails', async () => {
      render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: CasesDocument,
              },
              error: { name: 'error', message: 'message' },
            },
            ...mockProsecutorQuery,
          ]}
          addTypename={false}
        >
          <UserProvider>
            <LocaleProvider locale="is" messages={{}}>
              <Cases />
            </LocaleProvider>
          </UserProvider>
        </MockedProvider>,
      )

      expect(screen.queryByRole('table')).not.toBeInTheDocument()
      expect(
        await screen.findByText(
          'Ekki tókst að ná sambandi við gagnagrunn. Málið hefur verið skráð og viðeigandi aðilar látnir vita. Vinsamlega reynið aftur síðar.',
        ),
      ).toBeInTheDocument()
    })
  })
})
