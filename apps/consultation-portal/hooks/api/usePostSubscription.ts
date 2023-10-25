import { useMutation } from '@apollo/client'
import { SUB_POST_SUBS } from '../../graphql/queries.graphql'

export const usePostSubscription = () => {
  const [postSubsMutation, { loading: postLoading }] =
    useMutation(SUB_POST_SUBS)

  return {
    postSubsMutation,
    postLoading,
  }
}

export default usePostSubscription
