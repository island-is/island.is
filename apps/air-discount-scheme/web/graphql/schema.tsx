import gql from 'graphql-tag'
import * as ApolloReactCommon from '@apollo/react-common'
import * as ApolloReactHooks from '@apollo/react-hooks'
export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any
}

export type Taxonomy = {
  __typename?: 'Taxonomy'
  title?: Maybe<Scalars['String']>
  slug?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
}

export type Article = {
  __typename?: 'Article'
  id: Scalars['String']
  slug: Scalars['String']
  title: Scalars['String']
  content?: Maybe<Scalars['String']>
  group?: Maybe<Taxonomy>
  category?: Maybe<Taxonomy>
  relatedArticles: Array<Article>
}

export type AdgerdirTag = {
  __typename?: 'AdgerdirTag'
  id?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
}

export type AdgerdirPage = {
  __typename?: 'AdgerdirPage'
  id: Scalars['String']
  title: Scalars['String']
  description: Scalars['String']
  longDescription?: Maybe<Scalars['String']>
  content?: Maybe<Scalars['String']>
  objective?: Maybe<Scalars['String']>
  slug: Scalars['String']
  tags: Array<AdgerdirTag>
  link?: Maybe<Scalars['String']>
  linkButtonText?: Maybe<Scalars['String']>
  status: Scalars['String']
  estimatedCostIsk?: Maybe<Scalars['Float']>
  finalCostIsk?: Maybe<Scalars['Float']>
}

export type Image = {
  __typename?: 'Image'
  url: Scalars['String']
  title: Scalars['String']
  contentType: Scalars['String']
  width: Scalars['Int']
  height: Scalars['Int']
}

export type AdgerdirNews = {
  __typename?: 'AdgerdirNews'
  id: Scalars['String']
  slug: Scalars['String']
  subtitle: Scalars['String']
  title: Scalars['String']
  intro: Scalars['String']
  image?: Maybe<Image>
  date: Scalars['String']
  content?: Maybe<Scalars['String']>
  pages?: Maybe<Array<AdgerdirPage>>
}

export type AdgerdirPages = {
  __typename?: 'AdgerdirPages'
  items: Array<AdgerdirPage>
}

export type AdgerdirFrontpage = {
  __typename?: 'AdgerdirFrontpage'
  id: Scalars['String']
  title: Scalars['String']
  description: Scalars['String']
  content?: Maybe<Scalars['String']>
  slices: Array<AdgerdirSlice>
}

export type AdgerdirSlice = AdgerdirGroupSlice | AdgerdirFeaturedNewsSlice

export type AdgerdirGroupSlice = {
  __typename?: 'AdgerdirGroupSlice'
  id: Scalars['ID']
  subtitle?: Maybe<Scalars['String']>
  title: Scalars['String']
  description?: Maybe<Scalars['String']>
  image?: Maybe<Image>
  pages: Array<AdgerdirPage>
}

export type AdgerdirFeaturedNewsSlice = {
  __typename?: 'AdgerdirFeaturedNewsSlice'
  id: Scalars['ID']
  title: Scalars['String']
  featured: Array<AdgerdirNews>
}

export type FrontpageSlide = {
  __typename?: 'FrontpageSlide'
  subtitle?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
  content?: Maybe<Scalars['String']>
  image?: Maybe<Image>
  link?: Maybe<Scalars['String']>
}

export type FrontpageSliderList = {
  __typename?: 'FrontpageSliderList'
  items: Array<FrontpageSlide>
}

export type News = {
  __typename?: 'News'
  id: Scalars['String']
  slug: Scalars['String']
  title: Scalars['String']
  subtitle: Scalars['String']
  intro: Scalars['String']
  image?: Maybe<Image>
  date: Scalars['String']
  content?: Maybe<Scalars['String']>
}

export type Pagination = {
  __typename?: 'Pagination'
  page: Scalars['Int']
  perPage: Scalars['Int']
  totalResults: Scalars['Int']
  totalPages: Scalars['Int']
}

export type PaginatedNews = {
  __typename?: 'PaginatedNews'
  page: Pagination
  news: Array<News>
}

export type Namespace = {
  __typename?: 'Namespace'
  namespace?: Maybe<Scalars['String']>
  fields?: Maybe<Scalars['String']>
}

export type Link = {
  __typename?: 'Link'
  text: Scalars['String']
  url: Scalars['String']
}

export type TimelineEvent = {
  __typename?: 'TimelineEvent'
  id: Scalars['ID']
  title: Scalars['String']
  date: Scalars['String']
  numerator?: Maybe<Scalars['Int']>
  denominator?: Maybe<Scalars['Int']>
  label: Scalars['String']
  body?: Maybe<Scalars['String']>
  tags: Array<Scalars['String']>
  link: Scalars['String']
}

export type Story = {
  __typename?: 'Story'
  label: Scalars['String']
  title: Scalars['String']
  logo: Image
  readMoreText: Scalars['String']
  date: Scalars['String']
  intro: Scalars['String']
  body?: Maybe<Scalars['String']>
}

export type LinkCard = {
  __typename?: 'LinkCard'
  title: Scalars['String']
  body: Scalars['String']
  link: Scalars['String']
  linkText: Scalars['String']
}

export type NumberBullet = {
  __typename?: 'NumberBullet'
  id: Scalars['ID']
  title: Scalars['String']
  body: Scalars['String']
}

export type AboutPage = {
  __typename?: 'AboutPage'
  title: Scalars['String']
  seoDescription: Scalars['String']
  theme: Scalars['String']
  slices: Array<Slice>
}

export type Slice =
  | PageHeaderSlice
  | TimelineSlice
  | HeadingSlice
  | StorySlice
  | LinkCardSlice
  | LatestNewsSlice
  | MailingListSignupSlice
  | LogoListSlice
  | BulletListSlice

export type PageHeaderSlice = {
  __typename?: 'PageHeaderSlice'
  id: Scalars['ID']
  title: Scalars['String']
  introduction: Scalars['String']
  navigationText: Scalars['String']
  links: Array<Link>
  slices: Array<Slice>
}

export type TimelineSlice = {
  __typename?: 'TimelineSlice'
  id: Scalars['ID']
  title: Scalars['String']
  events: Array<TimelineEvent>
}

export type HeadingSlice = {
  __typename?: 'HeadingSlice'
  id: Scalars['ID']
  title: Scalars['String']
  body: Scalars['String']
}

export type StorySlice = {
  __typename?: 'StorySlice'
  id: Scalars['ID']
  readMoreText: Scalars['String']
  stories: Array<Story>
}

export type LinkCardSlice = {
  __typename?: 'LinkCardSlice'
  id: Scalars['ID']
  title: Scalars['String']
  cards: Array<LinkCard>
}

export type LatestNewsSlice = {
  __typename?: 'LatestNewsSlice'
  id: Scalars['ID']
  title: Scalars['String']
  news: Array<News>
}

export type MailingListSignupSlice = {
  __typename?: 'MailingListSignupSlice'
  id: Scalars['ID']
  title: Scalars['String']
  description?: Maybe<Scalars['String']>
  inputLabel: Scalars['String']
  buttonText: Scalars['String']
}

export type LogoListSlice = {
  __typename?: 'LogoListSlice'
  id: Scalars['ID']
  title: Scalars['String']
  body: Scalars['String']
  images: Array<Image>
}

export type BulletListSlice = {
  __typename?: 'BulletListSlice'
  id: Scalars['ID']
  bullets: Array<BulletEntry>
}

export type BulletEntry = IconBullet | NumberBulletGroup

export type IconBullet = {
  __typename?: 'IconBullet'
  id: Scalars['ID']
  title: Scalars['String']
  body: Scalars['String']
  icon: Image
  url?: Maybe<Scalars['String']>
  linkText?: Maybe<Scalars['String']>
}

export type NumberBulletGroup = {
  __typename?: 'NumberBulletGroup'
  id: Scalars['ID']
  defaultVisible: Scalars['Int']
  bullets: Array<NumberBullet>
}

export type LinkList = {
  __typename?: 'LinkList'
  title?: Maybe<Scalars['String']>
  links: Array<Link>
}

export type LandingPage = {
  __typename?: 'LandingPage'
  title: Scalars['String']
  slug: Scalars['String']
  introduction: Scalars['String']
  image?: Maybe<Image>
  actionButton?: Maybe<Link>
  links?: Maybe<LinkList>
  content?: Maybe<Scalars['String']>
}

export type GenericPage = {
  __typename?: 'GenericPage'
  title: Scalars['String']
  slug: Scalars['String']
  intro?: Maybe<Scalars['String']>
  mainContent?: Maybe<Scalars['String']>
  sidebar?: Maybe<Scalars['String']>
  misc?: Maybe<Scalars['String']>
}

export type Menu = {
  __typename?: 'Menu'
  title: Scalars['String']
  links: Array<Link>
}

export type AdgerdirTags = {
  __typename?: 'AdgerdirTags'
  items: Array<AdgerdirTag>
}

export type LifeEventPage = {
  __typename?: 'LifeEventPage'
  title: Scalars['String']
  slug: Scalars['String']
  intro: Scalars['String']
  image: Image
  body: Scalars['JSON']
}

export type PaginatedAdgerdirNews = {
  __typename?: 'PaginatedAdgerdirNews'
  page: Pagination
  news: Array<AdgerdirNews>
}

export type Fund = {
  __typename?: 'Fund'
  nationalId: Scalars['ID']
  credit: Scalars['Float']
  used: Scalars['Float']
  total: Scalars['Float']
}

export type User = {
  __typename?: 'User'
  nationalId: Scalars['ID']
  name: Scalars['String']
  mobile?: Maybe<Scalars['String']>
  role: Scalars['String']
  fund?: Maybe<Fund>
  meetsADSRequirements: Scalars['Boolean']
}

export type Discount = {
  __typename?: 'Discount'
  nationalId: Scalars['ID']
  discountCode: Scalars['String']
  expiresIn: Scalars['Float']
  user: User
}

export type Flight = {
  __typename?: 'Flight'
  id: Scalars['ID']
  airline: Scalars['String']
  bookingDate: Scalars['String']
  travel: Scalars['String']
  user: User
}

export type Query = {
  __typename?: 'Query'
  getArticle?: Maybe<Article>
  getNews?: Maybe<News>
  getNewsList: PaginatedNews
  getAdgerdirNewsList: PaginatedAdgerdirNews
  getNamespace?: Maybe<Namespace>
  getAboutPage: AboutPage
  getLandingPage?: Maybe<LandingPage>
  getGenericPage?: Maybe<GenericPage>
  getAdgerdirPage?: Maybe<AdgerdirPage>
  getAdgerdirNews?: Maybe<AdgerdirNews>
  getAdgerdirPages: AdgerdirPages
  getAdgerdirTags?: Maybe<AdgerdirTags>
  getFrontpageSliderList?: Maybe<FrontpageSliderList>
  getAdgerdirFrontpage?: Maybe<AdgerdirFrontpage>
  getMenu?: Maybe<Menu>
  getLifeEventPage?: Maybe<LifeEventPage>
  user?: Maybe<User>
  discounts?: Maybe<Array<Discount>>
  flights: Array<Flight>
}

export type QueryGetArticleArgs = {
  input: GetArticleInput
}

export type QueryGetNewsArgs = {
  input: GetNewsInput
}

export type QueryGetNewsListArgs = {
  input: GetNewsListInput
}

export type QueryGetAdgerdirNewsListArgs = {
  input: GetAdgerdirNewsListInput
}

export type QueryGetNamespaceArgs = {
  input: GetNamespaceInput
}

export type QueryGetAboutPageArgs = {
  input: GetAboutPageInput
}

export type QueryGetLandingPageArgs = {
  input: GetLandingPageInput
}

export type QueryGetGenericPageArgs = {
  input: GetGenericPageInput
}

export type QueryGetAdgerdirPageArgs = {
  input: GetAdgerdirPageInput
}

export type QueryGetAdgerdirNewsArgs = {
  input: GetAdgerdirNewsInput
}

export type QueryGetAdgerdirPagesArgs = {
  input: GetAdgerdirPagesInput
}

export type QueryGetAdgerdirTagsArgs = {
  input: GetAdgerdirTagsInput
}

export type QueryGetFrontpageSliderListArgs = {
  input: GetFrontpageSliderListInput
}

export type QueryGetAdgerdirFrontpageArgs = {
  input: GetAdgerdirFrontpageInput
}

export type QueryGetMenuArgs = {
  input: GetMenuInput
}

export type QueryGetLifeEventPageArgs = {
  input: GetLifeEventPageInput
}

export type GetArticleInput = {
  slug?: Maybe<Scalars['String']>
  lang: Scalars['String']
}

export type GetNewsInput = {
  slug: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetNewsListInput = {
  lang?: Maybe<Scalars['String']>
  year?: Maybe<Scalars['Int']>
  month?: Maybe<Scalars['Int']>
  ascending?: Maybe<Scalars['Boolean']>
  page?: Maybe<Scalars['Int']>
  perPage?: Maybe<Scalars['Int']>
}

export type GetAdgerdirNewsListInput = {
  lang?: Maybe<Scalars['String']>
  year?: Maybe<Scalars['Int']>
  month?: Maybe<Scalars['Int']>
  ascending?: Maybe<Scalars['Boolean']>
  page?: Maybe<Scalars['Int']>
  perPage?: Maybe<Scalars['Int']>
}

export type GetNamespaceInput = {
  namespace?: Maybe<Scalars['String']>
  lang: Scalars['String']
}

export type GetAboutPageInput = {
  lang: Scalars['String']
}

export type GetLandingPageInput = {
  slug: Scalars['String']
  lang: Scalars['String']
}

export type GetGenericPageInput = {
  slug: Scalars['String']
  lang: Scalars['String']
}

export type GetAdgerdirPageInput = {
  slug?: Maybe<Scalars['String']>
  lang: Scalars['String']
}

export type GetAdgerdirNewsInput = {
  slug?: Maybe<Scalars['String']>
  lang: Scalars['String']
}

export type GetAdgerdirPagesInput = {
  lang?: Maybe<Scalars['String']>
  perPage?: Maybe<Scalars['Int']>
}

export type GetAdgerdirTagsInput = {
  lang?: Maybe<Scalars['String']>
}

export type GetFrontpageSliderListInput = {
  lang?: Maybe<Scalars['String']>
}

export type GetAdgerdirFrontpageInput = {
  lang: Scalars['String']
}

export type GetMenuInput = {
  name: Scalars['String']
  lang: Scalars['String']
}

export type GetLifeEventPageInput = {
  slug: Scalars['String']
  lang: Scalars['String']
}

export type GetMenuQueryVariables = Exact<{
  input: GetMenuInput
}>

export type GetMenuQuery = { __typename?: 'Query' } & {
  getMenu?: Maybe<
    { __typename?: 'Menu' } & Pick<Menu, 'title'> & {
        links: Array<{ __typename?: 'Link' } & Pick<Link, 'text' | 'url'>>
      }
  >
}

export type GetNamespaceQueryVariables = Exact<{
  input: GetNamespaceInput
}>

export type GetNamespaceQuery = { __typename?: 'Query' } & {
  getNamespace?: Maybe<{ __typename?: 'Namespace' } & Pick<Namespace, 'fields'>>
}

export type UserQueryQueryVariables = Exact<{ [key: string]: never }>

export type UserQueryQuery = { __typename?: 'Query' } & {
  user?: Maybe<
    { __typename?: 'User' } & Pick<
      User,
      'name' | 'nationalId' | 'mobile' | 'role'
    >
  >
}

export type GetGenericPageQueryVariables = Exact<{
  input: GetGenericPageInput
}>

export type GetGenericPageQuery = { __typename?: 'Query' } & {
  getGenericPage?: Maybe<
    { __typename?: 'GenericPage' } & Pick<
      GenericPage,
      'slug' | 'title' | 'intro' | 'mainContent' | 'sidebar' | 'misc'
    >
  >
}

export type GetGenericPageQueryQueryVariables = Exact<{
  input: GetGenericPageInput
}>

export type GetGenericPageQueryQuery = { __typename?: 'Query' } & {
  getGenericPage?: Maybe<
    { __typename?: 'GenericPage' } & Pick<
      GenericPage,
      'slug' | 'title' | 'intro' | 'mainContent' | 'sidebar' | 'misc'
    >
  >
}

export type DiscountsQueryQueryVariables = Exact<{ [key: string]: never }>

export type DiscountsQueryQuery = { __typename?: 'Query' } & {
  discounts?: Maybe<
    Array<
      { __typename?: 'Discount' } & Pick<
        Discount,
        'discountCode' | 'expiresIn' | 'nationalId'
      > & {
          user: { __typename?: 'User' } & Pick<
            User,
            'nationalId' | 'name' | 'meetsADSRequirements'
          > & {
              fund?: Maybe<
                { __typename?: 'Fund' } & Pick<
                  Fund,
                  'nationalId' | 'used' | 'credit' | 'total'
                >
              >
            }
        }
    >
  >
}

export type FlightsQueryQueryVariables = Exact<{ [key: string]: never }>

export type FlightsQueryQuery = { __typename?: 'Query' } & {
  flights: Array<
    { __typename?: 'Flight' } & Pick<
      Flight,
      'id' | 'bookingDate' | 'travel'
    > & { user: { __typename?: 'User' } & Pick<User, 'nationalId' | 'name'> }
  >
}

export const GetMenuDocument = gql`
  query GetMenu($input: GetMenuInput!) {
    getMenu(input: $input) {
      title
      links {
        text
        url
      }
    }
  }
`

/**
 * __useGetMenuQuery__
 *
 * To run a query within a React component, call `useGetMenuQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMenuQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMenuQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetMenuQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetMenuQuery,
    GetMenuQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<GetMenuQuery, GetMenuQueryVariables>(
    GetMenuDocument,
    baseOptions,
  )
}
export function useGetMenuLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetMenuQuery,
    GetMenuQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<GetMenuQuery, GetMenuQueryVariables>(
    GetMenuDocument,
    baseOptions,
  )
}
export type GetMenuQueryHookResult = ReturnType<typeof useGetMenuQuery>
export type GetMenuLazyQueryHookResult = ReturnType<typeof useGetMenuLazyQuery>
export type GetMenuQueryResult = ApolloReactCommon.QueryResult<
  GetMenuQuery,
  GetMenuQueryVariables
>
export const GetNamespaceDocument = gql`
  query GetNamespace($input: GetNamespaceInput!) {
    getNamespace(input: $input) {
      fields
    }
  }
`

/**
 * __useGetNamespaceQuery__
 *
 * To run a query within a React component, call `useGetNamespaceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNamespaceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNamespaceQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetNamespaceQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetNamespaceQuery,
    GetNamespaceQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    GetNamespaceQuery,
    GetNamespaceQueryVariables
  >(GetNamespaceDocument, baseOptions)
}
export function useGetNamespaceLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetNamespaceQuery,
    GetNamespaceQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    GetNamespaceQuery,
    GetNamespaceQueryVariables
  >(GetNamespaceDocument, baseOptions)
}
export type GetNamespaceQueryHookResult = ReturnType<
  typeof useGetNamespaceQuery
>
export type GetNamespaceLazyQueryHookResult = ReturnType<
  typeof useGetNamespaceLazyQuery
>
export type GetNamespaceQueryResult = ApolloReactCommon.QueryResult<
  GetNamespaceQuery,
  GetNamespaceQueryVariables
>
export const UserQueryDocument = gql`
  query UserQuery {
    user {
      name
      nationalId
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
export const GetGenericPageDocument = gql`
  query getGenericPage($input: GetGenericPageInput!) {
    getGenericPage(input: $input) {
      slug
      title
      intro
      mainContent
      sidebar
      misc
    }
  }
`

/**
 * __useGetGenericPageQuery__
 *
 * To run a query within a React component, call `useGetGenericPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGenericPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGenericPageQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetGenericPageQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetGenericPageQuery,
    GetGenericPageQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    GetGenericPageQuery,
    GetGenericPageQueryVariables
  >(GetGenericPageDocument, baseOptions)
}
export function useGetGenericPageLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetGenericPageQuery,
    GetGenericPageQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    GetGenericPageQuery,
    GetGenericPageQueryVariables
  >(GetGenericPageDocument, baseOptions)
}
export type GetGenericPageQueryHookResult = ReturnType<
  typeof useGetGenericPageQuery
>
export type GetGenericPageLazyQueryHookResult = ReturnType<
  typeof useGetGenericPageLazyQuery
>
export type GetGenericPageQueryResult = ApolloReactCommon.QueryResult<
  GetGenericPageQuery,
  GetGenericPageQueryVariables
>
export const GetGenericPageQueryDocument = gql`
  query getGenericPageQuery($input: GetGenericPageInput!) {
    getGenericPage(input: $input) {
      slug
      title
      intro
      mainContent
      sidebar
      misc
    }
  }
`

/**
 * __useGetGenericPageQueryQuery__
 *
 * To run a query within a React component, call `useGetGenericPageQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGenericPageQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGenericPageQueryQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetGenericPageQueryQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetGenericPageQueryQuery,
    GetGenericPageQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    GetGenericPageQueryQuery,
    GetGenericPageQueryQueryVariables
  >(GetGenericPageQueryDocument, baseOptions)
}
export function useGetGenericPageQueryLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetGenericPageQueryQuery,
    GetGenericPageQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    GetGenericPageQueryQuery,
    GetGenericPageQueryQueryVariables
  >(GetGenericPageQueryDocument, baseOptions)
}
export type GetGenericPageQueryQueryHookResult = ReturnType<
  typeof useGetGenericPageQueryQuery
>
export type GetGenericPageQueryLazyQueryHookResult = ReturnType<
  typeof useGetGenericPageQueryLazyQuery
>
export type GetGenericPageQueryQueryResult = ApolloReactCommon.QueryResult<
  GetGenericPageQueryQuery,
  GetGenericPageQueryQueryVariables
>
export const DiscountsQueryDocument = gql`
  query DiscountsQuery {
    discounts {
      discountCode
      expiresIn
      nationalId
      user {
        nationalId
        name
        fund {
          nationalId
          used
          credit
          total
        }
        meetsADSRequirements
      }
    }
  }
`

/**
 * __useDiscountsQueryQuery__
 *
 * To run a query within a React component, call `useDiscountsQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiscountsQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiscountsQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useDiscountsQueryQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    DiscountsQueryQuery,
    DiscountsQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    DiscountsQueryQuery,
    DiscountsQueryQueryVariables
  >(DiscountsQueryDocument, baseOptions)
}
export function useDiscountsQueryLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    DiscountsQueryQuery,
    DiscountsQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    DiscountsQueryQuery,
    DiscountsQueryQueryVariables
  >(DiscountsQueryDocument, baseOptions)
}
export type DiscountsQueryQueryHookResult = ReturnType<
  typeof useDiscountsQueryQuery
>
export type DiscountsQueryLazyQueryHookResult = ReturnType<
  typeof useDiscountsQueryLazyQuery
>
export type DiscountsQueryQueryResult = ApolloReactCommon.QueryResult<
  DiscountsQueryQuery,
  DiscountsQueryQueryVariables
>
export const FlightsQueryDocument = gql`
  query FlightsQuery {
    flights {
      id
      bookingDate
      travel
      user {
        nationalId
        name
      }
    }
  }
`

/**
 * __useFlightsQueryQuery__
 *
 * To run a query within a React component, call `useFlightsQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useFlightsQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFlightsQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useFlightsQueryQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    FlightsQueryQuery,
    FlightsQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    FlightsQueryQuery,
    FlightsQueryQueryVariables
  >(FlightsQueryDocument, baseOptions)
}
export function useFlightsQueryLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    FlightsQueryQuery,
    FlightsQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    FlightsQueryQuery,
    FlightsQueryQueryVariables
  >(FlightsQueryDocument, baseOptions)
}
export type FlightsQueryQueryHookResult = ReturnType<
  typeof useFlightsQueryQuery
>
export type FlightsQueryLazyQueryHookResult = ReturnType<
  typeof useFlightsQueryLazyQuery
>
export type FlightsQueryQueryResult = ApolloReactCommon.QueryResult<
  FlightsQueryQuery,
  FlightsQueryQueryVariables
>
