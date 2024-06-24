import faker from 'faker'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { CaseListEntry } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  ApolloProviderWrapper,
  IntlProviderWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import { sortableTableColumn } from '../../types'
import Table from './Table'

import '@testing-library/react'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '',
      query: {
        id: 'test_id',
      },
    }
  },
}))

describe('Table', () => {
  it('should sort by deadline', async () => {
    const user = userEvent.setup()

    const thead = [
      {
        title: 'Title',
        sortable: {
          isSortable: true,
          key: 'indictmentAppealDeadline' as sortableTableColumn,
        },
      },
    ]

    const data: CaseListEntry[] = [
      {
        created: '2021-01-01T00:00:00Z',
        id: faker.datatype.uuid(),
        indictmentAppealDeadline: '2021-01-01T00:00:00Z',
      },
      {
        created: '2021-01-02T00:00:00Z',
        id: faker.datatype.uuid(),
        indictmentAppealDeadline: '2021-01-02T00:00:00Z',
      },
    ]

    const columns = [
      {
        cell: (row: CaseListEntry) => <p>{row.indictmentAppealDeadline}</p>,
      },
    ]

    render(
      <IntlProviderWrapper>
        <ApolloProviderWrapper>
          <Table thead={thead} data={data} columns={columns} />
        </ApolloProviderWrapper>
      </IntlProviderWrapper>,
    )

    await act(async () => {
      await user.click(
        await screen.findByTestId('indictmentAppealDeadlineSortButton'),
      )
    })

    const tableRows = await screen.findAllByTestId('tableRow')

    // The first click sorts by ascending order, so the first row should be the one with the earliest date
    expect(tableRows[0]).toHaveTextContent('2021-01-01T00:00:00Z')
    expect(tableRows[1]).toHaveTextContent('2021-01-02T00:00:00Z')

    await act(async () => {
      await user.click(
        await screen.findByTestId('indictmentAppealDeadlineSortButton'),
      )
    })

    // The second click sorts by descending order, so the first row should be the one with the latest date
    const tableRows2 = await screen.findAllByTestId('tableRow')
    expect(tableRows2[0]).toHaveTextContent('2021-01-02T00:00:00Z')
    expect(tableRows2[1]).toHaveTextContent('2021-01-01T00:00:00Z')
  })
})
