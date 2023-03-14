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

type arrayDummy = Array<info>
type doc = {
  id: number
  name: string
}
type info = {
  caseNumber: string
  status: string
  id: number
  name: string
  adviceCount: number
  shortDescription: string
  institution: string
  policyArea: string
  type: string
  processBegins: string
  processEnds: string
  created: string
  review: string
  documents: Array<doc>
}

const dummycontent: arrayDummy = [
  {
    id: 3025,
    caseNumber: '3/2023',
    name: 'Númer 5 TESTE',
    adviceCount: 22,
    shortDescription: 'test',
    status: 'Til umsagnar',
    institution: 'Fjármála- og efnahagsráðuneytið',
    type: 'Drög að stefnu',
    policyArea: 'Fjölmiðlun',
    processBegins: '2023-01-13T00:00:00',
    processEnds: '2023-01-27T23:59:59',
    created: '2023-01-15T15:46:27.82',
    documents: [
      {
        id: 1,
        name: 'jo',
      },
    ],
    review:
      'Þetta er mín umsögn. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eget vulputate massa, ac posuere erat. Sed malesuada at ipsum a efficitur. Nam pellentesque semper sem, lacinia placerat enim sodales at. Nullam commodo auctor auctor. Etiam elit lorem, maximus in suscipit vitae, luctus eget sem.',
  },
  {
    id: 3093,
    caseNumber: '3/2023',
    name: 'Númer 5 TESTE',
    adviceCount: 22,
    shortDescription: 'test',
    status: 'Til umsagnar',
    institution: 'Fjármála- og efnahagsráðuneytið',
    type: 'Drög að stefnu',
    policyArea: 'Fjölmiðlun',
    processBegins: '2023-01-13T00:00:00',
    processEnds: '2023-01-27T23:59:59',
    created: '2023-01-15T15:46:27.82',
    documents: [
      {
        id: 1,
        name: 'jo',
      },
    ],
    review:
      'Þetta er mín umsögn. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eget vulputate massa, ac posuere erat. Sed malesuada at ipsum a efficitur. Nam pellentesque semper sem, lacinia placerat enim sodales at. Nullam commodo auctor auctor. Etiam elit lorem, maximus in suscipit vitae, luctus eget sem.',
  },
  {
    id: 3094,
    caseNumber: '3/2023',
    name: 'Númer 5 TESTE',
    adviceCount: 22,
    shortDescription: 'test',
    status: 'Til umsagnar',
    institution: 'Fjármála- og efnahagsráðuneytið',
    type: 'Drög að stefnu',
    policyArea: 'Fjölmiðlun',
    processBegins: '2023-01-13T00:00:00',
    processEnds: '2023-01-27T23:59:59',
    created: '2023-01-15T15:46:27.82',
    documents: [
      {
        id: 1,
        name: 'jo',
      },
    ],
    review:
      'Þetta er mín umsögn. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eget vulputate massa, ac posuere erat. Sed malesuada at ipsum a efficitur. Nam pellentesque semper sem, lacinia placerat enim sodales at. Nullam commodo auctor auctor. Etiam elit lorem, maximus in suscipit vitae, luctus eget sem.',
  },
  {
    id: 3095,
    caseNumber: '3/2023',
    name: 'Númer 5 TESTE',
    adviceCount: 22,
    shortDescription: 'test',
    status: 'Til umsagnar',
    institution: 'Fjármála- og efnahagsráðuneytið',
    type: 'Drög að stefnu',
    policyArea: 'Fjölmiðlun',
    processBegins: '2023-01-13T00:00:00',
    processEnds: '2023-01-27T23:59:59',
    created: '2023-01-15T15:46:27.82',
    documents: [
      {
        id: 1,
        name: 'jo',
      },
    ],
    review:
      'Þetta er mín umsögn. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eget vulputate massa, ac posuere erat. Sed malesuada at ipsum a efficitur. Nam pellentesque semper sem, lacinia placerat enim sodales at. Nullam commodo auctor auctor. Etiam elit lorem, maximus in suscipit vitae, luctus eget sem.',
  },
  {
    id: 3096,
    caseNumber: '3/2023',
    name: 'Númer 5 TESTE',
    adviceCount: 22,
    shortDescription: 'test',
    status: 'Til umsagnar',
    institution: 'Fjármála- og efnahagsráðuneytið',
    type: 'Drög að stefnu',
    policyArea: 'Fjölmiðlun',
    processBegins: '2023-01-13T00:00:00',
    processEnds: '2023-01-27T23:59:59',
    created: '2023-01-15T15:46:27.82',
    documents: [
      {
        id: 1,
        name: 'jo',
      },
    ],
    review:
      'Þetta er mín umsögn. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eget vulputate massa, ac posuere erat. Sed malesuada at ipsum a efficitur. Nam pellentesque semper sem, lacinia placerat enim sodales at. Nullam commodo auctor auctor. Etiam elit lorem, maximus in suscipit vitae, luctus eget sem.',
  },
  {
    id: 3097,
    caseNumber: '3/2023',
    name: 'Númer 5 TESTE',
    adviceCount: 22,
    shortDescription: 'test',
    status: 'Til umsagnar',
    institution: 'Fjármála- og efnahagsráðuneytið',
    type: 'Drög að stefnu',
    policyArea: 'Fjölmiðlun',
    processBegins: '2023-01-13T00:00:00',
    processEnds: '2023-01-27T23:59:59',
    created: '2023-01-15T15:46:27.82',
    documents: [
      {
        id: 1,
        name: 'jo',
      },
    ],
    review:
      'Þetta er mín umsögn. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eget vulputate massa, ac posuere erat. Sed malesuada at ipsum a efficitur. Nam pellentesque semper sem, lacinia placerat enim sodales at. Nullam commodo auctor auctor. Etiam elit lorem, maximus in suscipit vitae, luctus eget sem.',
  },
  {
    id: 3098,
    caseNumber: '3/2023',
    name: 'Númer 5 TESTE',
    adviceCount: 22,
    shortDescription: 'test',
    status: 'Til umsagnar',
    institution: 'Fjármála- og efnahagsráðuneytið',
    type: 'Drög að stefnu',
    policyArea: 'Fjölmiðlun',
    processBegins: '2023-01-13T00:00:00',
    processEnds: '2023-01-27T23:59:59',
    created: '2023-01-15T15:46:27.82',
    documents: [
      {
        id: 1,
        name: 'jo',
      },
    ],
    review:
      'Þetta er mín umsögn. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eget vulputate massa, ac posuere erat. Sed malesuada at ipsum a efficitur. Nam pellentesque semper sem, lacinia placerat enim sodales at. Nullam commodo auctor auctor. Etiam elit lorem, maximus in suscipit vitae, luctus eget sem.',
  },
  {
    id: 3099,
    caseNumber: '3/2023',
    name: 'Númer 5 TESTE',
    adviceCount: 22,
    shortDescription: 'test',
    status: 'Til umsagnar',
    institution: 'Fjármála- og efnahagsráðuneytið',
    type: 'Drög að stefnu',
    policyArea: 'Fjölmiðlun',
    processBegins: '2023-01-13T00:00:00',
    processEnds: '2023-01-27T23:59:59',
    created: '2023-01-15T15:46:27.82',
    documents: [
      {
        id: 1,
        name: 'jo',
      },
    ],
    review:
      'Þetta er mín umsögn. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eget vulputate massa, ac posuere erat. Sed malesuada at ipsum a efficitur. Nam pellentesque semper sem, lacinia placerat enim sodales at. Nullam commodo auctor auctor. Etiam elit lorem, maximus in suscipit vitae, luctus eget sem.',
  },
  {
    id: 3092,
    caseNumber: '3/2023',
    name: 'Númer 5 TESTE',
    adviceCount: 22,
    shortDescription: 'test',
    status: 'Til umsagnar',
    institution: 'Fjármála- og efnahagsráðuneytið',
    type: 'Drög að stefnu',
    policyArea: 'Fjölmiðlun',
    processBegins: '2023-01-13T00:00:00',
    processEnds: '2023-01-27T23:59:59',
    created: '2023-01-15T15:46:27.82',
    documents: [
      {
        id: 1,
        name: 'jo',
      },
    ],
    review:
      'Þetta er mín umsögn. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eget vulputate massa, ac posuere erat. Sed malesuada at ipsum a efficitur. Nam pellentesque semper sem, lacinia placerat enim sodales at. Nullam commodo auctor auctor. Etiam elit lorem, maximus in suscipit vitae, luctus eget sem.',
  },
  {
    id: 3081,
    caseNumber: '3/2023',
    name: 'Númer 5 TESTE',
    adviceCount: 22,
    shortDescription: 'test',
    status: 'Til umsagnar',
    institution: 'Fjármála- og efnahagsráðuneytið',
    type: 'Drög að stefnu',
    policyArea: 'Fjölmiðlun',
    processBegins: '2023-01-13T00:00:00',
    processEnds: '2023-01-27T23:59:59',
    created: '2023-01-15T15:46:27.82',
    documents: [
      {
        id: 1,
        name: 'jo',
      },
    ],
    review:
      'Þetta er mín umsögn. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eget vulputate massa, ac posuere erat. Sed malesuada at ipsum a efficitur. Nam pellentesque semper sem, lacinia placerat enim sodales at. Nullam commodo auctor auctor. Etiam elit lorem, maximus in suscipit vitae, luctus eget sem.',
  },

  {
    id: 3024,
    caseNumber: '3/2023',
    name: 'Númer 4 TESTE',
    adviceCount: 22,
    shortDescription: 'test',
    status: 'Til umsagnar',
    institution: 'Fjármála- og efnahagsráðuneytið',
    type: 'Drög að stefnu',
    policyArea: 'Fjölmiðlun',
    processBegins: '2023-01-13T00:00:00',
    processEnds: '2023-01-27T23:59:59',
    created: '2023-01-14T15:46:27.82',
    documents: [
      {
        id: 1,
        name: 'jo',
      },
      {
        id: 3,
        name: 'jos',
      },
      {
        id: 4,
        name: 'jod',
      },
    ],
    review:
      'Þetta er mín umsögn. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eget vulputate massa, ac posuere erat. Sed malesuada at ipsum a efficitur. Nam pellentesque semper sem, lacinia placerat enim sodales at. Nullam commodo auctor auctor. Etiam elit lorem, maximus in suscipit vitae, luctus eget sem.',
  },
  {
    id: 3023,
    caseNumber: '3/2023',
    name: 'Númer 3 TESTE',
    adviceCount: 22,
    shortDescription: 'test',
    status: 'Til umsagnar',
    institution: 'Fjármála- og efnahagsráðuneytið',
    type: 'Drög að stefnu',
    policyArea: 'Fjölmiðlun',
    processBegins: '2023-01-13T00:00:00',
    processEnds: '2023-01-27T23:59:59',
    created: '2023-01-13T15:46:27.82',
    documents: [
      {
        id: 1,
        name: 'jo',
      },
    ],
    review:
      'Þetta er mín umsögn. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eget vulputate massa, ac posuere erat. Sed malesuada at ipsum a efficitur. Nam pellentesque semper sem, lacinia placerat enim sodales at. Nullam commodo auctor auctor. Etiam elit lorem, maximus in suscipit vitae, luctus eget sem.',
  },
  {
    id: 3022,
    caseNumber: '3/2023',
    name: 'Númer 2 TESTE',
    adviceCount: 22,
    shortDescription: 'test',
    status: 'Til umsagnar',
    institution: 'Fjármála- og efnahagsráðuneytið',
    type: 'Drög að stefnu',
    policyArea: 'Fjölmiðlun',
    processBegins: '2023-01-13T00:00:00',
    processEnds: '2023-01-27T23:59:59',
    created: '2023-01-123T15:46:27.82',
    documents: [
      {
        id: 1,
        name: 'jo',
      },
    ],
    review:
      'Þetta er mín umsögn. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eget vulputate massa, ac posuere erat. Sed malesuada at ipsum a efficitur. Nam pellentesque semper sem, lacinia placerat enim sodales at. Nullam commodo auctor auctor. Etiam elit lorem, maximus in suscipit vitae, luctus eget sem.',
  },
]

const CARDS_PER_PAGE = 12

export const AdvicesScreen = ({ allUserAdvices }) => {
  const [sortTitle, setSortTitle] = useState(SortOptions.aToZ)
  const [searchValue, setSearchValue] = useState('')
  const [page, setPage] = useState<number>(1)

  const [data, setData] = useState(dummycontent)

  useEffect(() => {
    const sortedContent = sorting(dummycontent, sortTitle)
    searchValue
      ? setData(
          sortedContent.filter(
            (item) =>
              item.name.includes(searchValue) ||
              item.caseNumber.includes(searchValue) ||
              item.institution.includes(searchValue) ||
              item.type.includes(searchValue),
          ),
        )
      : setData(sortedContent)
  }, [searchValue])

  const updatePage = (pageNumber) => {
    setPage(pageNumber)
  }

  const count = data.length
  const totalPages = Math.ceil(count / CARDS_PER_PAGE)
  const base = page === 1 ? 0 : (page - 1) * CARDS_PER_PAGE
  const visibleItems = data.slice(base, page * CARDS_PER_PAGE)

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
          <SearchAndSort
            data={data}
            setData={(data) => setData(data)}
            searchValue={searchValue}
            setSearchValue={(newValue) => setSearchValue(newValue)}
            sortTitle={sortTitle}
            setSortTitle={(title: SortOptions) => setSortTitle(title)}
            currentTab={Area.case}
          />
          {data && (
            <>
              {visibleItems && (
                <Tiles space={3} columns={[1, 1, 1, 2, 3]}>
                  {visibleItems.map((item, index) => {
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
              {totalPages > 1 && (
                <Pagination updatePage={updatePage} totalPages={totalPages} />
              )}
            </>
          )}
          {data.length === 0 && <EmptyState />}
        </Stack>
      </GridContainer>
    </Layout>
  )
}

export default AdvicesScreen
