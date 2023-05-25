import { WrappedActionFn } from '@island.is/portals/core'

import {
  LockListDocument,
  LockListMutation,
  LockListMutationVariables,
} from '../../../shared/mutations/lockList.generated'

export const lockListAction: WrappedActionFn = ({ client }) => async ({
  params,
}) => {
  if (!params['listId']) {
    throw new Error('something went wrong')
  }

  try {
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
    return {
      endorsementSystemLockEndorsementList:
        response.data?.endorsementSystemLockEndorsementList,
    }
  } catch (error) {
    return error
  }
}
