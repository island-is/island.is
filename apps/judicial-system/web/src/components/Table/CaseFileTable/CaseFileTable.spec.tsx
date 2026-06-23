import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { CaseFile } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  ApolloProviderWrapper,
  IntlProviderWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import CaseFileTable from './CaseFileTable'

import '@testing-library/react'

jest.mock('next/router', () => ({
  useRouter() {
    return { pathname: '', query: { id: 'test_id' } }
  },
}))

describe('CaseFileTable', () => {
  let user: ReturnType<typeof userEvent.setup>

  const caseFiles = [
    {
      id: '1',
      name: 'Skjal A',
      userGeneratedFilename: 'Skjal A',
      submittedBy: 'Jon Jonsson',
      created: '2021-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Skjal B',
      userGeneratedFilename: 'Skjal B',
      submittedBy: 'Anna Onnudottir',
      created: '2021-01-02T00:00:00Z',
    },
  ] as CaseFile[]

  const renderTable = () =>
    render(
      <IntlProviderWrapper>
        <ApolloProviderWrapper>
          <CaseFileTable
            caseFiles={caseFiles}
            onOpenFile={jest.fn()}
            canRejectFiles={false}
          />
        </ApolloProviderWrapper>
      </IntlProviderWrapper>,
    )

  beforeEach(() => {
    user = userEvent.setup()
  })

  it('reflects the sort state on sortable headers via aria-sort', async () => {
    renderTable()

    // The table is sorted by the received/created column by default.
    expect(
      screen.getByRole('columnheader', { name: /Nafn skjals/ }),
    ).toHaveAttribute('aria-sort', 'none')
    expect(
      screen.getByRole('columnheader', { name: /Móttekið/ }),
    ).toHaveAttribute('aria-sort', 'descending')

    await user.click(
      screen.getByRole('button', { name: 'Raða eftir dálki: Nafn skjals' }),
    )

    expect(
      screen.getByRole('columnheader', { name: /Nafn skjals/ }),
    ).toHaveAttribute('aria-sort', 'ascending')
    expect(
      screen.getByRole('columnheader', { name: /Móttekið/ }),
    ).toHaveAttribute('aria-sort', 'none')
  })
})
