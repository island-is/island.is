import { useMutation } from '@apollo/client'
import initApollo from '../../graphql/client'
import { CASE_POST_CASE_SUBSCRIPTION } from '../../graphql/queries.graphql'

export const usePostCaseSubscription = () => {
  const client = initApollo()
  const [
    postCaseSubscriptionMutation,
    { loading: postCaseSubscriptionLoading },
  ] = useMutation(CASE_POST_CASE_SUBSCRIPTION, {
    client: client,
  })
  return {
    postCaseSubscriptionMutation,
    postCaseSubscriptionLoading,
  }
}

export default usePostCaseSubscription
