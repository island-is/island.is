import { ApolloClient, NormalizedCacheObject } from '@apollo/client'

import { Query, QueryGetCustomPageArgs } from '@island.is/web/graphql/schema'
import { GET_CUSTOM_PAGE_QUERY } from '@island.is/web/screens/queries/CustomPage'

export const getCustomPage = async (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  input: QueryGetCustomPageArgs['input'],
) => {
  const response = await apolloClient.query<Query, QueryGetCustomPageArgs>({
    query: GET_CUSTOM_PAGE_QUERY,
    variables: {
      input,
    },
  })
  return response?.data?.getCustomPage
}
