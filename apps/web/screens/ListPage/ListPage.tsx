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
  ListItemResponse,
  ListPage as ListPageSchema,
  Query,
  QueryGetListItemsArgs,
} from '@island.is/web/graphql/schema'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { webRichText } from '@island.is/web/utils/richText'

import { GET_LIST_ITEMS_QUERY, GET_LIST_PAGE_QUERY } from '../queries/ListPage'
import { useApolloClient, useLazyQuery, useQuery } from '@apollo/client'
import { useState } from 'react'
import { useDebounce } from 'react-use'

const DEBOUNCE_TIME_IN_MS = 300

interface ListPageProps {
  listPage: ListPageSchema
  initialItemsResponse?: ListItemResponse | null
}

// TODO: og:image, og:title, og:description
// TODO: add pagination

const ListPage: Screen<ListPageProps> = ({
  listPage,
  initialItemsResponse,
}) => {
  const [searchValue, setSearchValue] = useQueryState('q')
  const [itemsResponse, setItemsResponse] = useState(initialItemsResponse)

  const [fetchListItems] = useLazyQuery<Query, QueryGetListItemsArgs>(
    GET_LIST_ITEMS_QUERY,
    {
      onCompleted(data) {
        // TODO: req res matching
        setItemsResponse(data.getListItems)
      },
    },
  )

  useDebounce(
    () => {
      fetchListItems({
        variables: {
          input: {
            listPageId: listPage.id,
            size: 10,
            lang: 'is', // TODO
            page: 1,
            queryString: searchValue,
          },
        },
      })
    },
    DEBOUNCE_TIME_IN_MS,
    [searchValue],
  )

  return (
    <Box paddingBottom={3}>
      <GridContainer>
        <Stack space={5}>
          <Text variant="h1" as="h1">
            {listPage.title}
          </Text>

          <Input
            name="list-search" // TODO: think of a good name
            label="Leit" // TODO: read label and placeholder from listpage content type data
            value={searchValue || ''}
            onChange={(ev) => {
              setSearchValue(ev.target.value || null)
            }}
          />

          <Stack space={2}>
            {itemsResponse?.items?.map((item) => (
              <Box
                key={item.id}
                padding={[2, 2, 3]}
                border="standard"
                borderRadius="large"
              >
                <Stack space={2}>
                  <Text variant="h4" as="span" color="dark400">
                    {item.title}
                  </Text>
                  <Box>{webRichText(item.thumbnailContent ?? [])}</Box>
                </Stack>
              </Box>
            ))}
          </Stack>
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

  // TODO: fix types
  const listItemsResponse = await apolloClient.query<
    Query,
    QueryGetListItemsArgs
  >({
    query: GET_LIST_ITEMS_QUERY,
    variables: {
      input: {
        lang: locale,
        listPageId: listPage.id,
        page: 1,
        size: 10,
        queryString: query.q as string,
      },
    },
  })

  return {
    listPage,
    initialItemsResponse: listItemsResponse?.data?.getListItems,
  }
}

export default withMainLayout(ListPage)
