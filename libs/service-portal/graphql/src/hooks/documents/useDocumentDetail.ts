import { GET_DOCUMENT } from '../../lib/queries/getDocument'
import { useQuery, useLazyQuery } from '@apollo/client'
import {
  Query,
  QueryGetDocumentArgs,
  DocumentDetails,
} from '@island.is/api/schema'

export const useDocumentDetail = (id: string) => {
  const { data, loading, error } = useQuery<Query, QueryGetDocumentArgs>(
    GET_DOCUMENT,
    {
      variables: {
        input: {
          id,
        },
      },
    },
  )

  return {
    data: data?.getDocument || null,
    loading,
    error,
  }
}

export const useLazyDocumentDetail = (
  id: string,
): {
  fetchDocument: () => void
  loading: boolean
  error: any
  data?: Pick<DocumentDetails, 'content' | 'fileType' | 'url'>
} => {
  const [getSingleDocument, { loading, data, error }] = useLazyQuery(
    GET_DOCUMENT,
  )
  const fetchDocument = () => {
    getSingleDocument({ variables: { input: { id } } })
  }
  return {
    fetchDocument,
    loading,
    error: error,
    data: data?.getDocument || undefined,
  }
}
