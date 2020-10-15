import { Resolvers } from '../../types'
import { store } from './store'

export const resolvers: Resolvers = {
  Slice: {
    __resolveType: (parent) => {
      return parent.typename as any
    },
  },

  Query: {
    getArticleCategories: () => store.articleCategories,

    getArticles: (parent, args) => {
      return store.articles.filter(
        (article) => article.category?.slug === args.input.category,
      )
    },

    getSingleArticle: (parent, args) =>
      store.articles.find((article) => article.slug === args.input.slug) ||
      null,

    getMenu: () => store.menu,

    getAlertBanner: () => store.alertBanner,

    getNewsList: (parent, args) => {
      const sorted = args.input.ascending
        ? [...store.newsList].reverse()
        : store.newsList
      const page = args.input.page || 1
      const perPage = args.input.perPage || 10
      return {
        news: sorted.slice(page * perPage - perPage, page * perPage),
        page: {
          page,
          perPage,
          totalResults: store.newsList.length,
          totalPages: Math.ceil(store.newsList.length / perPage),
        },
      }
    },

    getSingleNews: (parent, args) =>
      store.newsList.find((news) => news.slug === args.input.slug) || null,

    getLifeEvents: () => store.lifeEvents,

    getLifeEventPage: (parent, args) =>
      store.lifeEvents.find(
        (lifeEvent) => lifeEvent.slug === args.input.slug,
      ) || null,

    getLifeEventsInCategory: (parent, args) => {
      return store.lifeEvents.filter(
        (lifeEvent) => lifeEvent.category?.slug === args.input.slug,
      )
    },

    getFrontpageSliderList: () => ({
      items: store.frontPageSliders,
    }),

    getHomepage: () => store.homepage,

    getNamespace: (parent, args) => {
      return {
        namespace: args.input.namespace || 'namespace',
        fields: '{}',
      }
    },
  },
}
