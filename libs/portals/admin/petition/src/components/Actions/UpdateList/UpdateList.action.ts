import { WrappedActionFn } from '@island.is/portals/core'
import {
  UpdateListDocument,
  UpdateListMutation,
  UpdateListMutationVariables,
} from '../../../shared/mutations/updateList.generated'
import { isValidDate } from '@island.is/shared/utils'
import parseDate from 'date-fns/parse'

export const transformDate = (val: string) => {
  if (isValidDate(new Date(val))) {
    return val
  }

  return parseDate(val, 'dd.MM.yyyy', new Date())
}
export const updateListAction: WrappedActionFn = ({ client }) => async ({
  request,
  params,
}) => {
  const formData = await request.formData()

  const openedDate = formData.get('openedDate') as string
  const closedDate = formData.get('closedDate') as string

  const description = formData.get('description') as string
  const title = formData.get('title') as string

  if (!params['listId']) {
    throw new Error('something went wrong')
  }

  const response = await client.mutate<
    UpdateListMutation,
    UpdateListMutationVariables
  >({
    mutation: UpdateListDocument,
    variables: {
      input: {
        listId: params['listId'],
        endorsementList: {
          closedDate: transformDate(closedDate),
          description: description,
          openedDate: transformDate(openedDate),
          title,
        },
      },
    },
  })
  console.log(response)
  return { data: response }
}
