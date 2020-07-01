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
  role: Scalars['String']
}

export type Query = {
  __typename?: 'Query'
  companies?: Maybe<Array<Maybe<Company>>>
  company?: Maybe<Company>
  companyApplication?: Maybe<CompanyApplication>
  companyApplications?: Maybe<Array<Maybe<CompanyApplication>>>
  giftCardCode?: Maybe<GiftCardCode>
  giftCards?: Maybe<Array<Maybe<GiftCard>>>
  root?: Maybe<Scalars['String']>
  user?: Maybe<AuthUser>
  userApplication?: Maybe<UserApplication>
  userApplicationCount?: Maybe<Scalars['Int']>
}

export type QueryCompanyArgs = {
  ssn: Scalars['String']
}

export type QueryCompanyApplicationArgs = {
  id: Scalars['String']
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
  created?: Maybe<Scalars['String']>
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
  publicHelpAmount?: Maybe<Scalars['Int']>
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
  publicHelpAmount: Scalars['Int']
}

export type ApproveCompanyApplicationInput = {
  id: Scalars['String']
}

export type RejectCompanyApplicationInput = {
  id: Scalars['String']
}

export type UpdateCompanyApplicationInput = {
  id: Scalars['String']
  webpage?: Maybe<Scalars['String']>
  generalEmail?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
  phoneNumber?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
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

export type UpdateCompanyApplication = {
  __typename?: 'UpdateCompanyApplication'
  application?: Maybe<CompanyApplication>
}

export type Mutation = {
  __typename?: 'Mutation'
  approveCompanyApplication?: Maybe<ApproveCompanyApplication>
  confirmMobile?: Maybe<ConfirmMobile>
  createCompanyApplication?: Maybe<CreateCompanyApplication>
  createUserApplication?: Maybe<CreateUserApplication>
  fetchUserApplication?: Maybe<UserApplication>
  giveGift?: Maybe<GiveGift>
  rejectCompanyApplication?: Maybe<RejectCompanyApplication>
  root?: Maybe<Scalars['String']>
  updateCompanyApplication?: Maybe<UpdateCompanyApplication>
  verifyUserApplication?: Maybe<VerifyUserApplication>
}

export type MutationApproveCompanyApplicationArgs = {
  input: ApproveCompanyApplicationInput
}

export type MutationConfirmMobileArgs = {
  input: Maybe<ConfirmMobileInput>
}

export type MutationCreateCompanyApplicationArgs = {
  input: CreateCompanyApplicationInput
}

export type MutationCreateUserApplicationArgs = {
  input: Maybe<CreateUserApplicationInput>
}

export type MutationFetchUserApplicationArgs = {
  ssn: Scalars['String']
}

export type MutationGiveGiftArgs = {
  input: Maybe<GiveGiftInput>
}

export type MutationRejectCompanyApplicationArgs = {
  input: RejectCompanyApplicationInput
}

export type MutationUpdateCompanyApplicationArgs = {
  input: UpdateCompanyApplicationInput
}

export type MutationVerifyUserApplicationArgs = {
  input: Maybe<VerifyUserApplicationInput>
}

export type Greeting = {
  __typename?: 'Greeting'
  greetingType?: Maybe<Scalars['Int']>
  text?: Maybe<Scalars['String']>
  contentUrl?: Maybe<Scalars['String']>
}

export type GiftDetail = {
  __typename?: 'GiftDetail'
  packageId: Scalars['String']
  from?: Maybe<Scalars['String']>
  greeting?: Maybe<Greeting>
  personalMessage?: Maybe<Scalars['String']>
}

export type GiftCard = {
  __typename?: 'GiftCard'
  giftCardId: Scalars['Int']
  amount: Scalars['Float']
  applicationId?: Maybe<Scalars['String']>
  giftDetail?: Maybe<GiftDetail>
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
  verified: Scalars['Boolean']
  logs?: Maybe<Array<Maybe<ApplicationLog>>>
}

export type GiveGift = {
  __typename?: 'GiveGift'
  success: Scalars['Boolean']
}

export type CreateUserApplication = {
  __typename?: 'CreateUserApplication'
  application?: Maybe<UserApplication>
}

export type CreateUserApplicationInput = {
  mobile?: Maybe<Scalars['StringTrimmed']>
  confirmCode?: Maybe<Scalars['StringTrimmed']>
}

export type VerifyUserApplication = {
  __typename?: 'VerifyUserApplication'
  application?: Maybe<UserApplication>
}

export type VerifyUserApplicationInput = {
  mobile?: Maybe<Scalars['StringTrimmed']>
  confirmCode?: Maybe<Scalars['StringTrimmed']>
}

export type ConfirmMobile = {
  __typename?: 'ConfirmMobile'
  mobile: Scalars['String']
  success: Scalars['Boolean']
}

export type ConfirmMobileInput = {
  mobile?: Maybe<Scalars['StringTrimmed']>
}

export type GiveGiftInput = {
  giftCardId: Scalars['Int']
  recipientMobileNumber: Scalars['StringTrimmed']
  message?: Maybe<Scalars['String']>
}

export type UserQueryQueryVariables = {}

export type UserQueryQuery = { __typename?: 'Query' } & {
  user?: Maybe<
    { __typename?: 'AuthUser' } & Pick<
      AuthUser,
      'name' | 'ssn' | 'mobile' | 'role'
    >
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
          | 'publicHelpAmount'
        > & {
            logs?: Maybe<
              Array<
                Maybe<
                  { __typename?: 'ApplicationLog' } & Pick<
                    ApplicationLog,
                    'id' | 'created' | 'state' | 'title' | 'data' | 'authorSSN'
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

export type CompanyApplicationQueryQueryVariables = {
  id: Scalars['String']
}

export type CompanyApplicationQueryQuery = { __typename?: 'Query' } & {
  user?: Maybe<{ __typename?: 'AuthUser' } & Pick<AuthUser, 'role'>>
  companyApplication?: Maybe<
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
      | 'publicHelpAmount'
    > & {
        logs?: Maybe<
          Array<
            Maybe<
              { __typename?: 'ApplicationLog' } & Pick<
                ApplicationLog,
                'id' | 'created' | 'state' | 'title' | 'data' | 'authorSSN'
              >
            >
          >
        >
      }
  >
}

export type UpdateCompanyApplicationMutationMutationVariables = {
  input: UpdateCompanyApplicationInput
}

export type UpdateCompanyApplicationMutationMutation = {
  __typename?: 'Mutation'
} & {
  updateCompanyApplication?: Maybe<
    { __typename?: 'UpdateCompanyApplication' } & {
      application?: Maybe<
        { __typename?: 'CompanyApplication' } & Pick<
          CompanyApplication,
          'id' | 'webpage' | 'generalEmail' | 'email' | 'phoneNumber' | 'name'
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
                  { __typename?: 'ApplicationLog' } & Pick<
                    ApplicationLog,
                    'id' | 'data'
                  >
                >
              >
            >
          }
      >
    >
  >
}

export type UserApplicationCountQueryQueryVariables = {}

export type UserApplicationCountQueryQuery = { __typename?: 'Query' } & Pick<
  Query,
  'userApplicationCount'
>

export type FetchUserApplicationQueryMutationVariables = {
  ssn: Scalars['String']
}

export type FetchUserApplicationQueryMutation = { __typename?: 'Mutation' } & {
  fetchUserApplication?: Maybe<
    { __typename?: 'UserApplication' } & Pick<
      UserApplication,
      'id' | 'mobileNumber' | 'countryCode'
    > & {
        logs?: Maybe<
          Array<
            Maybe<
              { __typename?: 'ApplicationLog' } & Pick<
                ApplicationLog,
                'id' | 'created' | 'state' | 'title' | 'data' | 'authorSSN'
              >
            >
          >
        >
      }
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
            | 'publicHelpAmount'
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

export type VerifyUserApplicationMutationMutationVariables = {
  input: VerifyUserApplicationInput
}

export type VerifyUserApplicationMutationMutation = {
  __typename?: 'Mutation'
} & {
  verifyUserApplication?: Maybe<
    { __typename?: 'VerifyUserApplication' } & {
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
        { __typename?: 'GiftCard' } & Pick<
          GiftCard,
          'giftCardId' | 'amount'
        > & {
            giftDetail?: Maybe<
              { __typename?: 'GiftDetail' } & Pick<
                GiftDetail,
                'packageId' | 'from' | 'personalMessage'
              > & {
                  greeting?: Maybe<
                    { __typename?: 'Greeting' } & Pick<
                      Greeting,
                      'greetingType' | 'text' | 'contentUrl'
                    >
                  >
                }
            >
          }
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

export type GiveGiftMutationMutationVariables = {
  input: GiveGiftInput
}

export type GiveGiftMutationMutation = { __typename?: 'Mutation' } & {
  giveGift?: Maybe<{ __typename?: 'GiveGift' } & Pick<GiveGift, 'success'>>
}

export type ConfirmMobileMutationMutationVariables = {
  input: ConfirmMobileInput
}

export type ConfirmMobileMutationMutation = { __typename?: 'Mutation' } & {
  confirmMobile?: Maybe<
    { __typename?: 'ConfirmMobile' } & Pick<ConfirmMobile, 'success' | 'mobile'>
  >
}

export const UserQueryDocument = gql`
  query UserQuery {
    user {
      name
      ssn
      mobile
      role
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
      publicHelpAmount
      logs {
        id
        created
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
export const CompanyApplicationQueryDocument = gql`
  query CompanyApplicationQuery($id: String!) {
    user {
      role
    }
    companyApplication(id: $id) {
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
      publicHelpAmount
      logs {
        id
        created
        state
        title
        data
        authorSSN
      }
    }
  }
`

/**
 * __useCompanyApplicationQueryQuery__
 *
 * To run a query within a React component, call `useCompanyApplicationQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCompanyApplicationQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCompanyApplicationQueryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCompanyApplicationQueryQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    CompanyApplicationQueryQuery,
    CompanyApplicationQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    CompanyApplicationQueryQuery,
    CompanyApplicationQueryQueryVariables
  >(CompanyApplicationQueryDocument, baseOptions)
}
export function useCompanyApplicationQueryLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    CompanyApplicationQueryQuery,
    CompanyApplicationQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    CompanyApplicationQueryQuery,
    CompanyApplicationQueryQueryVariables
  >(CompanyApplicationQueryDocument, baseOptions)
}
export type CompanyApplicationQueryQueryHookResult = ReturnType<
  typeof useCompanyApplicationQueryQuery
>
export type CompanyApplicationQueryLazyQueryHookResult = ReturnType<
  typeof useCompanyApplicationQueryLazyQuery
>
export type CompanyApplicationQueryQueryResult = ApolloReactCommon.QueryResult<
  CompanyApplicationQueryQuery,
  CompanyApplicationQueryQueryVariables
>
export const UpdateCompanyApplicationMutationDocument = gql`
  mutation UpdateCompanyApplicationMutation(
    $input: UpdateCompanyApplicationInput!
  ) {
    updateCompanyApplication(input: $input) {
      application {
        id
        webpage
        generalEmail
        email
        phoneNumber
        name
      }
    }
  }
`
export type UpdateCompanyApplicationMutationMutationFn = ApolloReactCommon.MutationFunction<
  UpdateCompanyApplicationMutationMutation,
  UpdateCompanyApplicationMutationMutationVariables
>

/**
 * __useUpdateCompanyApplicationMutationMutation__
 *
 * To run a mutation, you first call `useUpdateCompanyApplicationMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCompanyApplicationMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCompanyApplicationMutationMutation, { data, loading, error }] = useUpdateCompanyApplicationMutationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCompanyApplicationMutationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateCompanyApplicationMutationMutation,
    UpdateCompanyApplicationMutationMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    UpdateCompanyApplicationMutationMutation,
    UpdateCompanyApplicationMutationMutationVariables
  >(UpdateCompanyApplicationMutationDocument, baseOptions)
}
export type UpdateCompanyApplicationMutationMutationHookResult = ReturnType<
  typeof useUpdateCompanyApplicationMutationMutation
>
export type UpdateCompanyApplicationMutationMutationResult = ApolloReactCommon.MutationResult<
  UpdateCompanyApplicationMutationMutation
>
export type UpdateCompanyApplicationMutationMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateCompanyApplicationMutationMutation,
  UpdateCompanyApplicationMutationMutationVariables
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
        data
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
export const UserApplicationCountQueryDocument = gql`
  query UserApplicationCountQuery {
    userApplicationCount
  }
`

/**
 * __useUserApplicationCountQueryQuery__
 *
 * To run a query within a React component, call `useUserApplicationCountQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserApplicationCountQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserApplicationCountQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserApplicationCountQueryQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    UserApplicationCountQueryQuery,
    UserApplicationCountQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    UserApplicationCountQueryQuery,
    UserApplicationCountQueryQueryVariables
  >(UserApplicationCountQueryDocument, baseOptions)
}
export function useUserApplicationCountQueryLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    UserApplicationCountQueryQuery,
    UserApplicationCountQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    UserApplicationCountQueryQuery,
    UserApplicationCountQueryQueryVariables
  >(UserApplicationCountQueryDocument, baseOptions)
}
export type UserApplicationCountQueryQueryHookResult = ReturnType<
  typeof useUserApplicationCountQueryQuery
>
export type UserApplicationCountQueryLazyQueryHookResult = ReturnType<
  typeof useUserApplicationCountQueryLazyQuery
>
export type UserApplicationCountQueryQueryResult = ApolloReactCommon.QueryResult<
  UserApplicationCountQueryQuery,
  UserApplicationCountQueryQueryVariables
>
export const FetchUserApplicationQueryDocument = gql`
  mutation FetchUserApplicationQuery($ssn: String!) {
    fetchUserApplication(ssn: $ssn) {
      id
      mobileNumber
      countryCode
      logs {
        id
        created
        state
        title
        data
        authorSSN
      }
    }
  }
`
export type FetchUserApplicationQueryMutationFn = ApolloReactCommon.MutationFunction<
  FetchUserApplicationQueryMutation,
  FetchUserApplicationQueryMutationVariables
>

/**
 * __useFetchUserApplicationQueryMutation__
 *
 * To run a mutation, you first call `useFetchUserApplicationQueryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFetchUserApplicationQueryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [fetchUserApplicationQueryMutation, { data, loading, error }] = useFetchUserApplicationQueryMutation({
 *   variables: {
 *      ssn: // value for 'ssn'
 *   },
 * });
 */
export function useFetchUserApplicationQueryMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    FetchUserApplicationQueryMutation,
    FetchUserApplicationQueryMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    FetchUserApplicationQueryMutation,
    FetchUserApplicationQueryMutationVariables
  >(FetchUserApplicationQueryDocument, baseOptions)
}
export type FetchUserApplicationQueryMutationHookResult = ReturnType<
  typeof useFetchUserApplicationQueryMutation
>
export type FetchUserApplicationQueryMutationResult = ApolloReactCommon.MutationResult<
  FetchUserApplicationQueryMutation
>
export type FetchUserApplicationQueryMutationOptions = ApolloReactCommon.BaseMutationOptions<
  FetchUserApplicationQueryMutation,
  FetchUserApplicationQueryMutationVariables
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
        publicHelpAmount
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
export const VerifyUserApplicationMutationDocument = gql`
  mutation VerifyUserApplicationMutation($input: VerifyUserApplicationInput!) {
    verifyUserApplication(input: $input) {
      application {
        id
      }
    }
  }
`
export type VerifyUserApplicationMutationMutationFn = ApolloReactCommon.MutationFunction<
  VerifyUserApplicationMutationMutation,
  VerifyUserApplicationMutationMutationVariables
>

/**
 * __useVerifyUserApplicationMutationMutation__
 *
 * To run a mutation, you first call `useVerifyUserApplicationMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyUserApplicationMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyUserApplicationMutationMutation, { data, loading, error }] = useVerifyUserApplicationMutationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useVerifyUserApplicationMutationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    VerifyUserApplicationMutationMutation,
    VerifyUserApplicationMutationMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    VerifyUserApplicationMutationMutation,
    VerifyUserApplicationMutationMutationVariables
  >(VerifyUserApplicationMutationDocument, baseOptions)
}
export type VerifyUserApplicationMutationMutationHookResult = ReturnType<
  typeof useVerifyUserApplicationMutationMutation
>
export type VerifyUserApplicationMutationMutationResult = ApolloReactCommon.MutationResult<
  VerifyUserApplicationMutationMutation
>
export type VerifyUserApplicationMutationMutationOptions = ApolloReactCommon.BaseMutationOptions<
  VerifyUserApplicationMutationMutation,
  VerifyUserApplicationMutationMutationVariables
>
export const GiftCardsQueryDocument = gql`
  query GiftCardsQuery {
    giftCards {
      giftCardId
      amount
      giftDetail {
        packageId
        from
        personalMessage
        greeting {
          greetingType
          text
          contentUrl
        }
      }
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
export const GiveGiftMutationDocument = gql`
  mutation GiveGiftMutation($input: GiveGiftInput!) {
    giveGift(input: $input) {
      success
    }
  }
`
export type GiveGiftMutationMutationFn = ApolloReactCommon.MutationFunction<
  GiveGiftMutationMutation,
  GiveGiftMutationMutationVariables
>

/**
 * __useGiveGiftMutationMutation__
 *
 * To run a mutation, you first call `useGiveGiftMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGiveGiftMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [giveGiftMutationMutation, { data, loading, error }] = useGiveGiftMutationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGiveGiftMutationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    GiveGiftMutationMutation,
    GiveGiftMutationMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    GiveGiftMutationMutation,
    GiveGiftMutationMutationVariables
  >(GiveGiftMutationDocument, baseOptions)
}
export type GiveGiftMutationMutationHookResult = ReturnType<
  typeof useGiveGiftMutationMutation
>
export type GiveGiftMutationMutationResult = ApolloReactCommon.MutationResult<
  GiveGiftMutationMutation
>
export type GiveGiftMutationMutationOptions = ApolloReactCommon.BaseMutationOptions<
  GiveGiftMutationMutation,
  GiveGiftMutationMutationVariables
>
export const ConfirmMobileMutationDocument = gql`
  mutation ConfirmMobileMutation($input: ConfirmMobileInput!) {
    confirmMobile(input: $input) {
      success
      mobile
    }
  }
`
export type ConfirmMobileMutationMutationFn = ApolloReactCommon.MutationFunction<
  ConfirmMobileMutationMutation,
  ConfirmMobileMutationMutationVariables
>

/**
 * __useConfirmMobileMutationMutation__
 *
 * To run a mutation, you first call `useConfirmMobileMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmMobileMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmMobileMutationMutation, { data, loading, error }] = useConfirmMobileMutationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useConfirmMobileMutationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ConfirmMobileMutationMutation,
    ConfirmMobileMutationMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    ConfirmMobileMutationMutation,
    ConfirmMobileMutationMutationVariables
  >(ConfirmMobileMutationDocument, baseOptions)
}
export type ConfirmMobileMutationMutationHookResult = ReturnType<
  typeof useConfirmMobileMutationMutation
>
export type ConfirmMobileMutationMutationResult = ApolloReactCommon.MutationResult<
  ConfirmMobileMutationMutation
>
export type ConfirmMobileMutationMutationOptions = ApolloReactCommon.BaseMutationOptions<
  ConfirmMobileMutationMutation,
  ConfirmMobileMutationMutationVariables
>
