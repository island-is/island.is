import { Resolvers } from '../../types'
import {
  alertBanner,
  articleCategories,
  articles,
  frontPageSliders,
  homepage,
  lifeEvents,
  menu,
  newsList,
} from './seed'

export const resolvers: Resolvers = {
  Slice: {
    __resolveType: (parent) => {
      return parent.typename as any
    },
  },

  Query: {
    getArticleCategories: () => articleCategories,

    getArticles: (parent, args) => {
      return articles.filter(
        (article) => article.category?.slug === args.input.category,
      )
    },

    getSingleArticle: (parent, args) =>
      articles.find((article) => article.slug === args.input.slug) || null,

    getMenu: () => menu,

    getAlertBanner: () => alertBanner,

    getNewsList: (parent, args) => {
      const sorted = args.input.ascending ? [...newsList].reverse() : newsList
      const page = args.input.page || 1
      const perPage = args.input.perPage || 10
      return {
        news: sorted.slice(page * perPage - perPage, page * perPage),
        page: {
          page,
          perPage,
          totalResults: newsList.length,
          totalPages: Math.ceil(newsList.length / perPage),
        },
      }
    },

    getSingleNews: (parent, args) =>
      newsList.find((news) => news.slug === args.input.slug) || null,

    getLifeEvents: () => lifeEvents,

    getLifeEventPage: (parent, args) =>
      lifeEvents.find((lifeEvent) => lifeEvent.slug === args.input.slug) ||
      null,

    getLifeEventsInCategory: (parent, args) => {
      return lifeEvents.filter(
        (lifeEvent) => lifeEvent.category?.slug === args.input.slug,
      )
    },

    getFrontpageSliderList: () => ({
      items: frontPageSliders,
    }),

    getHomepage: () => homepage,

    getNamespace: async (parent, args, context) => {
      const response = await context.fetch('https://island.is/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query GetNamespace($input: GetNamespaceInput!) {
              getNamespace(input: $input) {
                namespace
                fields
              }
            }`,
          variables: args,
        }),
      })

      const body = await response.json()
      return body.data.getNamespace
    },
  },
}
