import { WrappedActionFn } from '@island.is/portals/core'
import {
  UnlockListDocument,
  UnlockListMutation,
  UnlockListMutationVariables,
} from '../../../shared/mutations/unlockList.generated'

export const unlockListAction: WrappedActionFn = ({ client }) => async ({
  request,
  params,
}) => {
  console.log('HAHHSAHADHSHAFD')
  if (!params['listId']) {
    throw new Error('something went wrong')
  }

  const response = await client.mutate<
    UnlockListMutation,
    UnlockListMutationVariables
  >({
    mutation: UnlockListDocument,
    variables: {
      input: {
        listId: params['listId'],
      },
    },
  })
  console.log(response)
  return { data: response }
}
