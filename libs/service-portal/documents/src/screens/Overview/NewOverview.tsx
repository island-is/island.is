import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useQuery, gql } from '@apollo/client'
import {
  Box,
  Stack,
  LoadingDots,
  Pagination,
  Text,
  GridContainer,
  GridColumn,
  GridRow,
  PdfViewer,
  Button,
  Tooltip,
  Hidden,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import {
  useListDocuments,
  useOrganizations,
} from '@island.is/service-portal/graphql'
import {
  useScrollToRefOnUpdate,
  ServicePortalPath,
  formatPlausiblePathToParams,
  NoDataScreen,
  m,
  CardLoader,
} from '@island.is/service-portal/core'
import {
  DocumentCategory,
  DocumentDetails,
  DocumentSender,
  DocumentType,
  Query,
} from '@island.is/api/schema'
import { useLocale, useNamespaces } from '@island.is/localization'
import { documentsSearchDocumentsInitialized } from '@island.is/plausible'
import { useNavigate } from 'react-router-dom'
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
import * as styles from './Overview.css'
import { AuthDelegationType } from '@island.is/shared/types'
import NewDocumentLine from '../../components/DocumentLine/NewDocumentLine'
import AvatarImage from '../../components/DocumentLine/AvatarImage'
import NoPDF from '../../components/NoPDF/NoPDF'
import { SERVICE_PORTAL_HEADER_HEIGHT_LG } from '@island.is/service-portal/constants'
import { useUserInfo } from '@island.is/auth/react'

export type ActiveDocumentType = {
  document: DocumentDetails
  id: string
  subject: string
  date: string
  sender: string
  downloadUrl: string
  img?: string
}

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

const pageSize = 10

export const ServicePortalDocuments = () => {
  useNamespaces('sp.documents')
  const userInfo = useUserInfo()
  const { formatMessage } = useLocale()
  const [page, setPage] = useState(1)
  const [isEmpty, setEmpty] = useState(false)
  const [scalePDF, setScalePDF] = useState(1.0)
  const navigate = useNavigate()
  const [
    activeDocument,
    setActiveDocument,
  ] = useState<ActiveDocumentType | null>(null)
  console.log('activeDocument - Overview', activeDocument)
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
  const [searchInteractionEventSent, setSearchInteractionEventSent] = useState(
    false,
  )
  const { scrollToRef } = useScrollToRefOnUpdate([page])

  const [filterValue, setFilterValue] = useState<FilterValuesType>(
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
    pageSize: pageSize,
    isLegalGuardian: hideHealthData,
  })

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

  const downloadFile = async () => {
    let html: string | undefined = undefined
    if (activeDocument?.document.html) {
      html =
        activeDocument?.document.html.length > 0
          ? activeDocument?.document.html
          : undefined
    }
    if (html) {
      setTimeout(() => {
        const win = window.open('', '_blank')
        win && html && win.document.write(html)
        win?.focus()
      }, 250)
    } else {
      // Create form elements
      const form = document.createElement('form')
      const documentIdInput = document.createElement('input')
      const tokenInput = document.createElement('input')

      const token = userInfo?.access_token

      if (!token) return

      form.appendChild(documentIdInput)
      form.appendChild(tokenInput)

      // Form values
      form.method = 'post'
      form.action = activeDocument?.downloadUrl ?? ''
      form.target = '_blank'

      // Document Id values
      documentIdInput.type = 'hidden'
      documentIdInput.name = 'documentId'
      documentIdInput.value = activeDocument?.id ?? ''

      // National Id values
      tokenInput.type = 'hidden'
      tokenInput.name = '__accessToken'
      tokenInput.value = token

      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)
    }
  }

  const PDF = () => {
    return (
      <>
        <Box
          className={styles.pdfControls}
          display="flex"
          flexDirection="row"
          paddingBottom={2}
        >
          <Tooltip placement="top" as="span" text={formatMessage(m.zoomOut)}>
            <Button
              circle
              icon="remove"
              variant="ghost"
              size="small"
              onClick={() => setScalePDF(0.6 > scalePDF ? 0.5 : scalePDF - 0.1)}
            />
          </Tooltip>
          <Box
            paddingX={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Text variant="small">{(scalePDF * 100).toFixed(0) + '%'}</Text>
          </Box>
          <Tooltip placement="top" as="span" text={formatMessage(m.zoomIn)}>
            <Button
              circle
              icon="add"
              variant="ghost"
              size="small"
              onClick={() => setScalePDF(scalePDF > 3.9 ? 4 : scalePDF + 0.1)}
            />
          </Tooltip>
          <Box paddingLeft={2}>
            <Tooltip placement="top" as="span" text={formatMessage(m.download)}>
              <Button
                variant="ghost"
                size="small"
                circle
                icon="download"
                onClick={() => downloadFile()}
              />
            </Tooltip>
          </Box>
          <Box paddingLeft={2}>
            <Tooltip placement="top" as="span" text={formatMessage(m.print)}>
              <Button
                variant="ghost"
                size="small"
                circle
                icon="print"
                onClick={() => downloadFile()}
              />
            </Tooltip>
          </Box>
        </Box>
        <Box
          className={styles.pdfPage}
          height="full"
          overflow="auto"
          boxShadow="subtle"
        >
          <PdfViewer
            file={`data:application/pdf;base64,${activeDocument?.document.content}`}
            showAllPages
            scale={scalePDF}
            autoWidth={false}
          />
        </Box>
      </>
    )
  }

  const GoBack = () => {
    return (
      <Box marginBottom={1} className={styles.btn} printHidden marginY={3}>
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
      </Box>
    )
  }

  return (
    <GridContainer>
      <Hidden above="md">
        <GridRow>
          <GridColumn span="12/12" position="relative">
            <Box>{activeDocument?.document.content && <Box>{PDF()}</Box>}</Box>
          </GridColumn>
        </GridRow>
      </Hidden>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <GoBack />
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
          <Box borderColor="blue200" borderTopWidth="standard" marginTop={4}>
            {loading && (
              <SkeletonLoader
                space={2}
                repeat={6}
                display="block"
                width="full"
                height={65}
              />
            )}
            <Stack space={0}>
              {filteredDocuments.map((doc, index) => (
                <Box key={doc.id} ref={index === 0 ? scrollToRef : null}>
                  <NewDocumentLine
                    img={getOrganizationLogoUrl(doc.senderName, organizations)}
                    documentLine={doc}
                    documentCategories={categoriesAvailable}
                    userInfo={userInfo}
                    onClick={setActiveDocument}
                    active={doc.id === activeDocument?.id}
                  />
                </Box>
              ))}
            </Stack>
          </Box>
        </GridColumn>
        <GridColumn span="7/12" position="relative">
          {activeDocument?.document.content ? (
            <Hidden below="lg">
              <Box
                marginLeft={8}
                marginTop={3}
                padding={5}
                borderRadius="large"
                background="white"
              >
                <Box display="flex">
                  <AvatarImage img={activeDocument?.img} background="blue100" />
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="spaceBetween"
                    marginBottom={4}
                    marginLeft={2}
                  >
                    <Text variant="h5">{activeDocument?.sender}</Text>
                    <Text variant="medium">{activeDocument?.date}</Text>
                  </Box>
                </Box>
                <Box>{PDF()}</Box>
              </Box>
            </Hidden>
          ) : (
            <Box
              position="sticky"
              style={{ top: SERVICE_PORTAL_HEADER_HEIGHT_LG + 50 }}
              paddingLeft={8}
            >
              <Hidden below="lg">
                {loading ? (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    paddingTop={6}
                  >
                    <LoadingDots />
                  </Box>
                ) : (
                  <NoPDF />
                )}
              </Hidden>
            </Box>
          )}
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
