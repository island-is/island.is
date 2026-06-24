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
})
