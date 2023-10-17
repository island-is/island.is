import { useState, useCallback, useEffect, useMemo } from 'react'
import {
  Box,
  Stack,
  Pagination,
  Text,
  GridContainer,
  GridColumn,
  GridRow,
  Button,
  SkeletonLoader,
  Checkbox,
  toast,
} from '@island.is/island-ui/core'
import {
  useListDocuments,
  useOrganizations,
} from '@island.is/service-portal/graphql'
import {
  ServicePortalPath,
  formatPlausiblePathToParams,
  m,
  useScrollTopOnUpdate,
} from '@island.is/service-portal/core'
import {
  DocumentCategory,
  DocumentSender,
  DocumentType,
} from '@island.is/api/schema'
import { useLocale, useNamespaces } from '@island.is/localization'
import { documentsSearchDocumentsInitialized } from '@island.is/plausible'
import { useLocation, useNavigate } from 'react-router-dom'
import { getOrganizationLogoUrl } from '@island.is/shared/utils'
import isAfter from 'date-fns/isAfter'
import differenceInYears from 'date-fns/differenceInYears'
import DocumentsFilter from '../../components/DocumentFilter/DocumentsFilter'
import debounce from 'lodash/debounce'
import { defaultFilterValues, FilterValuesType } from '../../utils/types'
import * as styles from './Overview.css'
import { AuthDelegationType } from '@island.is/shared/types'
import DocumentLine from '../../components/DocumentLine/DocumentLine'
import { useUserInfo } from '@island.is/auth/react'
import { useKeyDown } from '../../hooks/useKeyDown'
import { usePostBulkMailActionMutation } from './BatchMailAction.generated'
import { FavAndStash } from '../../components/FavAndStash'
import DocumentDisplay from '../../components/OverviewDisplay/OverviewDocumentDisplay'
import { ActiveDocumentType } from '../../lib/types'
import {
  useDocumentCategoriesQuery,
  useDocumentSendersQuery,
  useDocumentTypesQuery,
} from './DocumentExtra.generated'

const pageSize = 10

export const ServicePortalDocuments = () => {
  useNamespaces('sp.documents')
  const userInfo = useUserInfo()
  const { formatMessage } = useLocale()
  const [page, setPage] = useState(1)
  const [selectedLines, setSelectedLines] = useState<Array<string>>([])
  const navigate = useNavigate()
  const location = useLocation()
  const [activeDocument, setActiveDocument] =
    useState<ActiveDocumentType | null>(null)
  const isLegal = userInfo.profile.delegationType?.includes(
    AuthDelegationType.LegalGuardian,
  )

  const [bulkMailAction, { loading: bulkMailActionLoading }] =
    usePostBulkMailActionMutation({
      onError: (_) => toast.error(formatMessage(m.errorTitle)),
      onCompleted: (data) => {
        if (data.postBulkMailAction?.success) {
          if (refetch) {
            refetch({
              ...fetchObject(),
            })
          }
        } else {
          toast.error(formatMessage(m.errorTitle))
        }
      },
    })

  const dateOfBirth = userInfo?.profile.dateOfBirth
  let isOver15 = false
  if (dateOfBirth) {
    isOver15 = differenceInYears(new Date(), dateOfBirth) > 15
  }
  const hideHealthData = isOver15 && isLegal

  const sortState = {
    direction: 'Descending',
    key: 'Date',
  }
  const [searchInteractionEventSent, setSearchInteractionEventSent] =
    useState(false)
  useScrollTopOnUpdate([page])

  const [filterValue, setFilterValue] =
    useState<FilterValuesType>(defaultFilterValues)

  const fetchObject = () => {
    return {
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
      archived: filterValue.archived,
      bookmarked: filterValue.bookmarked,
    }
  }

  const { data, totalCount, loading, error, refetch } = useListDocuments({
    ...fetchObject(),
  })

  const { data: categoriesData, loading: categoriesLoading } =
    useDocumentCategoriesQuery()

  const { data: typesData, loading: typesLoading } = useDocumentTypesQuery()

  const { data: sendersData, loading: sendersLoading } =
    useDocumentSendersQuery()

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
    if (location?.state?.doc) {
      setActiveDocument(location?.state?.doc)
    }
  }, [location?.state?.doc])

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

  const pagedDocuments = {
    from: (page - 1) * pageSize,
    to: pageSize * page,
    totalPages: Math.ceil(totalCount / pageSize),
  }

  const { data: organizations } = useOrganizations()

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

  const handleShowArchived = useCallback((showArchived: boolean) => {
    setPage(1)
    setFilterValue((prevFilter) => ({
      ...prevFilter,
      archived: showArchived,
    }))
  }, [])

  const handleShowBookmarked = useCallback((showBookmarked: boolean) => {
    setPage(1)
    setFilterValue((prevFilter) => ({
      ...prevFilter,
      bookmarked: showBookmarked,
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

  useKeyDown('Escape', () => setActiveDocument(null))

  const debouncedResults = useMemo(() => {
    return debounce(handleSearchChange, 500)
  }, [])

  const activeArchive = filterValue.archived === true

  return (
    <GridContainer>
      <GridRow
        direction={['columnReverse', 'columnReverse', 'columnReverse', 'row']}
      >
        <GridColumn
          hiddenBelow={activeDocument?.document ? 'lg' : undefined}
          span={['12/12', '12/12', '12/12', '5/12']}
        >
          <Box marginBottom={2} printHidden marginY={3}>
            <Box
              className={styles.btn}
              display={'inlineFlex'}
              alignItems={'center'}
            >
              <Button
                preTextIcon="arrowBack"
                preTextIconType="filled"
                size="small"
                type="button"
                variant="text"
                truncate
                onClick={() => navigate('/')}
              >
                {formatMessage(m.goBackToDashboard)}
              </Button>
              <Box
                borderRadius={'circle'}
                display={'inlineBlock'}
                marginY={0}
                marginX={1}
                className={styles.bullet}
              ></Box>
              <Button unfocusable size="small" variant="text" truncate as="h1">
                {formatMessage(m.documents)}
              </Button>
            </Box>
          </Box>
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
            handleShowArchived={handleShowArchived}
            handleShowBookmarked={handleShowBookmarked}
            handleClearFilters={handleClearFilters}
            documentsLength={totalCount}
          />
          <Box marginTop={4}>
            <Box
              background="blue100"
              width="full"
              borderColor="blue200"
              borderBottomWidth="standard"
              display="flex"
              justifyContent="spaceBetween"
              padding={2}
            >
              <Box display="flex">
                <Box className={styles.checkboxWrap} marginRight={3}>
                  {!activeArchive && (
                    <Checkbox
                      name="checkbox-select-all"
                      checked={selectedLines.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          const allDocumentIds = filteredDocuments.map(
                            (item) => item.id,
                          )
                          setSelectedLines([...allDocumentIds])
                        } else {
                          setSelectedLines([])
                        }
                      }}
                    />
                  )}
                </Box>
                {selectedLines.length > 0 ? null : (
                  <Text variant="eyebrow">{formatMessage(m.info)}</Text>
                )}
              </Box>

              {selectedLines.length > 0 && !activeArchive ? (
                <FavAndStash
                  loading={bulkMailActionLoading}
                  onStash={() =>
                    bulkMailAction({
                      variables: {
                        input: {
                          messageIds: selectedLines,
                          action: 'archive',
                          status: true,
                        },
                      },
                    })
                  }
                  onFav={() =>
                    bulkMailAction({
                      variables: {
                        input: {
                          messageIds: selectedLines,
                          action: 'bookmark',
                          status: true,
                        },
                      },
                    })
                  }
                />
              ) : (
                <Text variant="eyebrow">{formatMessage(m.date)}</Text>
              )}
            </Box>
            {loading && (
              <Box marginTop={4}>
                <SkeletonLoader
                  space={2}
                  repeat={6}
                  display="block"
                  width="full"
                  height={65}
                />
              </Box>
            )}
            <Stack space={0}>
              {filteredDocuments.map((doc) => (
                <Box key={doc.id}>
                  <DocumentLine
                    img={getOrganizationLogoUrl(doc.senderName, organizations)}
                    documentLine={doc}
                    onClick={setActiveDocument}
                    active={doc.id === activeDocument?.id}
                    bookmarked={!!doc.bookmarked}
                    selected={selectedLines.includes(doc.id)}
                    archived={activeArchive}
                    refetchInboxItems={() => {
                      if (refetch) {
                        refetch({
                          ...fetchObject(),
                        })
                      }
                    }}
                    setSelectLine={(docId) => {
                      if (selectedLines.includes(doc.id)) {
                        const filtered = selectedLines.filter(
                          (item) => item !== doc.id,
                        )
                        setSelectedLines([...filtered])
                      } else {
                        setSelectedLines([...selectedLines, docId])
                      }
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Box>
        </GridColumn>
        <GridColumn
          span={['12/12', '12/12', '12/12', '7/12']}
          position="relative"
        >
          <DocumentDisplay
            activeDocument={activeDocument}
            activeArchive={activeArchive}
            activeBookmark={
              !!filteredDocuments?.filter(
                (doc) => doc?.id === activeDocument?.id,
              )?.[0]?.bookmarked
            }
            category={categoriesAvailable.find(
              (i) => i.id === activeDocument?.categoryId,
            )}
            onPressBack={() => setActiveDocument(null)}
            onRefetch={() => {
              if (refetch) {
                refetch({
                  ...fetchObject(),
                })
              }
            }}
            loading={loading}
            error={error}
          />
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          {filteredDocuments && (
            <Box paddingBottom={4} marginTop={4}>
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
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default ServicePortalDocuments
