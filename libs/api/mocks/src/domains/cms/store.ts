import orderBy from 'lodash/orderBy'

import { createStore, faker } from '@island.is/shared/mocking'

import { Article } from '../../types'

import {
  alertBanner as createAlertBanner,
  article,
  articleCategory,
  articleGroup,
  articleSubgroup,
  featured,
  frontpage as createFrontpage,
  frontPageSlider,
  genericPage,
  groupedMenu as createGroupedMenu,
  lifeEvent,
  menu as createMenu,
  news,
  referenceLink,
} from './factories'

export const store = createStore(() => {
  faker.seed(100)

  const articleCategories = articleCategory.list(5)

  // Create articles, groups and subgroups in every category.
  const articles = articleCategories.reduce<Article[]>((articles, category) => {
    const groups = articleGroup.list(faker.datatype.number({ min: 2, max: 4 }))

    for (const group of groups) {
      const subGroups =
        faker.datatype.number(4) === 0
          ? []
          : articleSubgroup.list(faker.datatype.number({ min: 2, max: 4 }))

      const groupArticles = article.list(subGroups.length * 2 + 2, {
        group,
        category,
        subgroup: () =>
          subGroups.length > 0 ? faker.random.arrayElement(subGroups) : null,
      })
      articles = articles.concat(groupArticles)
    }
    return articles
  }, [])

  const groupedMenu = createGroupedMenu()

  const alertBanner = createAlertBanner()

  const menu = createMenu()

  const newsList = orderBy(news.list(12), ['date'], ['desc'])

  const lifeEvents = lifeEvent.list(6, {
    category: () => faker.random.arrayElement(articleCategories),
  })

  const frontpage = {
    ...createFrontpage(),
    ...{ namespace: { namespace: 'homepage', fields: '{}' } },
  }

  const genericPages = [genericPage({ title: 'Loftbrú', slug: 'loftbru' })]

  return {
    frontpage,
    lifeEvents,
    newsList,
    alertBanner,
    menu,
    groupedMenu,
    articles,
    articleCategories,
    genericPages,
  }
})
