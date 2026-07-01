import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  Case,
  CaseFile,
  CaseFileState,
} from '@island.is/judicial-system-web/src/graphql/schema'

import {
  ApolloProviderWrapper,
  FormContextWrapper,
  IntlProviderWrapper,
} from '../../../utils/testHelpers'
import CaseFileTable from './CaseFileTable'

jest.mock('next/router', () => ({
  useRouter() {
    return { pathname: '', query: { id: 'test_id' } }
  },
}))

const renderTable = (caseFiles: CaseFile[], onOpenFile = jest.fn()) => {
  render(
    <IntlProviderWrapper>
      <ApolloProviderWrapper>
        <FormContextWrapper theCase={{ id: 'case-1' } as Case}>
          <CaseFileTable
            caseFiles={caseFiles}
            onOpenFile={onOpenFile}
            canRejectFiles={false}
          />
        </FormContextWrapper>
      </ApolloProviderWrapper>
    </IntlProviderWrapper>,
  )

  return onOpenFile
}

describe('<CaseFileTable />', () => {
  test('should expose a keyboard accessible button for an accepted file', async () => {
    const onOpenFile = renderTable([
      {
        id: 'file-1',
        userGeneratedFilename: 'document.pdf',
        state: CaseFileState.STORED_IN_RVG,
      } as CaseFile,
    ])

    const button = screen.getByRole('button', { name: 'Opna document.pdf' })
    expect(button).toHaveAttribute('tabindex', '0')

    button.focus()
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard(' ')

    expect(onOpenFile).toHaveBeenCalledTimes(2)
    expect(onOpenFile).toHaveBeenCalledWith('file-1')
  })

  test('should not render a button for a rejected file', () => {
    renderTable([
      {
        id: 'file-1',
        userGeneratedFilename: 'document.pdf',
        state: CaseFileState.REJECTED,
      } as CaseFile,
    ])

    expect(
      screen.queryByRole('button', { name: 'Opna document.pdf' }),
    ).not.toBeInTheDocument()
  })

  it('reflects the sort state on sortable headers via aria-sort', async () => {
    const user = userEvent.setup()

    renderTable([
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
    ] as CaseFile[])

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
