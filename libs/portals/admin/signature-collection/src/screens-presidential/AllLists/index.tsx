import {
  ActionCard,
  Box,
  FilterInput,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
  Stack,
  Pagination,
  Filter,
  FilterMultiChoice,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { SignatureCollectionPaths } from '../../lib/paths'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  SignatureCollectionCollectionType,
  SignatureCollectionList,
} from '@island.is/api/schema'
import format from 'date-fns/format'
import { signatureCollectionNavigation } from '../../lib/navigation'
import {
  CollectionStatus,
  FiltersOverview,
  countryAreas,
  pageSize,
} from '../../lib/utils'
import { format as formatNationalId } from 'kennitala'
import electionsCommitteeLogo from '../../../assets/electionsCommittee.svg'
import nationalRegistryLogo from '../../../assets/nationalRegistry.svg'
import ListInfo from '../../shared-components/listInfoAlert'
import EmptyState from '../../shared-components/emptyState'
import ReviewCandidates from './components/reviewCandidates'
import CompareLists from '../../shared-components/compareLists'
import { ListsLoaderReturn } from '../../loaders/AllLists.loader'
import CreateCollection from '../../shared-components/createCollection'
import ActionCompleteCollectionProcessing from '../../shared-components/completeCollectionProcessing'

const Lists = ({ allowedToProcess }: { allowedToProcess: boolean }) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const { allLists, collectionStatus, collection } =
    useLoaderData() as ListsLoaderReturn

  const [lists, setLists] = useState(allLists)
  const [page, setPage] = useState(1)
  // hasInReview is used to check if any list is in review
  const [hasInReview, setHasInReview] = useState(false)
  const [filters, setFilters] = useState<FiltersOverview>({
    area: [],
    candidate: [],
    input: '',
  })
  const [candidates, setCandidates] = useState<
    Array<{
      label: string
      value: string
    }>
  >([])

  useEffect(() => {
    let filteredList: SignatureCollectionList[] = allLists

    filteredList = filteredList.filter((list) => {
      return (
        // Filter by area
        (filters.area.length === 0 || filters.area.includes(list.area.name)) &&
        // Filter by candidate
        (filters.candidate.length === 0 ||
          filters.candidate.includes(list.candidate.name)) &&
        // Filter by input
        (filters.input.length === 0 ||
          list.candidate.name
            .toLowerCase()
            .includes(filters.input.toLowerCase()) ||
          list.area.name.toLowerCase().includes(filters.input.toLowerCase()) ||
          formatNationalId(list.candidate.nationalId).includes(filters.input))
      )
    })

    setPage(1)
    setLists(filteredList)
  }, [filters])

  useEffect(() => {
    // set candidates on initial load of lists
    if (lists.length > 0) {
      const candidates = lists
        .map((list) => {
          // mapping all lists to check if any are in review
          if (!list.reviewed) {
            setHasInReview(true)
          }
          return list.candidate.name
        })
        .filter((value, index, self) => self.indexOf(value) === index)
        .map((candidate) => {
          return {
            label: candidate,
            value: candidate,
          }
        })

      setCandidates(candidates)
    }
  }, [])

  return (
    <GridContainer>
      <GridRow direction="row">
        <GridColumn
          span={['12/12', '5/12', '5/12', '3/12']}
          offset={['0', '7/12', '7/12', '0']}
        >
          <PortalNavigation
            navigation={signatureCollectionNavigation}
            title={formatMessage(m.signatureListsTitle)}
          />
        </GridColumn>
        <GridColumn
          paddingTop={[5, 5, 5, 0]}
          offset={['0', '0', '0', '1/12']}
          span={['12/12', '12/12', '12/12', '8/12']}
        >
          <IntroHeader
            title={formatMessage(m.signatureListsTitlePresidential)}
            intro={formatMessage(m.signatureListsIntro)}
            img={
              allowedToProcess ? electionsCommitteeLogo : nationalRegistryLogo
            }
            imgPosition="right"
            imgHiddenBelow="sm"
          />
          {collectionStatus !== CollectionStatus.InitialActive && (
            <ListInfo
              type={
                collectionStatus === CollectionStatus.InReview && !hasInReview
                  ? 'success'
                  : undefined
              }
              message={formatMessage(
                collectionStatus === CollectionStatus.InInitialReview
                  ? hasInReview
                    ? m.signatureCollectionInInitialReview
                    : m.signatureCollectionProcessing
                  : collectionStatus === CollectionStatus.Processed
                  ? m.signatureCollectionProcessed
                  : collectionStatus === CollectionStatus.Active
                  ? m.signatureCollectionActive
                  : collectionStatus === CollectionStatus.InReview &&
                    hasInReview
                  ? m.signatureCollectionInReview
                  : m.signatureCollectionReviewDone,
              )}
            />
          )}
          <GridRow marginBottom={5}>
            <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
              <FilterInput
                name="input"
                placeholder={formatMessage(m.searchInAllListsPlaceholder)}
                value={filters.input}
                onChange={(value) => setFilters({ ...filters, input: value })}
                backgroundColor="blue"
              />
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
              <Box
                display="flex"
                justifyContent="spaceBetween"
                marginTop={[2, 2, 2, 0]}
              >
                <Filter
                  labelClear=""
                  labelClose=""
                  labelResult=""
                  labelOpen={formatMessage(m.filter)}
                  labelClearAll={formatMessage(m.clearAllFilters)}
                  resultCount={lists.length}
                  variant="popover"
                  onFilterClear={() => {
                    setFilters({
                      area: [],
                      candidate: [],
                      input: '',
                    })
                  }}
                >
                  <FilterMultiChoice
                    labelClear={formatMessage(m.clearFilter)}
                    categories={[
                      {
                        id: 'area',
                        label: formatMessage(m.countryArea),
                        selected: filters.area,
                        filters: countryAreas,
                      },
                      {
                        id: 'candidate',
                        label: formatMessage(m.candidate),
                        selected: filters.candidate,
                        filters: candidates,
                      },
                    ]}
                    onChange={(event) =>
                      setFilters({
                        ...filters,
                        [event.categoryId]: event.selected,
                      })
                    }
                    onClear={(categoryId) =>
                      setFilters({
                        ...filters,
                        [categoryId]: [],
                      })
                    }
                  />
                </Filter>
                {lists?.length > 0 &&
                  allowedToProcess &&
                  collectionStatus === CollectionStatus.InInitialReview && (
                    <CreateCollection
                      collectionId={collection?.id}
                      areaId={undefined}
                    />
                  )}
              </Box>
            </GridColumn>
          </GridRow>
          {lists?.length > 0 &&
          collection.collectionType ===
            SignatureCollectionCollectionType.Presidential ? (
            <>
              <Box marginBottom={2}>
                {filters.input.length > 0 ||
                filters.area.length > 0 ||
                filters.candidate.length > 0
                  ? lists.length > 0 && (
                      <Text variant="eyebrow">
                        {formatMessage(m.uploadResultsHeader)}: {lists.length}
                      </Text>
                    )
                  : allLists.length > 0 && (
                      <Text variant="eyebrow">
                        {formatMessage(m.totalListResults)}: {allLists.length}
                      </Text>
                    )}
              </Box>
              <Stack space={5}>
                {lists
                  .slice(pageSize * (page - 1), pageSize * page)
                  .map((list: SignatureCollectionList) => {
                    return (
                      <ActionCard
                        key={list.id}
                        eyebrow={
                          formatMessage(m.listEndTime) +
                          ': ' +
                          format(new Date(list.endTime), 'dd.MM.yyyy')
                        }
                        heading={list.title}
                        text={formatMessage(m.collectionTitle)}
                        progressMeter={{
                          currentProgress: list.numberOfSignatures ?? 0,
                          maxProgress: list.area.min,
                          withLabel: true,
                        }}
                        tag={
                          list.reviewed
                            ? {
                                label: formatMessage(m.confirmListReviewed),
                                variant: 'mint',
                                outlined: false,
                              }
                            : undefined
                        }
                        cta={
                          (allowedToProcess &&
                            collectionStatus !==
                              CollectionStatus.InitialActive) ||
                          !allowedToProcess
                            ? {
                                label: formatMessage(m.viewList),
                                variant: 'text',
                                icon: 'arrowForward',
                                onClick: () => {
                                  navigate(
                                    SignatureCollectionPaths.PresidentialList.replace(
                                      ':listId',
                                      list.id,
                                    ),
                                  )
                                },
                              }
                            : undefined
                        }
                      />
                    )
                  })}
              </Stack>
            </>
          ) : filters.input.length > 0 ? (
            <Box display="flex">
              <Text>{formatMessage(m.noListsFoundBySearch)}</Text>
              <Box marginLeft={1}>
                <Text variant="h5">{filters.input}</Text>
              </Box>
            </Box>
          ) : (
            <Box marginTop={10}>
              <EmptyState
                title={formatMessage(m.noLists)}
                description={formatMessage(m.noListsDescription)}
              />
            </Box>
          )}
          {lists?.length > 0 &&
            collection.collectionType ===
              SignatureCollectionCollectionType.Presidential && (
              <Box marginTop={5}>
                <Pagination
                  totalItems={lists.length}
                  itemsPerPage={pageSize}
                  page={page}
                  renderLink={(page, className, children) => (
                    <Box
                      cursor="pointer"
                      className={className}
                      onClick={() => setPage(page)}
                      component="button"
                    >
                      {children}
                    </Box>
                  )}
                />
              </Box>
            )}
          {lists?.length > 0 && allowedToProcess && (
            <Box>
              {(collectionStatus === CollectionStatus.InInitialReview ||
                collectionStatus === CollectionStatus.InReview) && (
                <CompareLists collectionId={collection?.id} />
              )}

              {!hasInReview &&
                collectionStatus === CollectionStatus.InInitialReview && (
                  <ActionCompleteCollectionProcessing
                    collectionId={collection?.id}
                  />
                )}
            </Box>
          )}

          {lists?.length > 0 &&
            collection.collectionType ===
              SignatureCollectionCollectionType.Presidential && (
              <ReviewCandidates candidates={collection?.candidates ?? []} />
            )}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default Lists
