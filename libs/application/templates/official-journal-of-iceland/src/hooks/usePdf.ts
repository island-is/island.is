import { useLazyQuery } from '@apollo/client'
import { OjoiaGetPdfResponse } from '@island.is/api/schema'
import { GET_PDF_QUERY } from '../graphql/queries'

type PdfResponse = {
  OJOIAGetPdf: OjoiaGetPdfResponse
}

type Props = {
  applicationId: string
  onComplete?: (data: PdfResponse) => void
}

export const usePdf = ({ applicationId, onComplete }: Props) => {
  const [fetchPdf, { data, loading, error }] = useLazyQuery<PdfResponse>(
    GET_PDF_QUERY,
    {
      variables: {
        input: {
          id: applicationId,
        },
      },
      fetchPolicy: 'no-cache',
      onCompleted: onComplete,
    },
  )

  return {
    fetchPdf,
    pdf: data?.OJOIAGetPdf?.pdf,
    loading,
    error,
  }
}
