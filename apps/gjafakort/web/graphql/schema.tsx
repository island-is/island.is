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
  id?: Maybe<Scalars['String']>
  email: Scalars['String']
  state: Scalars['String']
}

export type CreateApplicationInput = {
  ssn: Scalars['String']
  email: Scalars['String']
}

export type CreateApplicationPayload = {
  __typename?: 'createApplicationPayload'
  application?: Maybe<Application>
}

export type Mutation = {
  __typename?: 'Mutation'
  createApplication?: Maybe<CreateApplicationPayload>
  root?: Maybe<Scalars['String']>
}

export type MutationCreateApplicationArgs = {
  input: CreateApplicationInput
}

export type Query = {
  __typename?: 'Query'
  application?: Maybe<Application>
  root?: Maybe<Scalars['String']>
}

export type QueryApplicationArgs = {
  ssn: Scalars['String']
}

export type ApplicationQueryQueryVariables = {
  ssn: Scalars['String']
}

export type ApplicationQueryQuery = { __typename?: 'Query' } & {
  application?: Maybe<{ __typename?: 'Application' } & Pick<Application, 'id'>>
}

export const ApplicationQueryDocument = gql`
  query ApplicationQuery($ssn: String!) {
    application(ssn: $ssn) {
      id
    }
  }
`

/**
 * __useApplicationQueryQuery__
 *
 * To run a query within a React component, call `useApplicationQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useApplicationQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useApplicationQueryQuery({
 *   variables: {
 *      ssn: // value for 'ssn'
 *   },
 * });
 */
export function useApplicationQueryQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ApplicationQueryQuery,
    ApplicationQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    ApplicationQueryQuery,
    ApplicationQueryQueryVariables
  >(ApplicationQueryDocument, baseOptions)
}
export function useApplicationQueryLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ApplicationQueryQuery,
    ApplicationQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    ApplicationQueryQuery,
    ApplicationQueryQueryVariables
  >(ApplicationQueryDocument, baseOptions)
}
export type ApplicationQueryQueryHookResult = ReturnType<
  typeof useApplicationQueryQuery
>
export type ApplicationQueryLazyQueryHookResult = ReturnType<
  typeof useApplicationQueryLazyQuery
>
export type ApplicationQueryQueryResult = ApolloReactCommon.QueryResult<
  ApplicationQueryQuery,
  ApplicationQueryQueryVariables
>
