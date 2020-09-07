import { useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { GET_DOCUMENT_CATEGORIES } from '../../lib/queries/getDocumentCategories'

export const useDocumentCategories = () => {
  const { data, loading, error } = useQuery<Query, null>(
    GET_DOCUMENT_CATEGORIES,
  )

  return {
    data: data?.getDocumentCategories || null,
    loading,
    error,
  }
}
