import {
  GetListPageQuery,
  GetListPageQueryVariables,
  ListPage as ListPageSchema,
} from '@island.is/web/graphql/schema'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'

import { GET_LIST_PAGE_QUERY } from '../queries/ListPage'

interface ListPageProps {
  listPage: ListPageSchema
}

const ListPage: Screen<ListPageProps> = ({ listPage }) => {
  return <div>{JSON.stringify(listPage)}</div>
}

ListPage.getProps = async ({ apolloClient, locale, query }) => {
  const response = await apolloClient.query<
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

  const listPage = response.data.getListPage

  if (!listPage) {
    throw new CustomNextError(404)
  }

  return {
    listPage,
  }
}

export default withMainLayout(ListPage)
