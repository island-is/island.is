import { useMutation } from '@apollo/client'
import { CASE_POST_CASE_SUBSCRIPTION } from '../../graphql/queries.graphql'

export const usePostCaseSubscription = () => {
  const [
    postCaseSubscriptionMutation,
    { loading: postCaseSubscriptionLoading },
  ] = useMutation(CASE_POST_CASE_SUBSCRIPTION)
  return {
    postCaseSubscriptionMutation,
    postCaseSubscriptionLoading,
  }
}

export default usePostCaseSubscription
