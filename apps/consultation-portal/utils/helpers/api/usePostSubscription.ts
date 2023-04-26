import { useMutation } from '@apollo/client'
import initApollo from '../../../graphql/client'
import { SUB_POST_SUBS } from '../../../graphql/queries.graphql'

export const usePostSubscription = () => {
  const client = initApollo()

  const [
    postSubsMutation,
    {
      data: postData,
      loading: postLoading,
      error: postError,
      called: postCalled,
    },
  ] = useMutation(SUB_POST_SUBS, {
    client: client,
  })

  return {
    postSubsMutation,
  }
}

export default usePostSubscription
