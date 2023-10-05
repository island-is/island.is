import { useQuery } from '@apollo/client'
import { Document, GetDocumentListInput, Query } from '@island.is/api/schema'
import { LIST_DOCUMENTS } from '../../lib/queries/listDocuments'

interface UseListDocumentsProps {
  data: {
    documents: Document[]
  }
  totalCount: number
  unreadCounter: number
  loading?: boolean
  error?: any
  refetch?: (input?: GetDocumentListInput) => void
}

export const useListDocuments = (
  input?: GetDocumentListInput,
): UseListDocumentsProps => {
  const {
    senderKennitala,
    dateFrom,
    dateTo,
    categoryId,
    subjectContains,
    typeId,
    sortBy,
    order,
    opened,
    page,
    pageSize,
    isLegalGuardian,
    archived,
    bookmarked,
  } = input ?? {}
  const { data, loading, error, refetch } = useQuery<Query>(LIST_DOCUMENTS, {
    fetchPolicy: 'network-only',
    variables: {
      input: {
        senderKennitala,
        dateFrom,
        dateTo,
        categoryId,
        subjectContains,
        typeId,
        sortBy,
        order,
        opened,
        page,
        pageSize,
        isLegalGuardian,
        archived,
        bookmarked,
      },
    },
  })
  const documents = data?.listDocumentsV2?.data || []
  const totalCount = data?.listDocumentsV2?.totalCount || 0

  return {
    data: { documents },
    totalCount,
    unreadCounter: documents.filter((x) => x.opened === false).length,
    loading,
    error,
    refetch,
  }
}
