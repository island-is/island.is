import type { FC, PropsWithChildren } from 'react'
import { GraphQLError } from 'graphql'
import type { MockedResponse } from '@apollo/client/testing'
import { MockedProvider } from '@apollo/client/testing'
import { act, renderHook, waitFor } from '@testing-library/react'

import { CaseType } from '@island.is/judicial-system-web/src/graphql/schema'
import { mockCase } from '@island.is/judicial-system-web/src/utils/mocks'
import {
  FormContextWrapper,
  IntlProviderWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'
import { toast } from '@island.is/judicial-system-web/src/utils/toast'

import { GetSignedUrlDocument } from './getSignedUrl.generated'
import useFileList, {
  isFileNotFoundError,
  resolveLocalFilePreview,
} from './index'

jest.mock('@island.is/judicial-system-web/src/utils/toast', () => ({
  toast: { error: jest.fn(), success: jest.fn(), warning: jest.fn() },
}))

describe('resolveLocalFilePreview', () => {
  it('returns unavailable when originalFileObj is missing', () => {
    expect(resolveLocalFilePreview({})).toEqual({ action: 'unavailable' })
    expect(resolveLocalFilePreview({ originalFileObj: undefined })).toEqual({
      action: 'unavailable',
    })
  })

  it('returns the blob when originalFileObj is present', () => {
    const blob = new Blob(['pdf'], { type: 'application/pdf' })

    expect(resolveLocalFilePreview({ originalFileObj: blob })).toEqual({
      action: 'createObjectURL',
      blob,
    })
  })
})

describe('isFileNotFoundError', () => {
  const withCode = (code: string) => ({
    graphQLErrors: [new GraphQLError('failed', { extensions: { code } })],
  })

  it('is true for a missing or inaccessible file', () => {
    expect(isFileNotFoundError(withCode('https://httpstatuses.org/404'))).toBe(
      true,
    )
    expect(isFileNotFoundError(withCode('https://httpstatuses.org/403'))).toBe(
      true,
    )
  })

  it('is false for any other failure', () => {
    expect(isFileNotFoundError(withCode('https://httpstatuses.org/500'))).toBe(
      false,
    )
    expect(isFileNotFoundError({ graphQLErrors: [] })).toBe(false)
  })
})

describe('useFileList - getFileUrl', () => {
  const caseId = 'case-1'
  const fileId = 'file-1'
  const request = {
    query: GetSignedUrlDocument,
    variables: { input: { id: fileId, caseId } },
  }

  const renderUseFileList = (mocks: MockedResponse[]) => {
    const Wrapper: FC<PropsWithChildren> = ({ children }) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        <IntlProviderWrapper>
          <FormContextWrapper theCase={mockCase(CaseType.INDICTMENT)}>
            {children}
          </FormContextWrapper>
        </IntlProviderWrapper>
      </MockedProvider>
    )

    return renderHook(() => useFileList({ caseId }), { wrapper: Wrapper })
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns the signed url without a toast', async () => {
    const { result } = renderUseFileList([
      {
        request,
        result: { data: { getSignedUrl: { url: 'https://files/file-1' } } },
      },
    ])

    let url: string | undefined
    await act(async () => {
      url = await result.current.getFileUrl(fileId)
    })

    expect(url).toBe('https://files/file-1')
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('reports a failed request once', async () => {
    const { result } = renderUseFileList([
      { request, error: new Error('network down') },
    ])

    let url: string | undefined
    await act(async () => {
      url = await result.current.getFileUrl(fileId)
    })

    expect(url).toBeUndefined()
    expect(toast.error).toHaveBeenCalledTimes(1)
    expect(toast.error).toHaveBeenCalledWith('Upp kom villa við að opna skjal')
  })

  // A missing or inaccessible file is shown in the FileNotFoundModal, which
  // every consumer renders from fileNotFound, so it is not toasted as well.
  it('marks a missing file not found without a toast', async () => {
    const { result } = renderUseFileList([
      {
        request,
        result: {
          errors: [
            new GraphQLError('Not found', {
              extensions: { code: 'https://httpstatuses.org/404' },
            }),
          ],
        },
      },
    ])

    let url: string | undefined
    await act(async () => {
      url = await result.current.getFileUrl(fileId)
    })

    expect(url).toBeUndefined()
    await waitFor(() => expect(result.current.fileNotFound).toBe(true))
    expect(toast.error).not.toHaveBeenCalled()
  })
})
