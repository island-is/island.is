import { useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { PdfTypes } from '@island.is/application/core'
import { GENERATE_PDF_PRESIGNED_URL } from '@island.is/application/graphql'

const useGeneratePdfUrl = (applicationId: string, pdfType: PdfTypes) => {
  const [generatePdfPresignedUrl, { loading, data }] = useMutation(
    GENERATE_PDF_PRESIGNED_URL,
  )

  useEffect(() => {
    const input = {
      variables: {
        input: {
          id: applicationId,
          type: pdfType,
        },
      },
    }

    generatePdfPresignedUrl(input)
  }, [applicationId, generatePdfPresignedUrl, pdfType])

  return {
    pdfUrl: data?.generatePdfPresignedUrl?.url,
    loading,
  }
}

export default useGeneratePdfUrl
