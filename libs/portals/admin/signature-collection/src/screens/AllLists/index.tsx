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
import { SignatureCollectionList } from '@island.is/api/schema'
import format from 'date-fns/format'
import { signatureCollectionNavigation } from '../../lib/navigation'
import { Filters, countryAreas, pageSize } from '../../lib/utils'
import CompareLists from './components/compareLists'
import { format as formatNationalId } from 'kennitala'
import CreateCollection from './components/createCollection'
import landskjortjorn from '../../../assets/landskjortjorn.svg'
import thjodskra from '../../../assets/thjodskra.svg'

const Lists = ({ allowedToProcess }: { allowedToProcess: boolean }) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const allLists = useLoaderData() as SignatureCollectionList[]
  const [lists, setLists] = useState(allLists)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<Filters>({
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
        .map((list) => list.candidate.name)
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
          paddingTop={[5, 5, 5, 2]}
          offset={['0', '0', '0', '1/12']}
          span={['12/12', '12/12', '12/12', '8/12']}
        >
          <IntroHeader
            title={formatMessage(m.signatureListsTitle)}
            intro={formatMessage(m.signatureListsIntro)}
            img={allowedToProcess ? landskjortjorn : thjodskra}
            imgPosition="right"
            imgHiddenBelow="sm"
          />
          <GridRow marginBottom={5}>
            <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
              <FilterInput
                name="input"
                placeholder={formatMessage(m.searchInAllListsPlaceholder)}
                value={filters.input}
                onChange={(value) => setFilters({ ...filters, input: value })}
                backgroundColor="white"
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
                {allowedToProcess && <CreateCollection />}
              </Box>
            </GridColumn>
          </GridRow>

          {lists?.length > 0 ? (
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
                        cta={{
                          label: formatMessage(m.viewList),
                          variant: 'text',
                          icon: 'arrowForward',
                          onClick: () => {
                            navigate(
                              SignatureCollectionPaths.SignatureList.replace(
                                ':id',
                                list.id,
                              ),
                            )
                          },
                        }}
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
            <Text>{formatMessage(m.noLists)}</Text>
          )}
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
          {allowedToProcess && <CompareLists />}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default Lists
