import { useQueryState } from 'next-usequerystate'

import {
  Box,
  GridContainer,
  Input,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  GetListPageQuery,
  GetListPageQueryVariables,
  ListPage as ListPageSchema,
} from '@island.is/web/graphql/schema'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'

import { GET_LIST_ITEMS_QUERY, GET_LIST_PAGE_QUERY } from '../queries/ListPage'

interface ListPageProps {
  listPage: ListPageSchema
}

const ListPage: Screen<ListPageProps> = ({ listPage }) => {
  const [searchValue, setSearchValue] = useQueryState('q')

  return (
    <Box paddingBottom={3}>
      <GridContainer>
        <Stack space={2}>
          <Text variant="h1" as="h1">
            {listPage.title}
          </Text>

          <Input
            name="list-search"
            label="Leit"
            value={searchValue || ''}
            onChange={(ev) => {
              setSearchValue(ev.target.value || null)
            }}
          />

          <Stack space={2}>asdf</Stack>
        </Stack>
      </GridContainer>
    </Box>
  )
}

ListPage.getProps = async ({ apolloClient, locale, query }) => {
  const listPageResponse = await apolloClient.query<
    GetListPageQuery,
    GetListPageQueryVariables
  >({
    query: GET_LIST_PAGE_QUERY,
    variables: {
      input: {
        slug: query.slug as string,
        lang: locale,
      },
    },
  })

  const listPage = listPageResponse.data.getListPage

  if (!listPage) {
    throw new CustomNextError(
      404,
      `List page with slug: "${query.slug}" was not found`,
    )
  }

  const listItemsResponse = await apolloClient.query<
    GetListPageQuery,
    GetListPageQueryVariables
  >({
    query: GET_LIST_ITEMS_QUERY,
    variables: {
      input: {
        slug: query.slug as string,
        lang: locale,
      },
    },
  })

  // TODO: use list page id to fetch first paginated response of list items

  return {
    listPage,
    items: 
  }
}

export default withMainLayout(ListPage)
