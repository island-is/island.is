import { ApolloClient, NormalizedCacheObject } from '@apollo/client'

import {
  GetNamespaceQuery,
  QueryGetNamespaceArgs,
} from '@island.is/web/graphql/schema'
import { NamespaceMessages } from '@island.is/web/hooks/useNamespace'
import { GET_NAMESPACE_QUERY } from '@island.is/web/screens/queries'

export type UiTextGetter = {
  <Payload extends NamespaceMessages>(
    apolloClient: ApolloClient<NormalizedCacheObject>,
    lang: string,
    namespace: string,
    defaults?: undefined,
  ): Partial<Payload>

  <Payload extends NamespaceMessages>(
    apolloClient: ApolloClient<NormalizedCacheObject>,
    lang: string,
    namespace: string,
    defaults: Payload,
  ): Payload
}

export const getUiTexts: UiTextGetter = <Payload extends NamespaceMessages>(
  apolloClient: ApolloClient<NormalizedCacheObject>,
  lang: string,
  namespace: string,
  defaults?: Payload,
) =>
  apolloClient
    .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
      query: GET_NAMESPACE_QUERY,
      variables: { input: { namespace, lang } },
    })
    .then((res) => JSON.parse(res.data?.getNamespace?.fields || '') as Payload)
    .catch(() => defaults || ({} as Partial<Payload>))
