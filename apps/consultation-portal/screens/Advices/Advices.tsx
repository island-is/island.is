import {
  Box,
  DropdownMenu,
  GridContainer,
  Text,
  Tiles,
  Stack,
} from '@island.is/island-ui/core'
import { Card } from '../../components'
import { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import SearchAndSort from '../../components/SearchAndSort/SearchAndSort'
import { Area, SortOptions } from '../../types/enums'
import BreadcrumbsWithMobileDivider from '../../components/BreadcrumbsWithMobileDivider/BreadcrumbsWithMobileDivider'
import { sorting } from '../../utils/helpers'
import EmptyState from '../../components/EmptyState/EmptyState'
import Pagination from '../../components/Pagination/Pagination'

const CARDS_PER_PAGE = 12

export const AdvicesScreen = ({ allUserAdvices }) => {
  const [sortTitle, setSortTitle] = useState(SortOptions.aToZ)
  const [searchValue, setSearchValue] = useState('')
  const [page, setPage] = useState<number>(0)

  const [data, setData] = useState(allUserAdvices)

  // useEffect(() => {
  //   const sortedContent = sorting(allUserAdvices, sortTitle)
  //   searchValue
  //     ? setData(
  //         sortedContent.filter(
  //           (item) =>
  //             item.name.includes(searchValue) ||
  //             item.caseNumber.includes(searchValue) ||
  //             item.institution.includes(searchValue) ||
  //             item.type.includes(searchValue),
  //         ),
  //       )
  //     : setData(sortedContent)
  // }, [searchValue])

  const total = 0

  return (
    <Layout seo={{ title: 'umsagnir', url: 'umsagnir' }}>
      <BreadcrumbsWithMobileDivider
        items={[
          { title: 'Samráðsgátt', href: '/' },
          { title: 'Mínar umsagnir' },
        ]}
      />
      <GridContainer>
        <Stack space={5}>
          <Stack space={3}>
            <Text variant="h1">Mínar umsagnir</Text>
            <Text variant="default">
              Hér er hægt að fylgjast með þeim áskriftum sem þú ert skráð(ur) í
              ásamt því að sjá allar umsagnir sem þú ert búin að skrifa í gegnum
              tíðina.
            </Text>
          </Stack>
          {/* <SearchAndSort
            data={data}
            setData={(data) => setData(data)}
            searchValue={searchValue}
            setSearchValue={(newValue) => setSearchValue(newValue)}
            sortTitle={sortTitle}
            setSortTitle={(title: SortOptions) => setSortTitle(title)}
            currentTab={Area.case}
          /> */}
          {/* {data && (
            <>
              {data && (
                <Tiles space={3} columns={[1, 1, 1, 2, 3]}>
                  {data.map((item, index) => {
                    const review = {
                      tag: item.status,
                      id: item.id,
                      title: item.name,
                      eyebrows: [item.type, item.institution],
                    }
                    return (
                      <Card
                        frontPage={false}
                        key={index}
                        showAttachment
                        card={review}
                        dropdown={
                          <DropdownMenu
                            icon="chevronDown"
                            title="Viðhengi"
                            items={item.documents.map((doc) => {
                              return {
                                title: 'Viðhengi ' + doc.id + ' - ' + doc.name,
                                onClick: console.log,
                              }
                            })}
                          />
                        }
                      >
                        <Box
                          display="flex"
                          flexDirection="row"
                          alignItems="center"
                          justifyContent="spaceBetween"
                        >
                          <Text variant="eyebrow">Þín umsögn</Text>
                        </Box>
                        <Box
                          style={{
                            minHeight: 110,
                            lineBreak: 'anywhere',
                          }}
                        >
                          <Box>
                            <Text variant="small" color="dark400" truncate>
                              {item.review}
                            </Text>
                          </Box>
                        </Box>
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
          )} */}
          {data.length === 0 && <EmptyState />}
        </Stack>
      </GridContainer>
    </Layout>
  )
}

export default AdvicesScreen
