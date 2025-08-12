import faker from 'faker'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup'

import {
  CaseListEntry,
  CaseState,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  ApolloProviderWrapper,
  IntlProviderWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import { sortableTableColumn } from '../../types'
import TagCaseState from '../Tags/TagCaseState/TagCaseState'
import DefendantInfo from './DefendantInfo/DefendantInfo'
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
  let user: UserEvent

  beforeEach(() => {
    user = userEvent.setup()
    window.localStorage.clear()
  })

  const clickButtonByTestId = async (testId: string) => {
    const testIdElement = await screen.findByTestId(testId)
    await user.click(testIdElement)
  }

  it('should sort by date', async () => {
    const thead = [
      {
        title: 'Title',
        sortBy: 'indictmentAppealDeadline' as sortableTableColumn,
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

    await clickButtonByTestId('indictmentAppealDeadlineSortButton')

    const tableRows = await screen.findAllByTestId('tableRow')

    // The first click sorts by ascending order, so the first row should be the one with the earliest date
    expect(tableRows[0]).toHaveTextContent('2021-01-01T00:00:00Z')
    expect(tableRows[1]).toHaveTextContent('2021-01-02T00:00:00Z')

    await clickButtonByTestId('indictmentAppealDeadlineSortButton')

    // The second click sorts by descending order, so the first row should be the one with the latest date
    const tableRows2 = await screen.findAllByTestId('tableRow')
    expect(tableRows2[0]).toHaveTextContent('2021-01-02T00:00:00Z')
    expect(tableRows2[1]).toHaveTextContent('2021-01-01T00:00:00Z')
  })

  it('should sort by name', async () => {
    const thead = [
      {
        title: 'Name',
        sortBy: 'defendants' as sortableTableColumn,
      },
    ]

    const data: CaseListEntry[] = [
      {
        created: '2021-01-01T00:00:00Z',
        id: faker.datatype.uuid(),
        defendants: [{ id: '', nationalId: 'string', name: 'Jon Harring Sr.' }],
      },
      {
        created: '2021-01-02T00:00:00Z',
        id: faker.datatype.uuid(),
        defendants: [{ id: '', nationalId: 'string', name: 'Bono Stingsson' }],
      },
    ]

    render(
      <IntlProviderWrapper>
        <ApolloProviderWrapper>
          <Table
            thead={thead}
            data={data}
            columns={[
              {
                cell: (row) => <DefendantInfo defendants={row.defendants} />,
              },
            ]}
          />
        </ApolloProviderWrapper>
      </IntlProviderWrapper>,
    )

    await clickButtonByTestId('defendantsSortButton')

    const tableRows = await screen.findAllByTestId('tableRow')
    expect(tableRows[0]).toHaveTextContent('Bono Stingsson')
    expect(tableRows[1]).toHaveTextContent('Jon Harring Sr.')

    await clickButtonByTestId('defendantsSortButton')

    const tableRows2 = await screen.findAllByTestId('tableRow')
    expect(tableRows2[0]).toHaveTextContent('Jon Harring Sr.')
    expect(tableRows2[1]).toHaveTextContent('Bono Stingsson')
  })

  it('should sort by state', async () => {
    const thead = [
      {
        title: 'State',
        sortBy: 'state' as sortableTableColumn,
      },
    ]

    const data: CaseListEntry[] = [
      {
        created: '2021-01-01T00:00:00Z',
        id: faker.datatype.uuid(),
        state: CaseState.DRAFT,
      },
      {
        created: '2021-01-02T00:00:00Z',
        id: faker.datatype.uuid(),
        state: CaseState.SUBMITTED,
      },
    ]

    render(
      <IntlProviderWrapper>
        <ApolloProviderWrapper>
          <Table
            thead={thead}
            data={data}
            columns={[{ cell: (row) => <TagCaseState theCase={row} /> }]}
          />
        </ApolloProviderWrapper>
      </IntlProviderWrapper>,
    )

    await clickButtonByTestId('stateSortButton')

    const tableRows = await screen.findAllByTestId('tableRow')
    expect(tableRows[0]).toHaveTextContent('Drög')
    expect(tableRows[1]).toHaveTextContent('Sent')

    await clickButtonByTestId('stateSortButton')

    const tableRows2 = await screen.findAllByTestId('tableRow')
    expect(tableRows2[0]).toHaveTextContent('Sent')
    expect(tableRows2[1]).toHaveTextContent('Drög')
  })
})
