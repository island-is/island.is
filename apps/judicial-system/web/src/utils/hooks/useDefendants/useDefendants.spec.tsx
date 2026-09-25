import type { FC, PropsWithChildren } from 'react'
import { GraphQLError } from 'graphql'
import type { MockedResponse } from '@apollo/client/testing'
import { MockedProvider } from '@apollo/client/testing'
import { act, renderHook } from '@testing-library/react'

import { IntlProviderWrapper } from '@island.is/judicial-system-web/src/utils/testHelpers'
import { toast } from '@island.is/judicial-system-web/src/utils/toast'

import { CreateDefendantDocument } from './createDefendant.generated'
import { DeleteDefendantDocument } from './deleteDefendant.generated'
import useDefendants from './index'

jest.mock('@island.is/judicial-system-web/src/utils/toast', () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}))

const caseId = 'case-1'
const defendantId = 'defendant-1'

const renderUseDefendants = (mocks: MockedResponse[]) => {
  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <MockedProvider mocks={mocks}>
      <IntlProviderWrapper>{children}</IntlProviderWrapper>
    </MockedProvider>
  )

  return renderHook(() => useDefendants(), { wrapper: Wrapper })
}

describe('useDefendants', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('deleteDefendant', () => {
    const request = {
      query: DeleteDefendantDocument,
      variables: { input: { caseId, defendantId } },
    }

    it('is true without an error when the defendant was deleted', async () => {
      const { result } = renderUseDefendants([
        {
          request,
          result: {
            data: {
              deleteDefendant: {
                __typename: 'DeleteDefendantResponse',
                deleted: true,
              },
            },
          },
        },
      ])

      let deleted: boolean | undefined
      await act(async () => {
        deleted = await result.current.deleteDefendant(caseId, defendantId)
      })

      expect(deleted).toBe(true)
      expect(toast.error).not.toHaveBeenCalled()
    })

    it('reports an error when the server answers without deleting', async () => {
      const { result } = renderUseDefendants([
        {
          request,
          result: {
            data: {
              deleteDefendant: {
                __typename: 'DeleteDefendantResponse',
                deleted: false,
              },
            },
          },
        },
      ])

      let deleted: boolean | undefined
      await act(async () => {
        deleted = await result.current.deleteDefendant(caseId, defendantId)
      })

      expect(deleted).toBe(false)
      expect(toast.error).toHaveBeenCalledWith(
        'Upp kom villa við að eyða varnaraðila',
      )
    })

    it('reports an error when the request fails', async () => {
      const { result } = renderUseDefendants([
        { request, result: { errors: [new GraphQLError('Forbidden')] } },
      ])

      let deleted: boolean | undefined
      await act(async () => {
        deleted = await result.current.deleteDefendant(caseId, defendantId)
      })

      expect(deleted).toBe(false)
      expect(toast.error).toHaveBeenCalledWith(
        'Upp kom villa við að eyða varnaraðila',
      )
    })
  })

  describe('createDefendant', () => {
    const request = {
      query: CreateDefendantDocument,
      variables: { input: { caseId } },
    }

    it('resolves to the id of the created defendant', async () => {
      const { result } = renderUseDefendants([
        {
          request,
          result: {
            data: {
              createDefendant: { __typename: 'Defendant', id: defendantId },
            },
          },
        },
      ])

      let createdId: string | undefined
      await act(async () => {
        createdId = await result.current.createDefendant({ caseId })
      })

      expect(createdId).toBe(defendantId)
      expect(toast.error).not.toHaveBeenCalled()
    })

    it('reports an error and resolves to undefined when the request fails', async () => {
      const { result } = renderUseDefendants([
        { request, result: { errors: [new GraphQLError('Forbidden')] } },
      ])

      let createdId: string | undefined
      await act(async () => {
        createdId = await result.current.createDefendant({ caseId })
      })

      expect(createdId).toBeUndefined()
      expect(toast.error).toHaveBeenCalledWith(
        'Upp kom villa við að stofna nýjan varnaraðila',
      )
    })
  })
})
