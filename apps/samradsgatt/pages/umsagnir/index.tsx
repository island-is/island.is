import {
  Box,
  Breadcrumbs,
  Column,
  Columns,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocation } from 'react-use'
import Layout from '../../components/Layout/Layout'

export const MyReviewPage = () => {
  const location = useLocation()
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
            {/* <Columns space={3} alignY="center">
              <Column> */}
            {/* <AsyncSearch
                  options={options}
                  placeholder="Að hverju ertu að leita?"
                  initialInputValue=""
                  inputValue={searchValue}
                  onInputValueChange={(value) => {
                    setSearchValue(value)
                  }}
                /> */}
            {/* </Column>
              <Column>
                <div></div>
              </Column>
            </Columns> */}
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span={['0', '0', '3/12', '3/12', '3/12']}></GridColumn>
          <GridColumn span={['12/12', '12/12', '9/12', '9/12', '9/12']}>
            {/* {data && (
              <Tiles space={3} columns={[1, 1, 1, 2, 3]}>
                {data.map((item, index) => {
                  return <Card key={index} {...item} />
                })}
              </Tiles>
            )} */}
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Layout>
  )
}

export default MyReviewPage
