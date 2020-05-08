import gql from 'graphql-tag'
import * as ApolloReactCommon from '@apollo/react-common'
import * as ApolloReactHooks from '@apollo/react-hooks'
export type Maybe<T> = T | null
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type Application = {
  __typename?: 'Application'
  id: Scalars['String']
}

export type Mutation = {
  __typename?: 'Mutation'
  root?: Maybe<Scalars['String']>
}

export type Query = {
  __typename?: 'Query'
  getApplication?: Maybe<Application>
  root?: Maybe<Scalars['String']>
}

export type GetApplicationQueryVariables = {}

export type GetApplicationQuery = { __typename?: 'Query' } & {
  getApplication?: Maybe<
    { __typename?: 'Application' } & Pick<Application, 'id'>
  >
}

export const GetApplicationDocument = gql`
  query GetApplication {
    getApplication {
      id
    }
  }
`

/**
 * __useGetApplicationQuery__
 *
 * To run a query within a React component, call `useGetApplicationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetApplicationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetApplicationQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetApplicationQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetApplicationQuery,
    GetApplicationQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    GetApplicationQuery,
    GetApplicationQueryVariables
  >(GetApplicationDocument, baseOptions)
}
export function useGetApplicationLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetApplicationQuery,
    GetApplicationQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    GetApplicationQuery,
    GetApplicationQueryVariables
  >(GetApplicationDocument, baseOptions)
}
export type GetApplicationQueryHookResult = ReturnType<
  typeof useGetApplicationQuery
>
export type GetApplicationLazyQueryHookResult = ReturnType<
  typeof useGetApplicationLazyQuery
>
export type GetApplicationQueryResult = ApolloReactCommon.QueryResult<
  GetApplicationQuery,
  GetApplicationQueryVariables
>
