import { useEffect } from 'react'
import { useDocumentContext } from '../screens/Overview/DocumentContext'
import { useDocumentsV3Query } from '../queries/Overview.generated'

export const pageSize = 10

type UseDocumentListProps = { defaultPageSize?: number }

export const useDocumentList = (props?: UseDocumentListProps) => {
  const {
    filterValue,
    page,
    totalPages,
    categoriesAvailable,
    sendersAvailable,

    setTotalPages,
    setCategoriesAvailable,
    setSendersAvailable,
  } = useDocumentContext()

  const fetchObject = {
    input: {
      senderNationalId: filterValue.activeSenders,
      dateFrom: filterValue.dateFrom?.toISOString(),
      dateTo: filterValue.dateTo?.toISOString(),
      categoryIds: filterValue.activeCategories,
      subjectContains: filterValue.searchQuery,
      typeId: null,
      opened: filterValue.showUnread ? false : null,
      page: page,
      pageSize: props?.defaultPageSize ?? pageSize,
      archived: filterValue.archived,
      bookmarked: filterValue.bookmarked,
    },
  }

  const { data, loading, error, client, refetch } = useDocumentsV3Query({
    variables: fetchObject,
    fetchPolicy: 'cache-first',
  })

  const invalidateCache = async () => {
    client.cache.evict({
      id: 'ROOT_QUERY',
      fieldName: 'documentsV2',
    })
    client.cache.gc()
  }

  useEffect(() => {
    if (
      !loading &&
      data?.documentsV2?.senders &&
      sendersAvailable.length === 0
    ) {
      setSendersAvailable(data.documentsV2.senders)
    }

    if (
      !loading &&
      data?.documentsV2?.categories &&
      categoriesAvailable.length === 0
    ) {
      setCategoriesAvailable(data.documentsV2.categories)
    }
  }, [loading, data, sendersAvailable, categoriesAvailable])

  const totalCount = data?.documentsV2?.totalCount || 0

  useEffect(() => {
    const pageCount = Math.ceil(totalCount / pageSize)
    if (pageCount !== totalPages && !loading) {
      setTotalPages(pageCount)
    }
  }, [pageSize, totalCount, loading])

  const filteredDocuments = data?.documentsV2?.data || []
  const activeArchive = filterValue.archived === true

  return {
    activeArchive,
    filteredDocuments,
    totalCount,
    totalPages,
    fetchObject,

    data,
    loading,
    error,
    refetch,
    invalidateCache,
  }
}
