import {
  AsyncSearchOption,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Tiles,
  Text,
  Pagination,
} from '@island.is/island-ui/core'
import React, { useEffect, useState } from 'react'
import { HeroBanner } from '../components'
import Card from '../components/Card/Card'
import Layout from '../components/Layout/Layout'
import SearchAndFilter from '../components/SearchAndFilter/SearchAndFilter'
import Types from '../utils/dummydata/api/Types'
import { Cases } from '../utils/dummydata'
import { Case } from '../types/interfaces'

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
  const [prevSearchValue, setPrevSearchValue] = useState<string>('')
  const [data, setData] = useState<Array<Case>>(Cases)
  const [options, setOptions] = useState<AsyncSearchOption[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)

  const goToPage = (page = 1, scrollTop = true) => {
    setPage(page)

    if (scrollTop) {
      window.scrollTo(0, 0)
    }
  }

  const clearAll = () => {
    setIsLoading(false)
    setOptions([])
    setData(Cases)
  }
  useEffect(() => {
    if (!searchValue) {
      clearAll()
    } else if (searchValue != prevSearchValue) {
      const filtered = Cases.filter(
        (item) =>
          item.name.includes(searchValue) ||
          item.caseNumber.includes(searchValue) ||
          item.institutionName.includes(searchValue),
      )
      setData(filtered)
      setPrevSearchValue(searchValue)
    }
  }, [searchValue])

  const count = data.length
  const totalPages = Math.ceil(count / CARDS_PER_PAGE)
  const base = page === 1 ? 0 : (page - 1) * CARDS_PER_PAGE
  const visibleItems = data.slice(base, page * CARDS_PER_PAGE)

  return (
    <Layout showIcon={false}>
      <HeroBanner />

      <SearchAndFilter
        data={data}
        setData={(newData) => setData(newData)}
        cases={Cases}
        searchValue={searchValue}
        setSearchValue={(newValue) => setSearchValue(newValue)}
        PolicyAreas={PolicyAreas}
        Institutions={Institutions}
        options={options}
      />

      <GridContainer>
        <GridRow>
          <GridColumn span={['0', '0', '3/12', '3/12', '3/12']}></GridColumn>
          <GridColumn span={['12/12', '12/12', '9/12', '9/12', '9/12']}>
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
                    <Card key={index} card={card}>
                      <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="spaceBetween"
                      >
                        <Text variant="eyebrow" color="purple400">
                          {`Fjöldi umsagna: ${item.adviceCount}`}
                        </Text>
                      </Box>
                      <Box style={{ minHeight: 132, lineBreak: 'anywhere' }}>
                        <Text variant="small" color="dark400">
                          {item.shortDescription}
                        </Text>
                      </Box>
                    </Card>
                  )
                })}
              </Tiles>
            )}
            {totalPages > 1 && (
              <Box paddingTop={8}>
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
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Layout>
  )
}

export default Index
