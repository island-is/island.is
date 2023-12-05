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
import header from '../../../assets/headerImage.svg'
import { Filters, countryAreas, pageSize } from '../../lib/utils'

const Lists = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const allLists = useLoaderData() as SignatureCollectionList[]
  const [lists, setLists] = useState(allLists)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<Filters>({
    area: [],
    input: '',
  })

  useEffect(() => {
    if (filters.area.length > 0 || filters.input.length > 0) {
      let filteredList = []

      //filter by area
      filteredList = allLists.filter((list) => {
        return filters.area.some((filter) => filter === list.area.name)
      })

      //filter by input
      filteredList = (filteredList.length > 0 ? filteredList : allLists).filter(
        (list) => {
          return (
            list.owner.name
              .toLowerCase()
              .includes(filters.input.toLowerCase()) ||
            list.area.name.toLowerCase().includes(filters.input.toLowerCase())
          )
        },
      )

      setPage(1)
      setLists(filteredList)
    } else {
      setLists(allLists)
    }
  }, [filters])

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
            img={header}
            imgPosition="right"
            imgHiddenBelow="sm"
          />
          <GridRow marginBottom={5}>
            <GridColumn span={['12/12', '12/12', '7/12']}>
              <FilterInput
                name="input"
                placeholder={formatMessage(m.searchInAllListsPlaceholder)}
                value={filters.input}
                onChange={(value) => setFilters({ ...filters, input: value })}
                backgroundColor="white"
              />
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '5/12']}>
              <Box
                display="flex"
                justifyContent="spaceBetween"
                marginTop={[2, 2, 0, 0]}
              >
                <Filter
                  labelClear=""
                  labelClose=""
                  labelResult=""
                  labelOpen={formatMessage(m.filter)}
                  labelClearAll={formatMessage(m.clearFilters)}
                  resultCount={lists.length}
                  variant="popover"
                  reverse
                  onFilterClear={() => {
                    setFilters({
                      area: [],
                      input: '',
                    })
                  }}
                >
                  <FilterMultiChoice
                    labelClear=""
                    categories={[
                      {
                        id: 'area',
                        label: formatMessage(m.countryArea),
                        selected: filters.area,
                        filters: countryAreas,
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

                <Box
                  display="flex"
                  justifyContent="flexEnd"
                  alignItems="flexEnd"
                  style={{ minWidth: '150px' }}
                >
                  {filters.input.length > 0 || filters.area.length > 0
                    ? lists.length > 0 && (
                        <Text variant="eyebrow" textAlign="right">
                          {formatMessage(m.uploadResultsHeader)}: {lists.length}
                        </Text>
                      )
                    : allLists.length > 0 && (
                        <Text variant="eyebrow" textAlign="right">
                          {formatMessage(m.totalListResults)}: {allLists.length}
                        </Text>
                      )}
                </Box>
              </Box>
            </GridColumn>
          </GridRow>

          {lists?.length > 0 ? (
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
                      heading={list.owner.name + ' - ' + list.area.name}
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
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default Lists
