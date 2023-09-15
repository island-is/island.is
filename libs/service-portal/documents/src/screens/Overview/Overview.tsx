import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useQuery, gql } from '@apollo/client'
import {
  Box,
  Stack,
  LoadingDots,
  Hidden,
  Pagination,
  Text,
} from '@island.is/island-ui/core'
import { useListDocuments } from '@island.is/service-portal/graphql'
import {
  useScrollToRefOnUpdate,
  IntroHeader,
  EmptyState,
  ServicePortalPath,
  formatPlausiblePathToParams,
} from '@island.is/service-portal/core'
import {
  DocumentCategory,
  DocumentSender,
  DocumentType,
  Query,
} from '@island.is/api/schema'
import { useLocale, useNamespaces } from '@island.is/localization'
import { documentsSearchDocumentsInitialized } from '@island.is/plausible'
import { GET_ORGANIZATIONS_QUERY } from '@island.is/service-portal/graphql'
import { messages } from '../../utils/messages'
import DocumentLine from '../../components/DocumentLine/DocumentLine'
import { getOrganizationLogoUrl } from '@island.is/shared/utils'
import isAfter from 'date-fns/isAfter'
import differenceInYears from 'date-fns/differenceInYears'
import DocumentsFilter from '../../components/DocumentFilter/DocumentsFilter'
import debounce from 'lodash/debounce'
import {
  defaultFilterValues,
  FilterValuesType,
  SortType,
} from '../../utils/types'
import TableHeading from '../../components/TableHeading/TableHeading'
import * as styles from './Overview.css'
import { AuthDelegationType } from '@island.is/shared/types'
import { useUserInfo } from '@island.is/auth/react'

const GET_DOCUMENT_CATEGORIES = gql`
  query documentCategories {
    getDocumentCategories {
      id
      name
    }
  }
`

const GET_DOCUMENT_TYPES = gql`
  query documentTypes {
    getDocumentTypes {
      id
      name
    }
  }
`

const GET_DOCUMENT_SENDERS = gql`
  query documentSenders {
    getDocumentSenders {
      id
      name
    }
  }
`

const pageSize = 15

export const ServicePortalDocuments = () => {
  useNamespaces('sp.documents')
  const userInfo = useUserInfo()
  const { formatMessage } = useLocale()
  const [page, setPage] = useState(1)
  const [isEmpty, setEmpty] = useState(false)

  const isLegal = userInfo.profile.delegationType?.includes(
    AuthDelegationType.LegalGuardian,
  )
  const dateOfBirth = userInfo?.profile.dateOfBirth
  let isOver15 = false
  if (dateOfBirth) {
    isOver15 = differenceInYears(new Date(), dateOfBirth) > 15
  }
  const hideHealthData = isOver15 && isLegal

  const [sortState, setSortState] = useState<SortType>({
    direction: 'Descending',
    key: 'Date',
  })
  const [searchInteractionEventSent, setSearchInteractionEventSent] =
    useState(false)
  const { scrollToRef } = useScrollToRefOnUpdate([page])

  const [filterValue, setFilterValue] =
    useState<FilterValuesType>(defaultFilterValues)
  const { data, totalCount, loading, error } = useListDocuments({
    senderKennitala: filterValue.activeSenders.join(),
    dateFrom: filterValue.dateFrom?.toISOString(),
    dateTo: filterValue.dateTo?.toISOString(),
    categoryId: filterValue.activeCategories.join(),
    subjectContains: filterValue.searchQuery,
    typeId: null,
    sortBy: sortState.key,
    order: sortState.direction,
    opened: filterValue.showUnread ? false : null,
    page: page,
    pageSize: pageSize,
    isLegalGuardian: hideHealthData,
  })

  const { data: categoriesData, loading: categoriesLoading } = useQuery<Query>(
    GET_DOCUMENT_CATEGORIES,
  )

  const { data: typesData, loading: typesLoading } =
    useQuery<Query>(GET_DOCUMENT_TYPES)

  const { data: sendersData, loading: sendersLoading } =
    useQuery<Query>(GET_DOCUMENT_SENDERS)

  const [categoriesAvailable, setCategoriesAvailable] = useState<
    DocumentCategory[]
  >([])

  const [sendersAvailable, setSendersAvailable] = useState<DocumentSender[]>([])

  const [typesAvailable, setTypesAvailable] = useState<DocumentType[]>([])
  useEffect(() => {
    if (
      !sendersLoading &&
      sendersData?.getDocumentSenders &&
      sendersAvailable.length === 0
    ) {
      setSendersAvailable(sendersData.getDocumentSenders)
    }
  }, [sendersLoading])

  useEffect(() => {
    if (
      !typesLoading &&
      typesData?.getDocumentTypes &&
      typesAvailable.length === 0
    ) {
      setTypesAvailable(typesData.getDocumentTypes)
    }
  }, [typesLoading])

  useEffect(() => {
    if (
      !categoriesLoading &&
      categoriesData?.getDocumentCategories &&
      categoriesAvailable.length === 0
    ) {
      setCategoriesAvailable(categoriesData.getDocumentCategories)
    }
  }, [categoriesLoading])

  const filteredDocuments = data.documents

  useEffect(() => {
    if (!loading && totalCount === 0 && filterValue === defaultFilterValues) {
      setEmpty(true)
    }
  }, [loading])

  const pagedDocuments = {
    from: (page - 1) * pageSize,
    to: pageSize * page,
    totalPages: Math.ceil(totalCount / pageSize),
  }

  const { data: orgData } = useQuery(GET_ORGANIZATIONS_QUERY)
  const organizations = orgData?.getOrganizations?.items || {}

  const handleDateFromInput = useCallback((value: Date | null) => {
    setPage(1)
    setFilterValue((oldState) => {
      const { dateTo } = oldState
      const dateToValue = () => {
        if (!value) {
          return dateTo
        }
        return dateTo ? (isAfter(value, dateTo) ? value : dateTo) : dateTo
      }
      return {
        ...oldState,
        dateTo: dateToValue(),
        dateFrom: value,
      }
    })
  }, [])

  const handleDateToInput = useCallback((value: Date | null) => {
    setPage(1)
    setFilterValue((oldState) => ({
      ...oldState,
      dateTo: value,
    }))
  }, [])

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  const handleCategoriesChange = useCallback((selected: string[]) => {
    setPage(1)
    setFilterValue((oldFilter) => ({
      ...oldFilter,
      activeCategories: [...selected],
    }))
  }, [])

  const handleSendersChange = useCallback((selected: string[]) => {
    setPage(1)
    setFilterValue((oldFilter) => ({
      ...oldFilter,
      activeSenders: [...selected],
    }))
  }, [])

  const handleClearFilters = useCallback(() => {
    setPage(1)
    setFilterValue({ ...defaultFilterValues })
  }, [])

  const handleShowUnread = useCallback((showUnread: boolean) => {
    setPage(1)
    setFilterValue((prevFilter) => ({
      ...prevFilter,
      showUnread,
    }))
  }, [])

  const handleSearchChange = (e: any) => {
    setPage(1)
    if (e) {
      setFilterValue((prevFilter) => ({
        ...prevFilter,
        searchQuery: e.target?.value ?? '',
      }))
      if (!searchInteractionEventSent) {
        documentsSearchDocumentsInitialized(
          formatPlausiblePathToParams(
            ServicePortalPath.ElectronicDocumentsRoot,
          ),
        )
        setSearchInteractionEventSent(true)
      }
    }
  }

  useEffect(() => {
    return () => {
      debouncedResults.cancel()
    }
  })
  const debouncedResults = useMemo(() => {
    return debounce(handleSearchChange, 500)
  }, [])

  if (isEmpty) {
    return (
      <Box marginBottom={[4, 4, 6, 10]}>
        <IntroHeader title={messages.title} intro={messages.intro} />
        <EmptyState />
      </Box>
    )
  }
  return (
    <Box marginBottom={[4, 4, 6, 10]}>
      <IntroHeader title={messages.title} intro={messages.intro} />

      {loading && filterValue === defaultFilterValues ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="full"
          className={styles.loading}
        >
          <LoadingDots large />
        </Box>
      ) : (
        <Stack space={3}>
          <Box marginTop={[1, 1, 2, 2, 6]}>
            <DocumentsFilter
              filterValue={filterValue}
              categories={categoriesAvailable}
              senders={sendersAvailable}
              debounceChange={debouncedResults}
              clearCategories={() =>
                setFilterValue((oldFilter) => ({
                  ...oldFilter,
                  activeCategories: [],
                }))
              }
              clearSenders={() =>
                setFilterValue((oldFilter) => ({
                  ...oldFilter,
                  activeSenders: [],
                }))
              }
              handleCategoriesChange={handleCategoriesChange}
              handleSendersChange={handleSendersChange}
              handleDateFromChange={handleDateFromInput}
              handleDateToChange={handleDateToInput}
              handleShowUnread={handleShowUnread}
              handleClearFilters={handleClearFilters}
              documentsLength={totalCount}
            />

            <Box marginTop={[0, 3]}>
              <Hidden below="sm">
                <TableHeading
                  sortState={sortState}
                  setSortState={setSortState}
                />
              </Hidden>
              {loading && filterValue !== defaultFilterValues && (
                <Box display="flex" justifyContent="center" padding={4}>
                  <LoadingDots large />
                </Box>
              )}
              {!loading && !error && filteredDocuments?.length === 0 && (
                <Box
                  display="flex"
                  justifyContent="center"
                  margin={[3, 3, 3, 6]}
                >
                  <Text variant="h3" as="h3">
                    {formatMessage(messages.notFound)}
                  </Text>
                </Box>
              )}
              {error && (
                <Box
                  display="flex"
                  justifyContent="center"
                  margin={[3, 3, 3, 6]}
                >
                  <Text variant="h3" as="h3">
                    {formatMessage(messages.error)}
                  </Text>
                </Box>
              )}
              <Box marginTop={[2, 0]}>
                {filteredDocuments.map((doc, index) => (
                  <Box key={doc.id} ref={index === 0 ? scrollToRef : null}>
                    <DocumentLine
                      img={getOrganizationLogoUrl(
                        doc.senderName,
                        organizations,
                      )}
                      documentLine={doc}
                      documentCategories={categoriesAvailable}
                      userInfo={userInfo}
                    />
                  </Box>
                ))}
              </Box>
            </Box>

            {filteredDocuments && (
              <Box marginTop={4}>
                <Pagination
                  page={page}
                  totalPages={pagedDocuments.totalPages}
                  renderLink={(page, className, children) => (
                    <button
                      className={className}
                      onClick={handlePageChange.bind(null, page)}
                    >
                      {children}
                    </button>
                  )}
                />
              </Box>
            )}
          </Box>
        </Stack>
      )}
    </Box>
  )
}

export default ServicePortalDocuments
