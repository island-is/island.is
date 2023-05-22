import { z, ZodType } from 'zod'
import { WrappedActionFn } from '@island.is/portals/core'
import {
  validateFormData,
  ValidateFormDataResult,
} from '@island.is/react-spa/shared'
import {
  LockListDocument,
  LockListMutation,
  LockListMutationVariables,
} from '../../../shared/mutations/lockList.generated'

export const lockListAction: WrappedActionFn = ({ client }) => async ({
  request,
  params,
}) => {
  console.log('HAHHSAHADHSHAFD')
  if (!params['listId']) {
    throw new Error('something went wrong')
  }

  const response = await client.mutate<
    LockListMutation,
    LockListMutationVariables
  >({
    mutation: LockListDocument,
    variables: {
      input: {
        listId: params['listId'],
      },
    },
  })
  console.log(response)
  return { data: response }
}
