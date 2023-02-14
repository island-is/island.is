import {
  Box,
  Breadcrumbs,
  DropdownMenu,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
  Tiles,
} from '@island.is/island-ui/core'
import { Card } from '../../components'
import { useState } from 'react'
import { useLocation } from 'react-use'
import Layout from '../../components/Layout/Layout'

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

export const MyReviewPage = () => {
  const location = useLocation()
  const dummycontent: arrayDummy = [
    {
      id: 3027,
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
      id: 3027,
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
  ]
  //   const [searchValue, setSearchValue] = useState<string>('')
  //   const [prevSearchValue, setPrevSearchValue] = useState<string>('')
  const [data, setData] = useState(dummycontent)
  return (
    <Layout showIcon={false}>
      <GridContainer>
        <GridRow>
          <GridColumn span="12/12" paddingBottom={4} paddingTop={4}>
            <Box paddingY={3}>
              <Breadcrumbs
                items={[
                  { title: 'Samráðsgátt', href: '/samradsgatt' },
                  { title: 'Mínar áskriftir', href: '/samradsgatt' },
                  {
                    title: 'Mál',
                    href: location.href,
                  },
                ]}
              />
            </Box>
            <Text variant="h1">Mínar umsagnir</Text>
            <Text variant="default" marginY={2}>
              Hér er hægt að fylgjast með þeim áskriftum sem þú ert skráð(ur) í
              ásamt því að sjá allar umsagnir sem þú ert búin að skrifa í gegnum
              tíðina.
            </Text>
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '12/12', '12/12']}>
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
                      key={index}
                      width="440px"
                      height="376px"
                      showAttachment
                      card={review}
                      dropdown={
                        <DropdownMenu
                          icon="chevronDown"
                          title="Viðhengi"
                          items={item.documents.map((doc) => {
                            return {
                              title: doc.name,
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
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Layout>
  )
}

export default MyReviewPage
