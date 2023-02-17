import { useCallback } from 'react'
import { useQuery } from '@apollo/client'
import { GET_ATTACHMENT_PRESIGNED_URL } from '@island.is/application/graphql'

const useGenerateFileUrl = (applicationId: string, key: string) => {
  const { data: getPresignedUrl } = useQuery(GET_ATTACHMENT_PRESIGNED_URL, {
    variables: {
      input: {
        id: applicationId,
        attachmentKey: key,
      },
    },
  })

  const getFileUrl = useCallback(() => {
    window.open(getPresignedUrl.attachmentPresignedURL.url, '_blank')
  }, [getPresignedUrl])

  return {
    getFileUrl,
  }
}

export default useGenerateFileUrl
