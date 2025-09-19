import {
  ActionCard,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
  Stack,
  Pagination,
  Filter,
  FilterMultiChoice,
  Breadcrumbs,
  Divider,
  AlertMessage,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { SignatureCollectionPaths } from '../../lib/paths'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  CollectionStatus,
  SignatureCollectionList,
} from '@island.is/api/schema'
import format from 'date-fns/format'
import { signatureCollectionNavigation } from '../../lib/navigation'
import {
  FiltersOverview,
  countryAreas,
  getTagConfig,
  pageSize,
} from '../../lib/utils'
import { format as formatNationalId } from 'kennitala'
import EmptyState from '../../shared-components/emptyState'
import CompareLists from '../../shared-components/compareLists'
import { ListsLoaderReturn } from '../../loaders/AllLists.loader'
import nationalRegistryLogo from '../../../assets/nationalRegistry.svg'
import ActionDrawer from '../../shared-components/actionDrawer'
import { Actions } from '../../shared-components/actionDrawer/ListActions'
import FindSignature from '../../shared-components/findSignature'

const Lists = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const { allLists, collectionStatus, collection } =
    useLoaderData() as ListsLoaderReturn

  const [lists, setLists] = useState(allLists)
  const [page, setPage] = useState(1)
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
  }, [filters, allLists])

  useEffect(() => {
    // set candidates on initial load of lists
    if (lists.length > 0) {
      const candidates = lists
        .map((list) => {
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
  }, [lists])

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
          <Box marginBottom={3}>
            <Breadcrumbs
              items={[
                {
                  title: formatMessage(m.signatureListsTitlePresidential),
                },
              ]}
            />
          </Box>
          <IntroHeader
            title={formatMessage(m.signatureListsTitlePresidential)}
            intro={formatMessage(m.signatureListsIntro)}
            img={nationalRegistryLogo}
            imgPosition="right"
            imgHiddenBelow="sm"
            buttonGroup={
              <ActionDrawer
                allowedActions={[
                  Actions.DownloadReports,
                  Actions.CreateCollection,
                  Actions.ReviewCandidates,
                  Actions.CompleteCollectionProcessing,
                ]}
              />
            }
            marginBottom={4}
          />
          {collectionStatus === CollectionStatus.Processed && (
            <Box marginY={3}>
              <AlertMessage
                type="success"
                title={formatMessage(m.collectionProcessedTitle)}
                message={formatMessage(m.collectionProcessedMessage)}
              />
            </Box>
          )}
          {collectionStatus === CollectionStatus.InReview && (
            <Box marginY={3}>
              <AlertMessage
                type="success"
                title={formatMessage(m.collectionPresidentialReviewedTitle)}
                message={formatMessage(m.collectionPresidentialReviewedMessage)}
              />
            </Box>
          )}
          <Divider />
          <Box marginTop={9} />
          {lists?.length > 0 && (
            <GridRow marginBottom={5}>
              <GridColumn span={'12/12'}>
                <FindSignature collectionId={collection.id} />
              </GridColumn>
              <GridColumn span={'12/12'}>
                <Filter
                  labelClear=""
                  labelClose=""
                  labelResult=""
                  labelOpen={formatMessage(m.filterCandidates)}
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
              </GridColumn>
            </GridRow>
          )}
          {lists?.length > 0 ? (
            <Box>
              <Box marginBottom={2} display="flex" justifyContent="flexEnd">
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
                        {formatMessage(m.totalCandidates)}: {candidates.length}
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
                        eyebrow={`${formatMessage(m.listEndTime)}: ${format(
                          new Date(list.endTime),
                          'dd.MM.yyyy',
                        )}`}
                        heading={list.title}
                        progressMeter={{
                          currentProgress: list.numberOfSignatures ?? 0,
                          maxProgress: list.area.min,
                          withLabel: true,
                        }}
                        tag={getTagConfig(list)}
                        cta={{
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
                        }}
                      />
                    )
                  })}
              </Stack>
            </Box>
          ) : filters.input.length > 0 ? (
            <Box display="flex">
              <Text>{formatMessage(m.noListsFoundBySearch)}</Text>
              <Box marginLeft={1}>
                <Text variant="h5">{filters.input}</Text>
              </Box>
            </Box>
          ) : (
            <EmptyState
              title={formatMessage(m.noLists)}
              description={formatMessage(m.noListsDescription)}
            />
          )}
          {lists?.length > 0 && (
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
          {lists?.length > 0 && (
            <CompareLists
              collectionId={collection?.id}
              collectionType={collection?.collectionType}
            />
          )}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default Lists
