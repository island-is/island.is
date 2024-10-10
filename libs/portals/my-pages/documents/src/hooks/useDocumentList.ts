import { useEffect } from 'react'
import { AuthDelegationType } from '@island.is/api/schema'
import { useUserInfo } from '@island.is/auth/react'
import { useDocumentContext } from '../screens/Overview/DocumentContext'
import { useDocumentsV2Query } from '../screens/Overview/Overview.generated'
import differenceInYears from 'date-fns/differenceInYears'

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

  const userInfo = useUserInfo()
  const isLegal = userInfo.profile.delegationType?.includes(
    AuthDelegationType.LegalGuardian,
  )
  const dateOfBirth = userInfo?.profile.dateOfBirth
  let isOver15 = false
  if (dateOfBirth) {
    isOver15 = differenceInYears(new Date(), dateOfBirth) > 15
  }
  const hideHealthData = isOver15 && isLegal

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
      isLegalGuardian: hideHealthData,
      archived: filterValue.archived,
      bookmarked: filterValue.bookmarked,
    },
  }

  const { data, loading, error, client, refetch } = useDocumentsV2Query({
    variables: fetchObject,
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
