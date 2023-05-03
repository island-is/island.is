import { useMutation } from '@apollo/client'
import initApollo from '../../graphql/client'
import { CASE_DELETE_CASE_SUBSCRIPTION } from '../../graphql/queries.graphql'

export const useDeleteCaseSubscription = () => {
  const client = initApollo()
  const [
    deleteCaseSubscriptionMutation,
    { loading: deleteCaseSubscriptionLoading },
  ] = useMutation(CASE_DELETE_CASE_SUBSCRIPTION, {
    client: client,
  })

  return {
    deleteCaseSubscriptionMutation,
    deleteCaseSubscriptionLoading,
  }
}

export default useDeleteCaseSubscription
