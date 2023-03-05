import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Tiles,
  Text,
  Stack,
  Pagination,
  Hidden,
  DatePicker,
  Button,
} from '@island.is/island-ui/core'
import React, { useEffect, useState } from 'react'
import { HeroBanner } from '../components'
import Card from '../components/Card/Card'
import Layout from '../components/Layout/Layout'
import SearchAndFilter from '../components/SearchAndFilter/SearchAndFilter'
import Types from '../utils/dummydata/api/Types'
import { Cases } from '../utils/dummydata'
import { Case } from '../types/interfaces'
import FilterBox from '../components/Filterbox/Filterbox'
import EmptyState from '../components/EmptyState/EmptyState'

const CARDS_PER_PAGE = 12

export const Index = () => {
  const Institutions = Object.entries(Types.institutions).map(
    ([value, label]) => ({
      value,
      label,
    }),
  )
  const PolicyAreas = Object.entries(Types.policyAreas).map(
    ([value, label]) => ({
      value,
      label,
    }),
  )

  const [searchValue, setSearchValue] = useState<string>('')
  const [institutionValue, setInstitutionValue] = useState<string>('')
  const [policyAreaValue, setPolicyAreaValue] = useState<string>('')
  const [data, setData] = useState<Array<Case>>(Cases)
  const [page, setPage] = useState<number>(1)

  const goToPage = (page = 1, scrollTop = true) => {
    setPage(page)
    if (scrollTop) {
      window.scrollTo(0, 0)
    }
  }

  useEffect(() => {
    searchValue
      ? setData(
          Cases.filter((item) => item.policyAreaName.includes(policyAreaValue))
            .filter((item) => item.institutionName.includes(institutionValue))
            .filter(
              (item) =>
                item.name.includes(searchValue) ||
                item.caseNumber.includes(searchValue) ||
                item.institutionName.includes(searchValue),
            ),
        )
      : setData(
          Cases.filter((item) =>
            item.policyAreaName.includes(policyAreaValue),
          ).filter((item) => item.institutionName.includes(institutionValue)),
        )
  }, [searchValue])

  useEffect(() => {
    institutionValue
      ? setData(
          data.filter((item) => item.institutionName === institutionValue),
        )
      : setData(
          Cases.filter(
            (item) =>
              item.name.includes(searchValue) ||
              item.caseNumber.includes(searchValue) ||
              item.institutionName.includes(searchValue) ||
              item.policyAreaName.includes(searchValue),
          ).filter((item) => item.policyAreaName.includes(policyAreaValue)),
        )
  }, [institutionValue])

  useEffect(() => {
    policyAreaValue
      ? setData(data.filter((item) => item.policyAreaName === policyAreaValue))
      : setData(
          Cases.filter(
            (item) =>
              item.name.includes(searchValue) ||
              item.caseNumber.includes(searchValue) ||
              item.institutionName.includes(searchValue) ||
              item.policyAreaName.includes(searchValue),
          ).filter((item) => item.institutionName.includes(institutionValue)),
        )
  }, [policyAreaValue])

  const count = data.length
  const totalPages = Math.ceil(count / CARDS_PER_PAGE)
  const base = page === 1 ? 0 : (page - 1) * CARDS_PER_PAGE
  const visibleItems = data.slice(base, page * CARDS_PER_PAGE)

  return (
    <Layout isFrontPage>
      <HeroBanner />

      <SearchAndFilter
        searchValue={searchValue}
        setSearchValue={(newValue) => setSearchValue(newValue)}
        PolicyAreas={PolicyAreas}
        Institutions={Institutions}
        setInstitutionValue={(value) => setInstitutionValue(value)}
        setPolicyAreaValue={(value) => setPolicyAreaValue(value)}
      />

      <GridContainer>
        <GridRow>
          <GridColumn span={['0', '0', '0', '3/12', '3/12']}>
            <Hidden below="lg">
              <Stack space={2}>
                <FilterBox>Röðun</FilterBox>
                <FilterBox>Staða máls</FilterBox>
                <FilterBox>Tegund máls</FilterBox>
                <DatePicker
                  size="sm"
                  locale="is"
                  label="Veldu tímabil"
                  placeholderText="Veldu hér"
                />
                <Box textAlign="right">
                  <Button size="small" icon="reload" variant="text">
                    Hreinsa allar síur
                  </Button>
                </Box>
              </Stack>
            </Hidden>
          </GridColumn>

          <GridColumn span={['12/12', '12/12', '12/12', '9/12', '9/12']}>
            {data && (
              <>
                {visibleItems && (
                  <Tiles space={3} columns={[1, 1, 1, 2, 3]}>
                    {visibleItems.map((item, index) => {
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
            )}
            {data.length === 0 && <EmptyState />}
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Layout>
  )
}

export default Index
