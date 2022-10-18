import { useCallback } from 'react'
import { useQuery } from '@apollo/client'
import { GET_ATTACHMENT_PRESIGNED_URL } from '@island.is/application/graphql'

const useGeneratePdfUrl = (applicationId: string, key: string) => {
  const { data: getPresignedUrl } = useQuery(GET_ATTACHMENT_PRESIGNED_URL, {
    variables: {
      input: {
        id: applicationId,
        attachmentKey: key,
      },
    },
  })

  const getPdfUrl = useCallback(() => {
    window.open(getPresignedUrl.attachmentPresignedURL.url, '_blank')
  }, [getPresignedUrl])

  return {
    getPdfUrl,
    getPresignedUrl,
  }
}

export { useGeneratePdfUrl }
