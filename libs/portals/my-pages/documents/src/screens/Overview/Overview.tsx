import {
  Box,
  Checkbox,
  GridColumn,
  GridContainer,
  GridRow,
  Pagination,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  GoBack,
  m,
  useScrollTopOnUpdate,
} from '@island.is/portals/my-pages/core'
import { useOrganizations } from '@island.is/portals/my-pages/graphql'
import { getOrganizationLogoUrl } from '@island.is/shared/utils'
import debounce from 'lodash/debounce'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import DocumentsFilter from '../../components/DocumentFilter/DocumentsFilter'
import DocumentLine from '../../components/DocumentLine/DocumentLine'
import { FavAndStash } from '../../components/FavAndStash/FavAndStash'
import DocumentDisplay from '../../components/OverviewDisplay/OverviewDocumentDisplay'
import { useDocumentFilters } from '../../hooks/useDocumentFilters'
import { pageSize, useDocumentList } from '../../hooks/useDocumentList'
import { useKeyDown } from '../../hooks/useKeyDown'
import { useMailAction } from '../../hooks/useMailActionV2'
import { DocumentsPaths } from '../../lib/paths'
import { messages } from '../../utils/messages'
import { useDocumentContext } from './DocumentContext'
import * as styles from './Overview.css'

export const DocumentsOverview = () => {
  useNamespaces('sp.documents')
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const location = useLocation()
  const { data: organizations } = useOrganizations()

  const {
    selectedLines,
    activeDocument,
    filterValue,
    page,
    categoriesAvailable,
    sendersAvailable,
    docLoading,
    documentDisplayError,
    replyState,
    setReplyState,
    setSelectedLines,
    setActiveDocument,
    setFilterValue,
  } = useDocumentContext()

  const {
    loading,
    error,
    activeArchive,
    totalPages,
    filteredDocuments,
    totalCount,
  } = useDocumentList()

  const [focusId, setFocusId] = useState<string>()

  const { handlePageChange, handleSearchChange } = useDocumentFilters()

  const { submitBatchAction, loading: batchActionLoading } = useMailAction()

  useScrollTopOnUpdate([page])

  useEffect(() => {
    if (location?.state?.doc) {
      setActiveDocument(location.state.doc)
    }
  }, [location?.state?.doc, setActiveDocument])

  useEffect(() => {
    return () => {
      debouncedResults.cancel()
    }
  })

  useKeyDown('Escape', () => {
    setActiveDocument(null)
    navigate(DocumentsPaths.ElectronicDocumentsRoot, {
      replace: true,
    })
  })

  const debouncedResults = useMemo(() => {
    return debounce(handleSearchChange, 500)
  }, [])

  useEffect(() => {
    if (focusId) {
      const element = document.getElementById(`button-${focusId}`)
      if (element) {
        element.focus()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusId])

  const rowDirection = error ? 'column' : 'columnReverse'

  return (
    <GridContainer
      className={replyState?.replyOpen ? styles.gridContainer : undefined}
    >
      <GridRow
        direction={[rowDirection, rowDirection, rowDirection, 'row']}
        className={replyState?.replyOpen ? styles.gridRow : undefined}
      >
        <GridColumn
          hiddenBelow={activeDocument?.document ? 'lg' : undefined}
          span={['12/12', '12/12', '12/12', '5/12']}
        >
          <Box>
            <Box marginY={2} printHidden>
              <Box
                className={styles.btn}
                display={'inlineFlex'}
                alignItems={'center'}
              >
                <GoBack display="inline" noUnderline marginBottom={0} />
                <Box
                  borderRadius="full"
                  display={'inlineBlock'}
                  marginY={0}
                  marginX={1}
                  className={styles.bullet}
                />
                <Text
                  as="h1"
                  variant="eyebrow"
                  color="blue400"
                  fontWeight="semiBold"
                >
                  <button
                    onClick={() =>
                      navigate(DocumentsPaths.ElectronicDocumentsRoot, {
                        replace: true,
                      })
                    }
                  >
                    {formatMessage(m.documents)}
                  </button>
                </Text>
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
              documentsLength={totalCount}
            />
            <Box marginTop={[2, 2, 4]}>
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
                    <Checkbox
                      name="checkbox-select-all"
                      ariaLabel={formatMessage(messages.selectAll)}
                      checked={selectedLines.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          const allDocumentIds = filteredDocuments
                            .filter((x) => !x.isUrgent)
                            .map((item) => item.id)
                          setSelectedLines([...allDocumentIds])
                        } else {
                          setSelectedLines([])
                        }
                      }}
                    />
                  </Box>
                  {selectedLines.length > 0 ? null : (
                    <Text variant="eyebrow">{formatMessage(m.info)}</Text>
                  )}
                </Box>

                {selectedLines.length > 0 ? (
                  <FavAndStash
                    loading={batchActionLoading}
                    onStash={() =>
                      submitBatchAction(
                        activeArchive ? 'unarchive' : 'archive',
                        selectedLines,
                        filteredDocuments.length === selectedLines.length,
                      )
                    }
                    archived={activeArchive}
                    onFav={() => submitBatchAction('bookmark', selectedLines)}
                    onRead={() => submitBatchAction('read', selectedLines)}
                  />
                ) : (
                  <Text variant="eyebrow">{formatMessage(m.date)}</Text>
                )}
              </Box>
              {loading && (
                <Box marginTop={2}>
                  <SkeletonLoader
                    space={2}
                    repeat={pageSize}
                    display="block"
                    width="full"
                    height={57}
                  />
                </Box>
              )}
              <Stack space={0}>
                {filteredDocuments.map((doc) => (
                  <Box key={doc.id}>
                    <DocumentLine
                      img={
                        doc?.sender?.name
                          ? getOrganizationLogoUrl(
                              doc?.sender?.name,
                              organizations,
                              60,
                              'none',
                            )
                          : undefined
                      }
                      documentLine={doc}
                      hasInitialFocus={doc.id === focusId}
                      active={doc.id === activeDocument?.id}
                      bookmarked={!!doc.bookmarked}
                      selected={selectedLines.includes(doc.id)}
                      setSelectLine={(docId) => {
                        if (selectedLines.includes(doc.id)) {
                          const filtered = selectedLines.filter(
                            (item) => item !== doc.id,
                          )
                          setSelectedLines([...filtered])
                        } else {
                          // Urgent documents can't be selected and marked "read"
                          // Can be put in storage when being opened otherwise not
                          if (!doc.isUrgent) {
                            setSelectedLines([...selectedLines, docId])
                          }
                        }
                      }}
                    />
                  </Box>
                ))}
                {totalPages ? (
                  <Box paddingBottom={4} marginTop={4}>
                    <Pagination
                      page={page}
                      totalPages={totalPages}
                      renderLink={(page, className, children) => (
                        <button
                          type="button"
                          className={className}
                          onClick={handlePageChange.bind(null, page)}
                          aria-label={formatMessage(messages.goToPage, {
                            page,
                          })}
                        >
                          {children}
                        </button>
                      )}
                    />
                  </Box>
                ) : undefined}
              </Stack>
            </Box>
          </Box>
        </GridColumn>
        <GridColumn
          span={['12/12', '12/12', '12/12', '7/12']}
          position="relative"
          className={styles.documentDisplayGridColumn}
        >
          <DocumentDisplay
            activeBookmark={
              !!filteredDocuments?.filter(
                (doc) => doc?.id === activeDocument?.id,
              )?.[0]?.bookmarked
            }
            category={categoriesAvailable.find(
              (i) => i.id === activeDocument?.categoryId,
            )}
            onPressBack={() => {
              if (activeDocument?.id) {
                setFocusId(activeDocument.id)
              }
              if (replyState?.replyOpen) {
                setReplyState((prev) => ({
                  ...prev,
                  replyOpen: false,
                }))
              }
              setActiveDocument(null)
            }}
            error={{
              message: error
                ? formatMessage(messages.error)
                : documentDisplayError ?? undefined,
              code: error ? 'list' : 'single',
            }}
            loading={docLoading}
          />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default DocumentsOverview
