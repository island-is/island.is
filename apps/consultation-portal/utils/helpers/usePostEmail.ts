import { useMutation } from '@apollo/client'
import initApollo from '../../graphql/client'
import { SUB_POST_EMAIL } from '../../graphql/queries.graphql'

export const usePostEmail = () => {
  const client = initApollo()
  const [postEmailMutation, { loading: postEmailLoading }] = useMutation(
    SUB_POST_EMAIL,
    {
      client: client,
    },
  )

  return {
    postEmailMutation,
    postEmailLoading,
  }
}

export default usePostEmail
