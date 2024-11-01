import { useLazyQuery } from '@apollo/client'
import { OjoiaGetPdfResponse } from '@island.is/api/schema'
import { GET_PDF_QUERY } from '../graphql/queries'

type Props = {
  applicationId: string
  onComplete?: (data: { OJOIAGetPdf: OjoiaGetPdfResponse }) => void
}

export const usePdf = ({ applicationId, onComplete }: Props) => {
  const [fetchPdf, { data, loading, error }] = useLazyQuery<{
    OJOIAGetPdf: OjoiaGetPdfResponse
  }>(GET_PDF_QUERY, {
    variables: {
      input: {
        id: applicationId,
      },
    },
    onCompleted: onComplete,
  })

  return {
    fetchPdf,
    pdf: data?.OJOIAGetPdf?.pdf,
    loading,
    error,
  }
}
