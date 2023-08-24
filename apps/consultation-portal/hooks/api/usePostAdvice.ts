import { useMutation } from '@apollo/client'
import initApollo from '../../graphql/client'
import {
  CASE_POST_ADVICE,
  CREATE_UPLOAD_URL,
} from '../../graphql/queries.graphql'

export const usePostAdvice = () => {
  const client = initApollo()

  const [createUploadUrl] = useMutation(CREATE_UPLOAD_URL, { client: client })

  const [postAdviceMutation] = useMutation(CASE_POST_ADVICE, {
    client: client,
  })

  return {
    createUploadUrl,
    postAdviceMutation,
  }
}

export default usePostAdvice
