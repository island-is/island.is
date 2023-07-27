import { useMutation } from '@apollo/client'
import initApollo from '../../graphql/client'
import { SUB_POST_SUBS } from '../../graphql/queries.graphql'

export const usePostSubscription = () => {
  const client = initApollo()

  const [postSubsMutation, { loading: postLoading }] = useMutation(
    SUB_POST_SUBS,
    {
      client: client,
    },
  )

  return {
    postSubsMutation,
    postLoading,
  }
}

export default usePostSubscription
