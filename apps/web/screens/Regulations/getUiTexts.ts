import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import {
  GetNamespaceQuery,
  QueryGetNamespaceArgs,
} from '@island.is/web/graphql/schema'
import { GET_NAMESPACE_QUERY } from '../queries'
import { NamespaceMessages } from '@island.is/web/hooks/useNamespace'

export const getUiTexts = <Payload extends NamespaceMessages>(
  apolloClient: ApolloClient<NormalizedCacheObject>,
  lang: string,
  namespace: string,
  defaults: Payload,
) =>
  apolloClient
    .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
      query: GET_NAMESPACE_QUERY,
      variables: { input: { namespace, lang } },
    })
    .then((res) => JSON.parse(res?.data?.getNamespace?.fields || '') as Payload)
    .catch((e) => defaults)
