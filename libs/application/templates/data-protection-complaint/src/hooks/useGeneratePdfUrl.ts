import { useCallback } from 'react'
import { useMutation } from '@apollo/client'
import { PdfTypes } from '@island.is/application/core'
import { GENERATE_PDF_PRESIGNED_URL } from '@island.is/application/graphql'

const useGeneratePdfUrl = (applicationId: string, pdfType: PdfTypes) => {
  const [generatePdfPresignedUrl, { loading }] = useMutation(
    GENERATE_PDF_PRESIGNED_URL,
  )

  const getPdfUrl = useCallback(() => {
    const input = {
      variables: {
        input: {
          id: applicationId,
          type: pdfType,
        },
      },
    }

    generatePdfPresignedUrl(input).then((res) => {
      window.open(res?.data?.generatePdfPresignedUrl?.url, '_blank')
    })
  }, [pdfType, applicationId, generatePdfPresignedUrl])

  return {
    getPdfUrl,
    loading,
  }
}

export default useGeneratePdfUrl
