import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Tiles,
  Text,
  Stack,
  Hidden,
  Pagination,
} from '@island.is/island-ui/core'
import React, { useState } from 'react'
import { HeroBanner } from '../../components'
import Card from '../../components/Card/Card'
import Layout from '../../components/Layout/Layout'
import SearchAndFilter from '../../components/SearchAndFilter/SearchAndFilter'
import {
  ArrOfTypes,
  Case,
  CaseFilter,
  FilterInputItems,
} from '../../types/interfaces'
import EmptyState from '../../components/EmptyState/EmptyState'
import { useQuery } from '@apollo/client'
import Filter from '../../components/Filter/Filter'
import { CaseSortOptions } from '../../types/enums'
import { GET_CASES } from './getCases.graphql'
import initApollo from '../../graphql/client'
import getInitFilterValues from './getInitFilterValues'
import SEO from '../../components/SEO/SEO'

const CARDS_PER_PAGE = 12
interface HomeProps {
  types: ArrOfTypes
}
export const Home = ({ types }: HomeProps) => {
  const [page, setPage] = useState<number>(1)

  const goToPage = (page = 1, scrollTop = true) => {
    setPage(page)
    if (scrollTop) {
      window.scrollTo(0, 0)
    }
  }

  const {
    caseStatuses,
    caseTypes,
    Institutions,
    allInstitutions,
    PolicyAreas,
    allPolicyAreas,
    sorting,
    period,
  } = getInitFilterValues({ types: types })

  const defaultValues = {
    query: '',
    sorting: { items: sorting, isOpen: true },
    caseStatuses: { items: caseStatuses, isOpen: true },
    caseTypes: { items: caseTypes, isOpen: true },
    policyAreas: allPolicyAreas,
    institutions: allInstitutions,
    period: period,
  }

  const [filters, setFilters] = useState<CaseFilter>({
    query: '',
    sorting: { items: sorting, isOpen: true },
    caseStatuses: { items: caseStatuses, isOpen: true },
    caseTypes: { items: caseTypes, isOpen: true },
    policyAreas: allPolicyAreas,
    institutions: allInstitutions,
    period: period,
  } as any)

  const input = {
    caseStatuses: filters.caseStatuses.items
      .filter((item: FilterInputItems) => item.checked)
      .map((item: FilterInputItems) => parseInt(item.value)),
    caseTypes: filters.caseTypes.items
      .filter((item: FilterInputItems) => item.checked)
      .map((item: FilterInputItems) => parseInt(item.value)),
    orderBy: Object.keys(CaseSortOptions).find(
      (key) =>
        CaseSortOptions[key] ===
        filters.sorting.items.filter(
          (item: FilterInputItems) => item.checked,
        )[0].label,
    ),
    // query: filters.query,
    policyAreas: filters.policyAreas,
    institutions: filters.institutions,
    dateFrom: filters.period.from,
    dateTo: filters.period.to,
    pageSize: CARDS_PER_PAGE * 5,
  }

  const client = initApollo()

  const { data, loading, error, refetch } = useQuery(GET_CASES, {
    client: client,
    ssr: true,
    fetchPolicy: 'network-only',
    variables: {
      input,
    },
  })

  const { consultationPortalGetCases: cases = [] } = data ?? {}

  const count = cases.length
  const totalPages = Math.ceil(count / CARDS_PER_PAGE)
  const base = page === 1 ? 0 : (page - 1) * CARDS_PER_PAGE
  const visibleItems = cases.slice(base, page * CARDS_PER_PAGE)

  return (
    <>
      <SEO title="Öll mál" url="" />
      <Layout isFrontPage>
        <HeroBanner />

        <SearchAndFilter
          PolicyAreas={PolicyAreas}
          defaultPolicyAreas={allPolicyAreas}
          Institutions={Institutions}
          defaultInstitutions={allInstitutions}
          filters={filters}
          setFilters={(arr: CaseFilter) => setFilters(arr)}
        />

        <GridContainer>
          <GridRow>
            <GridColumn span={['0', '0', '0', '3/12', '3/12']}>
              <Hidden below="lg">
                <Filter
                  filters={filters}
                  setFilters={(arr: CaseFilter) => setFilters(arr)}
                  defaultValues={defaultValues}
                />
              </Hidden>
            </GridColumn>

            <GridColumn span={['12/12', '12/12', '12/12', '9/12', '9/12']}>
              <>
                {visibleItems && (
                  <Tiles space={3} columns={[1, 1, 1, 2, 3]}>
                    {visibleItems.map((item: Case, index: number) => {
                      const card = {
                        id: item.id,
                        title: item.name,
                        tag: item.statusName,
                        eyebrows: [item.typeName, item.institutionName],
                      }
                      return (
                        <Card key={index} card={card} frontPage>
                          <Stack space={2}>
                            <Text variant="eyebrow" color="purple400">
                              {`Fjöldi umsagna: ${item.adviceCount}`}
                            </Text>
                            <Box
                              style={{
                                wordBreak: 'break-word',
                                height: '105px',
                              }}
                              overflow="hidden"
                            >
                              <Text variant="small" color="dark400">
                                {item.shortDescription}
                              </Text>
                            </Box>
                          </Stack>
                        </Card>
                      )
                    })}
                  </Tiles>
                )}
                {totalPages > 1 && (
                  <Box paddingTop={[5, 5, 5, 8, 8]}>
                    <Pagination
                      page={page}
                      totalPages={totalPages}
                      variant="blue"
                      renderLink={(page, className, children) => (
                        <button
                          onClick={() => {
                            goToPage(page)
                          }}
                        >
                          <span
                            style={{
                              position: 'absolute',
                              width: '1px',
                              height: '1px',
                              padding: '0',
                              margin: '-1px',
                              overflow: 'hidden',
                              clip: 'rect(0,0,0,0)',
                              border: '0',
                            }}
                          >
                            Síða
                          </span>
                          <span className={className}>{children}</span>
                        </button>
                      )}
                    />
                  </Box>
                )}
              </>
              {cases.length === 0 && <EmptyState />}
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Layout>
    </>
  )
}

export default Home
