import { SystemMetadata } from '@island.is/shared/types'
import orderBy from 'lodash/orderBy'
import { Resolvers } from '../../types'
import { store } from './store'
import { getDatePrefix } from './utils'

export const resolvers: Resolvers = {
  Slice: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __resolveType: (parent) => {
      return (parent as SystemMetadata<typeof parent>).typename as never
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

    getGroupedMenu: (_parent, _args) => store.groupedMenu,

    getAlertBanner: () => store.alertBanner,

    getNews: (parent, args) => {
      const datePrefix = getDatePrefix(args.input.year, args.input.month)
      const filtered = store.newsList.filter((news) =>
        news.date.startsWith(datePrefix),
      )
      const sorted = args.input.order === 'asc' ? filtered.reverse() : filtered
      const page = args.input.page || 1
      const perPage = args.input.size || 10
      const start = (page - 1) * perPage
      return {
        items: sorted.slice(start, start + perPage),
        total: filtered.length,
      }
    },

    getNewsDates: (parent, args) => {
      const yearsAndMonths = store.newsList.map((news) => news.date.slice(0, 7))
      const order = args.input.order === 'desc' ? 'desc' : 'asc'
      const unique = Array.from(new Set(yearsAndMonths))
      return orderBy(unique, [], order)
    },

    getSingleNews: (parent, args) =>
      store.newsList.find((news) => news.slug === args.input.slug) || null,

    getAnchorPages: () => store.anchorPages,

    getAnchorPage: (parent, args) =>
      store.anchorPages.find(
        (anchorPage) => anchorPage.slug === args.input.slug,
      ) || null,

    getLifeEventsForOverview: () => store.lifeEventsPages,

    getLifeEventPage: (parent, args) =>
      store.lifeEventsPages.find(
        (lifeEventPage) => lifeEventPage.slug === args.input.slug,
      ) || null,

    getLifeEventsInCategory: (parent, args) => {
      return store.lifeEventsPages.filter(
        (lifeEventPage) => lifeEventPage.category?.slug === args.input.slug,
      )
    },

    getFrontpage: () => store.frontpage,

    getNamespace: (parent, args) => {
      return {
        namespace: args.input.namespace || 'namespace',
        fields: '{}',
      }
    },

    getGenericPage: (parent, args) => {
      return (
        store.genericPages.find(
          (genericPage) => genericPage.slug === args.input.slug,
        ) || null
      )
    },

    getOrganizations: () => {
      return store.organizations
    },
  },
}
