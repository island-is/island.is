import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Tiles,
  Text,
  Stack,
  Hidden,
  LoadingDots,
} from '@island.is/island-ui/core'
import React, { useState } from 'react'
import { HeroBanner } from '../../components'
import Card from '../../components/Card/Card'
import Layout from '../../components/Layout/Layout'
import SearchAndFilter from '../../components/SearchAndFilter/SearchAndFilter'
import {
  ArrOfStatistics,
  ArrOfTypes,
  Case,
  CaseFilter,
} from '../../types/interfaces'
import EmptyState from '../../components/EmptyState/EmptyState'
import Filter from '../../components/Filter/Filter'
import { useFrontPageFilters } from '../../utils/helpers'
import Pagination from '../../components/Pagination/Pagination'

const CARDS_PER_PAGE = 12
interface HomeProps {
  types: ArrOfTypes
  statistics: ArrOfStatistics
}

export const Home = ({ types, statistics }: HomeProps) => {
  const [page, setPage] = useState<number>(0)

  const {
    cases,
    total,
    getCasesLoading,
    PolicyAreas,
    allPolicyAreas,
    Institutions,
    allInstitutions,
    filters,
    setFilters,
    defaultValues,
  } = useFrontPageFilters({
    types: types,
    CARDS_PER_PAGE: CARDS_PER_PAGE,
    page: page,
  })

  const renderCards = () => {
    if (getCasesLoading) {
      return (
        <Box
          display="flex"
          width="full"
          alignItems="center"
          justifyContent="center"
          style={{ height: 200 }}
        >
          <LoadingDots color="blue" large />
        </Box>
      )
    }

    if (cases?.length === 0) {
      return <EmptyState />
    }

    return (
      <>
        {cases && (
          <Tiles space={3} columns={[1, 1, 1, 2, 3]}>
            {cases.map((item: Case, index: number) => {
              const card = {
                id: item.id,
                title: item.name,
                tag: item.statusName,
                published: item.created,
                processEnds: item.processEnds,
                processBegins: item.processBegins,
                eyebrows: [item.typeName, item.institutionName],
              }
              return (
                <Card key={index} card={card} frontPage showPublished>
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
        <Pagination
          page={page}
          setPage={(page: number) => setPage(page)}
          totalPages={Math.ceil(total / CARDS_PER_PAGE)}
        />
      </>
    )
  }

  return (
    <Layout isFrontPage seo={{ title: 'Öll mál' }}>
      <HeroBanner statistics={statistics} />
      <SearchAndFilter
        PolicyAreas={PolicyAreas}
        defaultPolicyAreas={allPolicyAreas}
        Institutions={Institutions}
        defaultInstitutions={allInstitutions}
        filters={filters}
        setFilters={(arr: CaseFilter) => setFilters(arr)}
        loading={getCasesLoading}
      />
      <GridContainer>
        <GridRow>
          <GridColumn span={['0', '0', '0', '3/12', '3/12']}>
            <Hidden below="lg">
              <Filter
                filters={filters}
                setFilters={(arr: CaseFilter) => setFilters(arr)}
                defaultValues={defaultValues}
                loading={getCasesLoading}
              />
            </Hidden>
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '12/12', '9/12', '9/12']}>
            {renderCards()}
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Layout>
  )
}

export default Home
