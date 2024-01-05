import { useMutation } from '@apollo/client'
import { SUB_POST_EMAIL } from '../../graphql/queries.graphql'

export const usePostEmail = () => {
  const [postEmailMutation, { loading: postEmailLoading }] =
    useMutation(SUB_POST_EMAIL)

  return {
    postEmailMutation,
    postEmailLoading,
  }
}

export default usePostEmail
