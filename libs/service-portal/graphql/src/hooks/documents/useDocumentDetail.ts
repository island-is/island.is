import { GET_DOCUMENT } from '../../lib/queries/getDocument'
import { useQuery } from '@apollo/client'
import { Query, QueryGetDocumentArgs } from '@island.is/api/schema'

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
