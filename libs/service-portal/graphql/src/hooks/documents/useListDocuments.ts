import { useQuery } from '@apollo/client'
import { Document, Query } from '@island.is/api/schema'
import { LIST_DOCUMENTS } from '../../lib/queries/listDocuments'
import uniqBy from 'lodash/uniqBy'

type CategoryType = {
  label: string
  value: string
}
interface UseListDocumentsProps {
  data: {
    documents: Document[]
    categories: CategoryType[]
  }
  unreadCounter: number
  loading?: boolean
  error?: any
}

export const useListDocuments = (natReg: string): UseListDocumentsProps => {
  const { data, loading, error } = useQuery<Query>(LIST_DOCUMENTS)

  const documents = data?.listDocuments || []

  const allCategories = documents.map((document: Document) => ({
    label: document.senderName,
    value: document.senderNatReg,
  }))
  // Note: Getting unique categories
  const categories = uniqBy(
    allCategories,
    (category: CategoryType) => category.value,
  )
  return {
    data: { documents, categories },
    unreadCounter: documents.filter((x: Document) => x.opened === false).length,
    loading,
    error,
  }
}
