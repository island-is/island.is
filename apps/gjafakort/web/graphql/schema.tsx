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
  StringTrimmed: any
}

export type Company = {
  __typename?: 'Company'
  ssn: Scalars['String']
  name: Scalars['String']
  application?: Maybe<CompanyApplication>
}

export type ApplicationLog = {
  __typename?: 'ApplicationLog'
  id: Scalars['String']
  state: Scalars['String']
  title: Scalars['String']
  data?: Maybe<Scalars['String']>
  authorSSN?: Maybe<Scalars['String']>
}

export type CompanyApplication = {
  __typename?: 'CompanyApplication'
  id?: Maybe<Scalars['String']>
  name: Scalars['String']
  email: Scalars['String']
  state: Scalars['String']
  companySSN: Scalars['String']
  serviceCategory?: Maybe<Scalars['String']>
  generalEmail: Scalars['String']
  companyDisplayName?: Maybe<Scalars['String']>
  companyName?: Maybe<Scalars['String']>
  exhibition?: Maybe<Scalars['Boolean']>
  operatingPermitForRestaurant?: Maybe<Scalars['Boolean']>
  operatingPermitForVehicles?: Maybe<Scalars['Boolean']>
  operationsTrouble?: Maybe<Scalars['Boolean']>
  phoneNumber: Scalars['String']
  validLicenses?: Maybe<Scalars['Boolean']>
  validPermit?: Maybe<Scalars['Boolean']>
  webpage: Scalars['String']
  logs?: Maybe<Array<Maybe<ApplicationLog>>>
}

export type CreateCompanyApplicationInput = {
  email: Scalars['StringTrimmed']
  generalEmail: Scalars['StringTrimmed']
  phoneNumber: Scalars['StringTrimmed']
  operationsTrouble: Scalars['Boolean']
  companySSN: Scalars['StringTrimmed']
  name: Scalars['StringTrimmed']
  serviceCategory: Scalars['StringTrimmed']
  webpage: Scalars['StringTrimmed']
  companyName: Scalars['StringTrimmed']
  companyDisplayName: Scalars['StringTrimmed']
  operatingPermitForRestaurant: Scalars['Boolean']
  exhibition: Scalars['Boolean']
  operatingPermitForVehicles: Scalars['Boolean']
  validLicenses: Scalars['Boolean']
  validPermit: Scalars['Boolean']
}

export type CreateCompanyApplication = {
  __typename?: 'CreateCompanyApplication'
  application?: Maybe<CompanyApplication>
}

export type Query = {
  __typename?: 'Query'
  companies?: Maybe<Array<Maybe<Company>>>
  company?: Maybe<Company>
  companyApplications?: Maybe<Array<Maybe<CompanyApplication>>>
  root?: Maybe<Scalars['String']>
  userApplication?: Maybe<UserApplication>
}

export type QueryCompanyArgs = {
  ssn: Scalars['String']
}

export type Mutation = {
  __typename?: 'Mutation'
  createCompanyApplication?: Maybe<CreateCompanyApplication>
  createUserApplication?: Maybe<CreateUserApplication>
  root?: Maybe<Scalars['String']>
}

export type MutationCreateCompanyApplicationArgs = {
  input: CreateCompanyApplicationInput
}

export type MutationCreateUserApplicationArgs = {
  input: Maybe<CreateUserApplicationInput>
}

export type UserApplication = {
  __typename?: 'UserApplication'
  id: Scalars['String']
  mobileNumber: Scalars['String']
  countryCode: Scalars['String']
}

export type CreateUserApplication = {
  __typename?: 'CreateUserApplication'
  application?: Maybe<UserApplication>
}

export type CreateUserApplicationInput = {
  mobile?: Maybe<Scalars['StringTrimmed']>
}

export type GetCompanyApplicationsQueryQueryVariables = {}

export type GetCompanyApplicationsQueryQuery = { __typename?: 'Query' } & {
  companyApplications?: Maybe<
    Array<
      Maybe<
        { __typename?: 'CompanyApplication' } & Pick<
          CompanyApplication,
          | 'id'
          | 'name'
          | 'email'
          | 'state'
          | 'companySSN'
          | 'serviceCategory'
          | 'generalEmail'
          | 'companyDisplayName'
          | 'companyName'
          | 'exhibition'
          | 'operatingPermitForRestaurant'
          | 'operatingPermitForVehicles'
          | 'operationsTrouble'
          | 'phoneNumber'
          | 'validLicenses'
          | 'validPermit'
          | 'webpage'
        > & {
            logs?: Maybe<
              Array<
                Maybe<
                  { __typename?: 'ApplicationLog' } & Pick<
                    ApplicationLog,
                    'id' | 'state' | 'title' | 'data' | 'authorSSN'
                  >
                >
              >
            >
          }
      >
    >
  >
}

export type GetCompaniesQueryQueryVariables = {}

export type GetCompaniesQueryQuery = { __typename?: 'Query' } & {
  companies?: Maybe<
    Array<Maybe<{ __typename?: 'Company' } & Pick<Company, 'ssn' | 'name'>>>
  >
}

export type GetCompanyQueryQueryVariables = {
  ssn: Scalars['String']
}

export type GetCompanyQueryQuery = { __typename?: 'Query' } & {
  company?: Maybe<
    { __typename?: 'Company' } & Pick<Company, 'ssn' | 'name'> & {
        application?: Maybe<
          { __typename?: 'CompanyApplication' } & Pick<
            CompanyApplication,
            | 'id'
            | 'name'
            | 'email'
            | 'state'
            | 'companySSN'
            | 'serviceCategory'
            | 'generalEmail'
            | 'webpage'
            | 'phoneNumber'
            | 'companyName'
            | 'companyDisplayName'
          >
        >
      }
  >
}

export type CreateCompanyApplicationMutationMutationVariables = {
  input: CreateCompanyApplicationInput
}

export type CreateCompanyApplicationMutationMutation = {
  __typename?: 'Mutation'
} & {
  createCompanyApplication?: Maybe<
    { __typename?: 'CreateCompanyApplication' } & {
      application?: Maybe<
        { __typename?: 'CompanyApplication' } & Pick<
          CompanyApplication,
          'id' | 'state'
        >
      >
    }
  >
}

export const GetCompanyApplicationsQueryDocument = gql`
  query GetCompanyApplicationsQuery {
    companyApplications {
      id
      name
      email
      state
      companySSN
      serviceCategory
      generalEmail
      companyDisplayName
      companyName
      exhibition
      operatingPermitForRestaurant
      operatingPermitForVehicles
      operationsTrouble
      phoneNumber
      validLicenses
      validPermit
      webpage
      logs {
        id
        state
        title
        data
        authorSSN
      }
    }
  }
`

/**
 * __useGetCompanyApplicationsQueryQuery__
 *
 * To run a query within a React component, call `useGetCompanyApplicationsQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCompanyApplicationsQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCompanyApplicationsQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCompanyApplicationsQueryQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetCompanyApplicationsQueryQuery,
    GetCompanyApplicationsQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    GetCompanyApplicationsQueryQuery,
    GetCompanyApplicationsQueryQueryVariables
  >(GetCompanyApplicationsQueryDocument, baseOptions)
}
export function useGetCompanyApplicationsQueryLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetCompanyApplicationsQueryQuery,
    GetCompanyApplicationsQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    GetCompanyApplicationsQueryQuery,
    GetCompanyApplicationsQueryQueryVariables
  >(GetCompanyApplicationsQueryDocument, baseOptions)
}
export type GetCompanyApplicationsQueryQueryHookResult = ReturnType<
  typeof useGetCompanyApplicationsQueryQuery
>
export type GetCompanyApplicationsQueryLazyQueryHookResult = ReturnType<
  typeof useGetCompanyApplicationsQueryLazyQuery
>
export type GetCompanyApplicationsQueryQueryResult = ApolloReactCommon.QueryResult<
  GetCompanyApplicationsQueryQuery,
  GetCompanyApplicationsQueryQueryVariables
>
export const GetCompaniesQueryDocument = gql`
  query GetCompaniesQuery {
    companies {
      ssn
      name
    }
  }
`

/**
 * __useGetCompaniesQueryQuery__
 *
 * To run a query within a React component, call `useGetCompaniesQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCompaniesQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCompaniesQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCompaniesQueryQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetCompaniesQueryQuery,
    GetCompaniesQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    GetCompaniesQueryQuery,
    GetCompaniesQueryQueryVariables
  >(GetCompaniesQueryDocument, baseOptions)
}
export function useGetCompaniesQueryLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetCompaniesQueryQuery,
    GetCompaniesQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    GetCompaniesQueryQuery,
    GetCompaniesQueryQueryVariables
  >(GetCompaniesQueryDocument, baseOptions)
}
export type GetCompaniesQueryQueryHookResult = ReturnType<
  typeof useGetCompaniesQueryQuery
>
export type GetCompaniesQueryLazyQueryHookResult = ReturnType<
  typeof useGetCompaniesQueryLazyQuery
>
export type GetCompaniesQueryQueryResult = ApolloReactCommon.QueryResult<
  GetCompaniesQueryQuery,
  GetCompaniesQueryQueryVariables
>
export const GetCompanyQueryDocument = gql`
  query GetCompanyQuery($ssn: String!) {
    company(ssn: $ssn) {
      ssn
      name
      application {
        id
        name
        email
        state
        companySSN
        serviceCategory
        generalEmail
        webpage
        phoneNumber
        companyName
        companyDisplayName
      }
    }
  }
`

/**
 * __useGetCompanyQueryQuery__
 *
 * To run a query within a React component, call `useGetCompanyQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCompanyQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCompanyQueryQuery({
 *   variables: {
 *      ssn: // value for 'ssn'
 *   },
 * });
 */
export function useGetCompanyQueryQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetCompanyQueryQuery,
    GetCompanyQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    GetCompanyQueryQuery,
    GetCompanyQueryQueryVariables
  >(GetCompanyQueryDocument, baseOptions)
}
export function useGetCompanyQueryLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetCompanyQueryQuery,
    GetCompanyQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    GetCompanyQueryQuery,
    GetCompanyQueryQueryVariables
  >(GetCompanyQueryDocument, baseOptions)
}
export type GetCompanyQueryQueryHookResult = ReturnType<
  typeof useGetCompanyQueryQuery
>
export type GetCompanyQueryLazyQueryHookResult = ReturnType<
  typeof useGetCompanyQueryLazyQuery
>
export type GetCompanyQueryQueryResult = ApolloReactCommon.QueryResult<
  GetCompanyQueryQuery,
  GetCompanyQueryQueryVariables
>
export const CreateCompanyApplicationMutationDocument = gql`
  mutation CreateCompanyApplicationMutation(
    $input: CreateCompanyApplicationInput!
  ) {
    createCompanyApplication(input: $input) {
      application {
        id
        state
      }
    }
  }
`
export type CreateCompanyApplicationMutationMutationFn = ApolloReactCommon.MutationFunction<
  CreateCompanyApplicationMutationMutation,
  CreateCompanyApplicationMutationMutationVariables
>

/**
 * __useCreateCompanyApplicationMutationMutation__
 *
 * To run a mutation, you first call `useCreateCompanyApplicationMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCompanyApplicationMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCompanyApplicationMutationMutation, { data, loading, error }] = useCreateCompanyApplicationMutationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCompanyApplicationMutationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateCompanyApplicationMutationMutation,
    CreateCompanyApplicationMutationMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    CreateCompanyApplicationMutationMutation,
    CreateCompanyApplicationMutationMutationVariables
  >(CreateCompanyApplicationMutationDocument, baseOptions)
}
export type CreateCompanyApplicationMutationMutationHookResult = ReturnType<
  typeof useCreateCompanyApplicationMutationMutation
>
export type CreateCompanyApplicationMutationMutationResult = ApolloReactCommon.MutationResult<
  CreateCompanyApplicationMutationMutation
>
export type CreateCompanyApplicationMutationMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateCompanyApplicationMutationMutation,
  CreateCompanyApplicationMutationMutationVariables
>
