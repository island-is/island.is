import { Locale } from '@island.is/shared/types'
import { FRONTPAGE_NEWS_TAG_ID } from '../constants'
import initApollo from '../graphql/client'
import {
  ContentLanguage,
  GetArticleCategoriesQuery,
  GetFrontpageQuery,
  GetNewsQuery,
  QueryGetArticleCategoriesArgs,
  QueryGetFrontpageArgs,
  QueryGetNewsArgs,
} from '../graphql/schema'
import {
  GET_CATEGORIES_QUERY,
  GET_FRONTPAGE_QUERY,
  GET_NEWS_QUERY,
} from '../screens/queries'

export const getHomeData = async (locale = 'is') => {
  const apolloClient = initApollo({}, locale as Locale)

  const [
    {
      data: { getArticleCategories },
    },
    {
      data: {
        getNews: { items: news },
      },
    },
    {
      data: { getFrontpage },
    },
  ] = await Promise.all([
    apolloClient.query<
      GetArticleCategoriesQuery,
      QueryGetArticleCategoriesArgs
    >({
      query: GET_CATEGORIES_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<GetNewsQuery, QueryGetNewsArgs>({
      query: GET_NEWS_QUERY,
      variables: {
        input: {
          size: 3,
          lang: locale as ContentLanguage,
          tag: FRONTPAGE_NEWS_TAG_ID,
        },
      },
    }),
    apolloClient.query<GetFrontpageQuery, QueryGetFrontpageArgs>({
      query: GET_FRONTPAGE_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
          pageIdentifier: 'frontpage',
        },
      },
    }),
  ])

  return {
    news,
    categories: getArticleCategories,
    page: getFrontpage,
  }
}
