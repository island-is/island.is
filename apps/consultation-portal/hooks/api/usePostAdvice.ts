import { useMutation } from '@apollo/client'
import {
  CASE_POST_ADVICE,
  CREATE_UPLOAD_URL,
} from '../../graphql/queries.graphql'

export const usePostAdvice = () => {
  const [createUploadUrl] = useMutation(CREATE_UPLOAD_URL)

  const [postAdviceMutation] = useMutation(CASE_POST_ADVICE)

  return {
    createUploadUrl,
    postAdviceMutation,
  }
}

export default usePostAdvice
