import { useMutation } from '@apollo/client'
import { CASE_DELETE_CASE_SUBSCRIPTION } from '../../graphql/queries.graphql'

export const useDeleteCaseSubscription = () => {
  const [
    deleteCaseSubscriptionMutation,
    { loading: deleteCaseSubscriptionLoading },
  ] = useMutation(CASE_DELETE_CASE_SUBSCRIPTION)

  return {
    deleteCaseSubscriptionMutation,
    deleteCaseSubscriptionLoading,
  }
}

export default useDeleteCaseSubscription
