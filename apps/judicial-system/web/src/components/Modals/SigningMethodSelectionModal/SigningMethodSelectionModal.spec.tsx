import { GraphQLError } from 'graphql'
import type { MockedResponse } from '@apollo/client/testing'
import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { CaseType } from '@island.is/judicial-system-web/src/graphql/schema'
import { RequestCourtRecordSignatureDocument } from '@island.is/judicial-system-web/src/routes/Shared/SignedVerdictOverview/requestCourtRecordSignature.generated'
import { mockCase } from '@island.is/judicial-system-web/src/utils/mocks'
import { IntlProviderWrapper } from '@island.is/judicial-system-web/src/utils/testHelpers'
import { toast } from '@island.is/judicial-system-web/src/utils/toast'

import { RequestRulingSignatureDocument } from './requestRulingSignature.generated'
import type { SignatureType } from './SigningMethodSelectionModal'
import { SigningMethodSelectionModal } from './SigningMethodSelectionModal'

jest.mock('@island.is/judicial-system-web/src/utils/toast', () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}))

const workingCase = {
  ...mockCase(CaseType.CUSTODY),
  courtCaseNumber: 'R-1/2026',
}

const documents = {
  ruling: RequestRulingSignatureDocument,
  courtRecord: RequestCourtRecordSignatureDocument,
}

const fieldNames = {
  ruling: 'requestRulingSignature',
  courtRecord: 'requestCourtRecordSignature',
}

const renderModal = (
  signatureType: SignatureType,
  mocks: MockedResponse[],
  onSignatureRequested = jest.fn(),
) => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <IntlProviderWrapper>
        <SigningMethodSelectionModal
          workingCase={workingCase}
          signatureType={signatureType}
          onClose={jest.fn()}
          onSignatureRequested={onSignatureRequested}
        />
      </IntlProviderWrapper>
    </MockedProvider>,
  )

  return { onSignatureRequested }
}

const requestFor = (signatureType: SignatureType, method: string) => ({
  query: documents[signatureType],
  variables: { input: { caseId: workingCase.id, method } },
})

describe('SigningMethodSelectionModal', () => {
  // The Modal resolves its portal target while rendering, so the container
  // PageLayout normally supplies has to exist before the first render.
  let modalRoot: HTMLDivElement

  beforeEach(() => {
    jest.clearAllMocks()
    modalRoot = document.createElement('div')
    modalRoot.id = 'modal'
    document.body.appendChild(modalRoot)
  })

  afterEach(() => {
    modalRoot.remove()
  })

  it('reports a failed ruling signature request once', async () => {
    renderModal('ruling', [
      {
        request: requestFor('ruling', 'audkenni'),
        error: new Error('network down'),
      },
    ])

    fireEvent.click(screen.getByText('Auðkennisappið'))

    await waitFor(() => expect(toast.error).toHaveBeenCalled())

    expect(toast.error).toHaveBeenCalledTimes(1)
    expect(toast.error).toHaveBeenCalledWith(
      'Upp kom villa við undirritun úrskurðar',
    )
  })

  it('reports a failed court record signature request once', async () => {
    renderModal('courtRecord', [
      {
        request: requestFor('courtRecord', 'mobile'),
        result: { errors: [new GraphQLError('signing service unavailable')] },
      },
    ])

    fireEvent.click(screen.getByText('Rafræn skilríki'))

    await waitFor(() => expect(toast.error).toHaveBeenCalled())

    expect(toast.error).toHaveBeenCalledTimes(1)
    expect(toast.error).toHaveBeenCalledWith(
      'Upp kom villa við undirritun þingbókar',
    )
  })

  it('hands a successful signature request to the caller without a toast', async () => {
    const response = { controlCode: '1234', documentToken: 'token' }
    const { onSignatureRequested } = renderModal('ruling', [
      {
        request: requestFor('ruling', 'audkenni'),
        result: { data: { [fieldNames.ruling]: response } },
      },
    ])

    fireEvent.click(screen.getByText('Auðkennisappið'))

    await waitFor(() =>
      expect(onSignatureRequested).toHaveBeenCalledWith(response, true),
    )

    expect(toast.error).not.toHaveBeenCalled()
  })
})
