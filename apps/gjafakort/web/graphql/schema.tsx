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

export type AuthUser = {
  __typename?: 'AuthUser'
  ssn: Scalars['String']
  name: Scalars['String']
  mobile?: Maybe<Scalars['String']>
}

export type Query = {
  __typename?: 'Query'
  companies?: Maybe<Array<Maybe<Company>>>
  company?: Maybe<Company>
  companyApplications?: Maybe<Array<Maybe<CompanyApplication>>>
  giftCardCode?: Maybe<GiftCardCode>
  giftCards?: Maybe<Array<Maybe<GiftCard>>>
  root?: Maybe<Scalars['String']>
  user?: Maybe<AuthUser>
  userApplication?: Maybe<UserApplication>
}

export type QueryCompanyArgs = {
  ssn: Scalars['String']
}

export type QueryGiftCardCodeArgs = {
  giftCardId: Scalars['Int']
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
  name?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
  state: Scalars['String']
  companySSN: Scalars['String']
  serviceCategory?: Maybe<Scalars['String']>
  generalEmail?: Maybe<Scalars['String']>
  companyDisplayName?: Maybe<Scalars['String']>
  companyName?: Maybe<Scalars['String']>
  exhibition?: Maybe<Scalars['Boolean']>
  operatingPermitForRestaurant?: Maybe<Scalars['Boolean']>
  operatingPermitForVehicles?: Maybe<Scalars['Boolean']>
  operationsTrouble?: Maybe<Scalars['Boolean']>
  phoneNumber?: Maybe<Scalars['String']>
  validLicenses?: Maybe<Scalars['Boolean']>
  validPermit?: Maybe<Scalars['Boolean']>
  webpage?: Maybe<Scalars['String']>
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

export type ApproveCompanyApplicationInput = {
  id: Scalars['String']
}

export type RejectCompanyApplicationInput = {
  id: Scalars['String']
}

export type CreateCompanyApplication = {
  __typename?: 'CreateCompanyApplication'
  application?: Maybe<CompanyApplication>
}

export type ApproveCompanyApplication = {
  __typename?: 'ApproveCompanyApplication'
  application?: Maybe<CompanyApplication>
}

export type RejectCompanyApplication = {
  __typename?: 'RejectCompanyApplication'
  application?: Maybe<CompanyApplication>
}

export type Mutation = {
  __typename?: 'Mutation'
  approveCompanyApplication?: Maybe<ApproveCompanyApplication>
  createCompanyApplication?: Maybe<CreateCompanyApplication>
  createUserApplication?: Maybe<CreateUserApplication>
  rejectCompanyApplication?: Maybe<RejectCompanyApplication>
  root?: Maybe<Scalars['String']>
}

export type MutationApproveCompanyApplicationArgs = {
  input: ApproveCompanyApplicationInput
}

export type MutationCreateCompanyApplicationArgs = {
  input: CreateCompanyApplicationInput
}

export type MutationCreateUserApplicationArgs = {
  input: Maybe<CreateUserApplicationInput>
}

export type MutationRejectCompanyApplicationArgs = {
  input: RejectCompanyApplicationInput
}

export type GiftCard = {
  __typename?: 'GiftCard'
  giftCardId: Scalars['Int']
  amount: Scalars['Int']
  applicationId?: Maybe<Scalars['String']>
}

export type GiftCardCode = {
  __typename?: 'GiftCardCode'
  code: Scalars['String']
  expiryDate: Scalars['String']
  pollingUrl: Scalars['String']
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

export type UserQueryQueryVariables = {}

export type UserQueryQuery = { __typename?: 'Query' } & {
  user?: Maybe<
    { __typename?: 'AuthUser' } & Pick<AuthUser, 'name' | 'ssn' | 'mobile'>
  >
}

export type CompanyApplicationsQueryQueryVariables = {}

export type CompanyApplicationsQueryQuery = { __typename?: 'Query' } & {
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

export type ApproveCompanyApplicationMutationVariables = {
  input: ApproveCompanyApplicationInput
}

export type ApproveCompanyApplicationMutation = { __typename?: 'Mutation' } & {
  approveCompanyApplication?: Maybe<
    { __typename?: 'ApproveCompanyApplication' } & {
      application?: Maybe<
        { __typename?: 'CompanyApplication' } & Pick<
          CompanyApplication,
          'id' | 'state'
        >
      >
    }
  >
}

export type RejectCompanyApplicationMutationVariables = {
  input: RejectCompanyApplicationInput
}

export type RejectCompanyApplicationMutation = { __typename?: 'Mutation' } & {
  rejectCompanyApplication?: Maybe<
    { __typename?: 'RejectCompanyApplication' } & {
      application?: Maybe<
        { __typename?: 'CompanyApplication' } & Pick<
          CompanyApplication,
          'id' | 'state'
        >
      >
    }
  >
}

export type CompanyApplicationsQueryMinimalQueryVariables = {}

export type CompanyApplicationsQueryMinimalQuery = { __typename?: 'Query' } & {
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
          | 'generalEmail'
          | 'companyDisplayName'
          | 'companyName'
        > & {
            logs?: Maybe<
              Array<
                Maybe<
                  { __typename?: 'ApplicationLog' } & Pick<ApplicationLog, 'id'>
                >
              >
            >
          }
      >
    >
  >
}

export type CompaniesQueryQueryVariables = {}

export type CompaniesQueryQuery = { __typename?: 'Query' } & {
  companies?: Maybe<
    Array<Maybe<{ __typename?: 'Company' } & Pick<Company, 'ssn' | 'name'>>>
  >
}

export type CompanyQueryQueryVariables = {
  ssn: Scalars['String']
}

export type CompanyQueryQuery = { __typename?: 'Query' } & {
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

export type UserApplicationQueryQueryVariables = {}

export type UserApplicationQueryQuery = { __typename?: 'Query' } & {
  userApplication?: Maybe<
    { __typename?: 'UserApplication' } & Pick<UserApplication, 'id'>
  >
}

export type CreateUserApplicationMutationMutationVariables = {
  input: CreateUserApplicationInput
}

export type CreateUserApplicationMutationMutation = {
  __typename?: 'Mutation'
} & {
  createUserApplication?: Maybe<
    { __typename?: 'CreateUserApplication' } & {
      application?: Maybe<
        { __typename?: 'UserApplication' } & Pick<UserApplication, 'id'>
      >
    }
  >
}

export type GiftCardsQueryQueryVariables = {}

export type GiftCardsQueryQuery = { __typename?: 'Query' } & {
  giftCards?: Maybe<
    Array<
      Maybe<
        { __typename?: 'GiftCard' } & Pick<GiftCard, 'giftCardId' | 'amount'>
      >
    >
  >
}

export type GiftCardCodeQueryQueryVariables = {
  giftCardId: Scalars['Int']
}

export type GiftCardCodeQueryQuery = { __typename?: 'Query' } & {
  giftCardCode?: Maybe<
    { __typename?: 'GiftCardCode' } & Pick<
      GiftCardCode,
      'code' | 'expiryDate' | 'pollingUrl'
    >
  >
}

export const UserQueryDocument = gql`
  query UserQuery {
    user {
      name
      ssn
      mobile
    }
  }
`

/**
 * __useUserQueryQuery__
 *
 * To run a query within a React component, call `useUserQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserQueryQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    UserQueryQuery,
    UserQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<UserQueryQuery, UserQueryQueryVariables>(
    UserQueryDocument,
    baseOptions,
  )
}
export function useUserQueryLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    UserQueryQuery,
    UserQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<UserQueryQuery, UserQueryQueryVariables>(
    UserQueryDocument,
    baseOptions,
  )
}
export type UserQueryQueryHookResult = ReturnType<typeof useUserQueryQuery>
export type UserQueryLazyQueryHookResult = ReturnType<
  typeof useUserQueryLazyQuery
>
export type UserQueryQueryResult = ApolloReactCommon.QueryResult<
  UserQueryQuery,
  UserQueryQueryVariables
>
export const CompanyApplicationsQueryDocument = gql`
  query CompanyApplicationsQuery {
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
 * __useCompanyApplicationsQueryQuery__
 *
 * To run a query within a React component, call `useCompanyApplicationsQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCompanyApplicationsQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCompanyApplicationsQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useCompanyApplicationsQueryQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    CompanyApplicationsQueryQuery,
    CompanyApplicationsQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    CompanyApplicationsQueryQuery,
    CompanyApplicationsQueryQueryVariables
  >(CompanyApplicationsQueryDocument, baseOptions)
}
export function useCompanyApplicationsQueryLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    CompanyApplicationsQueryQuery,
    CompanyApplicationsQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    CompanyApplicationsQueryQuery,
    CompanyApplicationsQueryQueryVariables
  >(CompanyApplicationsQueryDocument, baseOptions)
}
export type CompanyApplicationsQueryQueryHookResult = ReturnType<
  typeof useCompanyApplicationsQueryQuery
>
export type CompanyApplicationsQueryLazyQueryHookResult = ReturnType<
  typeof useCompanyApplicationsQueryLazyQuery
>
export type CompanyApplicationsQueryQueryResult = ApolloReactCommon.QueryResult<
  CompanyApplicationsQueryQuery,
  CompanyApplicationsQueryQueryVariables
>
export const ApproveCompanyApplicationDocument = gql`
  mutation ApproveCompanyApplication($input: ApproveCompanyApplicationInput!) {
    approveCompanyApplication(input: $input) {
      application {
        id
        state
      }
    }
  }
`
export type ApproveCompanyApplicationMutationFn = ApolloReactCommon.MutationFunction<
  ApproveCompanyApplicationMutation,
  ApproveCompanyApplicationMutationVariables
>

/**
 * __useApproveCompanyApplicationMutation__
 *
 * To run a mutation, you first call `useApproveCompanyApplicationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useApproveCompanyApplicationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [approveCompanyApplicationMutation, { data, loading, error }] = useApproveCompanyApplicationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useApproveCompanyApplicationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ApproveCompanyApplicationMutation,
    ApproveCompanyApplicationMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    ApproveCompanyApplicationMutation,
    ApproveCompanyApplicationMutationVariables
  >(ApproveCompanyApplicationDocument, baseOptions)
}
export type ApproveCompanyApplicationMutationHookResult = ReturnType<
  typeof useApproveCompanyApplicationMutation
>
export type ApproveCompanyApplicationMutationResult = ApolloReactCommon.MutationResult<
  ApproveCompanyApplicationMutation
>
export type ApproveCompanyApplicationMutationOptions = ApolloReactCommon.BaseMutationOptions<
  ApproveCompanyApplicationMutation,
  ApproveCompanyApplicationMutationVariables
>
export const RejectCompanyApplicationDocument = gql`
  mutation RejectCompanyApplication($input: RejectCompanyApplicationInput!) {
    rejectCompanyApplication(input: $input) {
      application {
        id
        state
      }
    }
  }
`
export type RejectCompanyApplicationMutationFn = ApolloReactCommon.MutationFunction<
  RejectCompanyApplicationMutation,
  RejectCompanyApplicationMutationVariables
>

/**
 * __useRejectCompanyApplicationMutation__
 *
 * To run a mutation, you first call `useRejectCompanyApplicationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRejectCompanyApplicationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rejectCompanyApplicationMutation, { data, loading, error }] = useRejectCompanyApplicationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRejectCompanyApplicationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RejectCompanyApplicationMutation,
    RejectCompanyApplicationMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    RejectCompanyApplicationMutation,
    RejectCompanyApplicationMutationVariables
  >(RejectCompanyApplicationDocument, baseOptions)
}
export type RejectCompanyApplicationMutationHookResult = ReturnType<
  typeof useRejectCompanyApplicationMutation
>
export type RejectCompanyApplicationMutationResult = ApolloReactCommon.MutationResult<
  RejectCompanyApplicationMutation
>
export type RejectCompanyApplicationMutationOptions = ApolloReactCommon.BaseMutationOptions<
  RejectCompanyApplicationMutation,
  RejectCompanyApplicationMutationVariables
>
export const CompanyApplicationsQueryMinimalDocument = gql`
  query CompanyApplicationsQueryMinimal {
    companyApplications {
      id
      name
      email
      state
      companySSN
      generalEmail
      companyDisplayName
      companyName
      logs {
        id
      }
    }
  }
`

/**
 * __useCompanyApplicationsQueryMinimalQuery__
 *
 * To run a query within a React component, call `useCompanyApplicationsQueryMinimalQuery` and pass it any options that fit your needs.
 * When your component renders, `useCompanyApplicationsQueryMinimalQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCompanyApplicationsQueryMinimalQuery({
 *   variables: {
 *   },
 * });
 */
export function useCompanyApplicationsQueryMinimalQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    CompanyApplicationsQueryMinimalQuery,
    CompanyApplicationsQueryMinimalQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    CompanyApplicationsQueryMinimalQuery,
    CompanyApplicationsQueryMinimalQueryVariables
  >(CompanyApplicationsQueryMinimalDocument, baseOptions)
}
export function useCompanyApplicationsQueryMinimalLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    CompanyApplicationsQueryMinimalQuery,
    CompanyApplicationsQueryMinimalQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    CompanyApplicationsQueryMinimalQuery,
    CompanyApplicationsQueryMinimalQueryVariables
  >(CompanyApplicationsQueryMinimalDocument, baseOptions)
}
export type CompanyApplicationsQueryMinimalQueryHookResult = ReturnType<
  typeof useCompanyApplicationsQueryMinimalQuery
>
export type CompanyApplicationsQueryMinimalLazyQueryHookResult = ReturnType<
  typeof useCompanyApplicationsQueryMinimalLazyQuery
>
export type CompanyApplicationsQueryMinimalQueryResult = ApolloReactCommon.QueryResult<
  CompanyApplicationsQueryMinimalQuery,
  CompanyApplicationsQueryMinimalQueryVariables
>
export const CompaniesQueryDocument = gql`
  query CompaniesQuery {
    companies {
      ssn
      name
    }
  }
`

/**
 * __useCompaniesQueryQuery__
 *
 * To run a query within a React component, call `useCompaniesQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCompaniesQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCompaniesQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useCompaniesQueryQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    CompaniesQueryQuery,
    CompaniesQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    CompaniesQueryQuery,
    CompaniesQueryQueryVariables
  >(CompaniesQueryDocument, baseOptions)
}
export function useCompaniesQueryLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    CompaniesQueryQuery,
    CompaniesQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    CompaniesQueryQuery,
    CompaniesQueryQueryVariables
  >(CompaniesQueryDocument, baseOptions)
}
export type CompaniesQueryQueryHookResult = ReturnType<
  typeof useCompaniesQueryQuery
>
export type CompaniesQueryLazyQueryHookResult = ReturnType<
  typeof useCompaniesQueryLazyQuery
>
export type CompaniesQueryQueryResult = ApolloReactCommon.QueryResult<
  CompaniesQueryQuery,
  CompaniesQueryQueryVariables
>
export const CompanyQueryDocument = gql`
  query CompanyQuery($ssn: String!) {
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
 * __useCompanyQueryQuery__
 *
 * To run a query within a React component, call `useCompanyQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCompanyQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCompanyQueryQuery({
 *   variables: {
 *      ssn: // value for 'ssn'
 *   },
 * });
 */
export function useCompanyQueryQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    CompanyQueryQuery,
    CompanyQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    CompanyQueryQuery,
    CompanyQueryQueryVariables
  >(CompanyQueryDocument, baseOptions)
}
export function useCompanyQueryLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    CompanyQueryQuery,
    CompanyQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    CompanyQueryQuery,
    CompanyQueryQueryVariables
  >(CompanyQueryDocument, baseOptions)
}
export type CompanyQueryQueryHookResult = ReturnType<
  typeof useCompanyQueryQuery
>
export type CompanyQueryLazyQueryHookResult = ReturnType<
  typeof useCompanyQueryLazyQuery
>
export type CompanyQueryQueryResult = ApolloReactCommon.QueryResult<
  CompanyQueryQuery,
  CompanyQueryQueryVariables
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
export const UserApplicationQueryDocument = gql`
  query UserApplicationQuery {
    userApplication {
      id
    }
  }
`

/**
 * __useUserApplicationQueryQuery__
 *
 * To run a query within a React component, call `useUserApplicationQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserApplicationQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserApplicationQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserApplicationQueryQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    UserApplicationQueryQuery,
    UserApplicationQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    UserApplicationQueryQuery,
    UserApplicationQueryQueryVariables
  >(UserApplicationQueryDocument, baseOptions)
}
export function useUserApplicationQueryLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    UserApplicationQueryQuery,
    UserApplicationQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    UserApplicationQueryQuery,
    UserApplicationQueryQueryVariables
  >(UserApplicationQueryDocument, baseOptions)
}
export type UserApplicationQueryQueryHookResult = ReturnType<
  typeof useUserApplicationQueryQuery
>
export type UserApplicationQueryLazyQueryHookResult = ReturnType<
  typeof useUserApplicationQueryLazyQuery
>
export type UserApplicationQueryQueryResult = ApolloReactCommon.QueryResult<
  UserApplicationQueryQuery,
  UserApplicationQueryQueryVariables
>
export const CreateUserApplicationMutationDocument = gql`
  mutation CreateUserApplicationMutation($input: CreateUserApplicationInput!) {
    createUserApplication(input: $input) {
      application {
        id
      }
    }
  }
`
export type CreateUserApplicationMutationMutationFn = ApolloReactCommon.MutationFunction<
  CreateUserApplicationMutationMutation,
  CreateUserApplicationMutationMutationVariables
>

/**
 * __useCreateUserApplicationMutationMutation__
 *
 * To run a mutation, you first call `useCreateUserApplicationMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserApplicationMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserApplicationMutationMutation, { data, loading, error }] = useCreateUserApplicationMutationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserApplicationMutationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateUserApplicationMutationMutation,
    CreateUserApplicationMutationMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    CreateUserApplicationMutationMutation,
    CreateUserApplicationMutationMutationVariables
  >(CreateUserApplicationMutationDocument, baseOptions)
}
export type CreateUserApplicationMutationMutationHookResult = ReturnType<
  typeof useCreateUserApplicationMutationMutation
>
export type CreateUserApplicationMutationMutationResult = ApolloReactCommon.MutationResult<
  CreateUserApplicationMutationMutation
>
export type CreateUserApplicationMutationMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateUserApplicationMutationMutation,
  CreateUserApplicationMutationMutationVariables
>
export const GiftCardsQueryDocument = gql`
  query GiftCardsQuery {
    giftCards {
      giftCardId
      amount
    }
  }
`

/**
 * __useGiftCardsQueryQuery__
 *
 * To run a query within a React component, call `useGiftCardsQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGiftCardsQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGiftCardsQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useGiftCardsQueryQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GiftCardsQueryQuery,
    GiftCardsQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    GiftCardsQueryQuery,
    GiftCardsQueryQueryVariables
  >(GiftCardsQueryDocument, baseOptions)
}
export function useGiftCardsQueryLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GiftCardsQueryQuery,
    GiftCardsQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    GiftCardsQueryQuery,
    GiftCardsQueryQueryVariables
  >(GiftCardsQueryDocument, baseOptions)
}
export type GiftCardsQueryQueryHookResult = ReturnType<
  typeof useGiftCardsQueryQuery
>
export type GiftCardsQueryLazyQueryHookResult = ReturnType<
  typeof useGiftCardsQueryLazyQuery
>
export type GiftCardsQueryQueryResult = ApolloReactCommon.QueryResult<
  GiftCardsQueryQuery,
  GiftCardsQueryQueryVariables
>
export const GiftCardCodeQueryDocument = gql`
  query GiftCardCodeQuery($giftCardId: Int!) {
    giftCardCode(giftCardId: $giftCardId) {
      code
      expiryDate
      pollingUrl
    }
  }
`

/**
 * __useGiftCardCodeQueryQuery__
 *
 * To run a query within a React component, call `useGiftCardCodeQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGiftCardCodeQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGiftCardCodeQueryQuery({
 *   variables: {
 *      giftCardId: // value for 'giftCardId'
 *   },
 * });
 */
export function useGiftCardCodeQueryQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GiftCardCodeQueryQuery,
    GiftCardCodeQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    GiftCardCodeQueryQuery,
    GiftCardCodeQueryQueryVariables
  >(GiftCardCodeQueryDocument, baseOptions)
}
export function useGiftCardCodeQueryLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GiftCardCodeQueryQuery,
    GiftCardCodeQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    GiftCardCodeQueryQuery,
    GiftCardCodeQueryQueryVariables
  >(GiftCardCodeQueryDocument, baseOptions)
}
export type GiftCardCodeQueryQueryHookResult = ReturnType<
  typeof useGiftCardCodeQueryQuery
>
export type GiftCardCodeQueryLazyQueryHookResult = ReturnType<
  typeof useGiftCardCodeQueryLazyQuery
>
export type GiftCardCodeQueryQueryResult = ApolloReactCommon.QueryResult<
  GiftCardCodeQueryQuery,
  GiftCardCodeQueryQueryVariables
>
