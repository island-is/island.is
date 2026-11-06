import type { FC, PropsWithChildren } from 'react'
import type { MockedResponse } from '@apollo/client/testing'
import { MockedProvider } from '@apollo/client/testing'
import { act, renderHook } from '@testing-library/react'

import { CaseTransition } from '@island.is/judicial-system-web/src/graphql/schema'
import { IntlProviderWrapper } from '@island.is/judicial-system-web/src/utils/testHelpers'
import { toast } from '@island.is/judicial-system-web/src/utils/toast'

import useCase from './index'
import { TransitionCaseDocument } from './transitionCase.generated'

jest.mock('@island.is/judicial-system-web/src/utils/toast', () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}))

const caseId = 'case-1'

const renderUseCase = (mocks: MockedResponse[]) => {
  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <MockedProvider mocks={mocks}>
      <IntlProviderWrapper>{children}</IntlProviderWrapper>
    </MockedProvider>
  )

  return renderHook(() => useCase(), { wrapper: Wrapper })
}

describe('useCase', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Callers act on the returned flag only. The hook owns the error toast, so
  // a failed transition is reported exactly once however it failed.
  describe('transitionCase', () => {
    const request = {
      query: TransitionCaseDocument,
      variables: { input: { id: caseId, transition: CaseTransition.OPEN } },
    }

    it('is true without a toast when the case was transitioned', async () => {
      const { result } = renderUseCase([
        {
          request,
          result: {
            data: {
              transitionCase: {
                __typename: 'Case',
                state: 'SUBMITTED',
                rulingDate: null,
                appealCase: null,
              },
            },
          },
        },
      ])

      let transitioned: boolean | undefined
      await act(async () => {
        transitioned = await result.current.transitionCase(
          caseId,
          CaseTransition.OPEN,
        )
      })

      expect(transitioned).toBe(true)
      expect(toast.error).not.toHaveBeenCalled()
    })

    it('is false with one toast when the request fails', async () => {
      const { result } = renderUseCase([
        { request, error: new Error('network down') },
      ])

      let transitioned: boolean | undefined
      await act(async () => {
        transitioned = await result.current.transitionCase(
          caseId,
          CaseTransition.OPEN,
        )
      })

      expect(transitioned).toBe(false)
      expect(toast.error).toHaveBeenCalledTimes(1)
      expect(toast.error).toHaveBeenCalledWith(
        'Upp kom villa við að uppfæra stöðu máls',
      )
    })

    it('is false with one toast when the server answers without a state', async () => {
      const { result } = renderUseCase([
        {
          request,
          result: {
            data: {
              transitionCase: {
                __typename: 'Case',
                state: null,
                rulingDate: null,
                appealCase: null,
              },
            },
          },
        },
      ])

      let transitioned: boolean | undefined
      await act(async () => {
        transitioned = await result.current.transitionCase(
          caseId,
          CaseTransition.OPEN,
        )
      })

      expect(transitioned).toBe(false)
      expect(toast.error).toHaveBeenCalledTimes(1)
    })
  })
})
