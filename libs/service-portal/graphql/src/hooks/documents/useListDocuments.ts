import { useQuery } from '@apollo/client'
import { Document, Query } from '@island.is/api/schema'
import { LIST_DOCUMENTS } from '../../lib/queries/listDocuments'
import uniqBy from 'lodash/uniqBy'
interface UseListDocumentsProps {
  data: {
    documents: Document[]
    categories: { label: string; value: string }[]
  }
  unreadCounter: number
  loading?: boolean
  error?: any
}

export const useListDocuments = (
  dateFrom?: string | null,
  dateTo?: string | null,
  categoryId?: string | null,
  typeId?: string | null,
  sortBy?: string | null,
  page?: number | null,
  pageSize?: number | null,
): UseListDocumentsProps => {
  const { data, loading, error } = useQuery<Query>(LIST_DOCUMENTS, {
    variables: {
      input: {
        dateFrom,
        dateTo,
        categoryId,
        typeId,
        sortBy,
        page,
        pageSize,
      },
    },
  })

  const documents = data?.listDocuments || []

  const allCategories = documents.map((document) => ({
    label: document.senderName,
    value: document.senderNatReg,
  }))
  // Note: Getting unique categories
  const categories = uniqBy(allCategories, (category) => category.value)
  return {
    data: { documents, categories },
    unreadCounter: documents.filter((x) => x.opened === false).length,
    loading,
    error,
  }
}
