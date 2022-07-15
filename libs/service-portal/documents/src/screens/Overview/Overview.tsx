import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useQuery, gql } from '@apollo/client'
import {
  Text,
  Box,
  Stack,
  Columns,
  Column,
  GridRow,
  GridColumn,
  LoadingDots,
  Hidden,
  Pagination,
} from '@island.is/island-ui/core'
import { useListDocuments } from '@island.is/service-portal/graphql'
import {
  useScrollToRefOnUpdate,
  AccessDeniedLegal,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import {
  DocumentCategory,
  DocumentSender,
  DocumentType,
  Query,
} from '@island.is/api/schema'
import { useLocale, useNamespaces } from '@island.is/localization'
import { documentsSearchDocumentsInitialized } from '@island.is/plausible'
import { useLocation } from 'react-router-dom'
import { GET_ORGANIZATIONS_QUERY } from '@island.is/service-portal/graphql'
import { messages } from '../../utils/messages'
import DocumentLine from '../../components/DocumentLine/DocumentLine'
import { getOrganizationLogoUrl } from '@island.is/shared/utils'
import HeaderArrow from '../../components/HeaderArrow/HeaderArrow'
import isAfter from 'date-fns/isAfter'
import isEqual from 'lodash/isEqual'

import * as Sentry from '@sentry/react'
import * as styles from './Overview.css'
import differenceInYears from 'date-fns/differenceInYears'
import DocumentsFilter from './DocumentsFilter'
import debounce from 'lodash/debounce'
import DocumentsFilterTags from './DocumentsFilterTags'

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
const defaultStartDate = null
const defaultEndDate = null

const defaultFilterValues = {
  dateFrom: defaultStartDate,
  dateTo: defaultEndDate,
  activeCategories: [],
  activeSenders: [],
  searchQuery: '',
  showUnread: false,
}

type SortKeyType = 'Date' | 'Subject' | 'Sender' | 'Category' | 'Type'
type SortDirectionType = 'Ascending' | 'Descending'

type FilterValues = {
  dateFrom: Date | null
  dateTo: Date | null
  searchQuery: string
  showUnread: boolean
  activeCategories: string[]
  activeSenders: string[]
}

const getSortDirection = (currentDirection: SortDirectionType) => {
  const reverseDirection =
    currentDirection === 'Ascending' ? 'Descending' : 'Ascending'
  return reverseDirection
}

export const ServicePortalDocuments: ServicePortalModuleComponent = ({
  userInfo,
  client,
}) => {
  useNamespaces('sp.documents')
  Sentry.configureScope((scope) =>
    scope.setTransactionName('Electronic-Documents'),
  )

  const { formatMessage, lang } = useLocale()
  const [page, setPage] = useState(1)
  const [sortState, setSortState] = useState<{
    direction: SortDirectionType
    key: SortKeyType
  }>({
    direction: 'Descending',
    key: 'Date',
  })
  const [searchInteractionEventSent, setSearchInteractionEventSent] = useState(
    false,
  )
  const { scrollToRef } = useScrollToRefOnUpdate([page])
  const { pathname } = useLocation()

  const [filterValue, setFilterValue] = useState<FilterValues>(
    defaultFilterValues,
  )
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
    pageSize: pageSize + 1,
  })
  // TODO: rename to categories
  const { data: categoriesData, loading: categoriesLoading } = useQuery<Query>(
    GET_DOCUMENT_CATEGORIES,
  )
  const { data: typesData, loading: typesLoading } = useQuery<Query>(
    GET_DOCUMENT_TYPES,
  )

  const { data: sendersData, loading: sendersLoading } = useQuery<Query>(
    GET_DOCUMENT_SENDERS,
  )

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

  const isLegal = userInfo.profile.delegationType?.includes('LegalGuardian')
  const dateOfBirth = userInfo?.profile.dateOfBirth
  let isOver15 = false
  if (dateOfBirth) {
    isOver15 = differenceInYears(new Date(), dateOfBirth) > 15
  }

  const filteredDocuments = data.documents

  const pagedDocuments = {
    from: (page - 1) * pageSize,
    to: pageSize * page,
    totalPages: Math.ceil(totalCount / pageSize),
  }
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

  const handlePageChange = useCallback((page: number) => {
    setPage(page)
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

  const hasActiveFilters = () => !isEqual(filterValue, defaultFilterValues)

  const documentsFoundText = () =>
    filteredDocuments.length === 1 ||
    (lang === 'is' && filteredDocuments.length % 10 === 1)
      ? messages.foundSingular
      : messages.found

  const { data: orgData } = useQuery(GET_ORGANIZATIONS_QUERY)
  const organizations = orgData?.getOrganizations?.items || {}

  const handleSearchChange = (e: any) => {
    setPage(1)
    if (e) {
      setFilterValue((prevFilter) => ({
        ...prevFilter,
        searchQuery: e.target?.value ?? '',
      }))
      if (!searchInteractionEventSent) {
        documentsSearchDocumentsInitialized(pathname)
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

  const mapToFilterItem = (
    array: DocumentCategory[] | DocumentSender[] | DocumentType[],
  ) => {
    return array.map((item) => {
      return {
        label: item.name,
        value: item.id,
      }
    })
  }
  if (isLegal && isOver15) {
    return <AccessDeniedLegal userInfo={userInfo} client={client} />
  }

  return (
    <Box marginBottom={[4, 4, 6, 10]}>
      <Stack space={3}>
        <Text variant="h3" as="h1">
          {formatMessage(messages.title)}
        </Text>
        <Columns collapseBelow="sm">
          <Column width="7/12">
            <Text variant="default">{formatMessage(messages.intro)}</Text>
          </Column>
        </Columns>
        <Box marginTop={[1, 1, 2, 2, 6]}>
          <DocumentsFilter
            filterValue={filterValue}
            categories={mapToFilterItem(categoriesAvailable)}
            senders={mapToFilterItem(sendersAvailable)}
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
          />
          <Hidden print>
            {hasActiveFilters() && (
              <Box marginTop={4}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="spaceBetween"
                >
                  <DocumentsFilterTags
                    filterValue={filterValue}
                    categories={mapToFilterItem(categoriesAvailable)}
                    senders={mapToFilterItem(sendersAvailable)}
                    handleCategoriesChange={handleCategoriesChange}
                    handleSendersChange={handleSendersChange}
                    handleDateFromChange={handleDateFromInput}
                    handleDateToChange={handleDateToInput}
                    handleShowUnread={handleShowUnread}
                    handleClearFilters={handleClearFilters}
                  />

                  <Text variant="eyebrow" as="h3">{`${
                    filteredDocuments.length
                  } ${formatMessage(documentsFoundText())}`}</Text>
                </Box>
              </Box>
            )}
          </Hidden>
          <Box marginTop={[0, 3]}>
            <Hidden below="sm">
              <Box
                className={styles.tableHeading}
                paddingY={2}
                background="blue100"
              >
                <GridRow>
                  <GridColumn span={['1/1', '2/12']}>
                    <Box paddingX={2}>
                      <HeaderArrow
                        active={sortState?.key === 'Date'}
                        direction={sortState?.direction}
                        title={formatMessage(messages.tableHeaderDate)}
                        onClick={() =>
                          setSortState({
                            direction: getSortDirection(sortState?.direction),
                            key: 'Date',
                          })
                        }
                      />
                    </Box>
                  </GridColumn>
                  <GridColumn span={['1/1', '4/12']}>
                    <Box paddingX={2}>
                      <HeaderArrow
                        active={sortState?.key === 'Subject'}
                        direction={sortState?.direction}
                        title={formatMessage(messages.tableHeaderInformation)}
                        onClick={() =>
                          setSortState({
                            direction: getSortDirection(sortState?.direction),
                            key: 'Subject',
                          })
                        }
                      />
                    </Box>
                  </GridColumn>
                  <GridColumn span={['1/1', '3/12']}>
                    <Box paddingX={2}>
                      <HeaderArrow
                        active={sortState?.key === 'Category'}
                        direction={sortState?.direction}
                        title={formatMessage(messages.tableHeaderGroup)}
                        onClick={() =>
                          setSortState({
                            direction: getSortDirection(sortState?.direction),
                            key: 'Category',
                          })
                        }
                      />
                    </Box>
                  </GridColumn>
                  <GridColumn span={['1/1', '3/12']}>
                    <Box paddingX={2}>
                      <HeaderArrow
                        active={sortState?.key === 'Sender'}
                        direction={sortState?.direction}
                        title={formatMessage(messages.tableHeaderInstitution)}
                        onClick={() =>
                          setSortState({
                            direction: getSortDirection(sortState?.direction),
                            key: 'Sender',
                          })
                        }
                      />
                    </Box>
                  </GridColumn>
                </GridRow>
              </Box>
            </Hidden>
            {loading && (
              <Box display="flex" justifyContent="center" padding={4}>
                <LoadingDots large />
              </Box>
            )}
            {!loading && !error && filteredDocuments?.length === 0 && (
              <Box display="flex" justifyContent="center" margin={[3, 3, 3, 6]}>
                <Text variant="h3" as="h3">
                  {formatMessage(messages.notFound)}
                </Text>
              </Box>
            )}
            {error && (
              <Box display="flex" justifyContent="center" margin={[3, 3, 3, 6]}>
                <Text variant="h3" as="h3">
                  {formatMessage(messages.error)}
                </Text>
              </Box>
            )}
            <Box marginTop={[2, 0]}>
              {filteredDocuments.map((doc, index) => (
                <Box key={doc.id} ref={index === 0 ? scrollToRef : null}>
                  <DocumentLine
                    img={getOrganizationLogoUrl(doc.senderName, organizations)}
                    documentLine={doc}
                    documentCategories={categoriesAvailable}
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
    </Box>
  )
}

export default ServicePortalDocuments
