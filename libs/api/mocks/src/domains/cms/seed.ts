import {
  article,
  articleCategory,
  alertBanner as createAlertBanner,
  menu as createMenu,
  news,
  lifeEvent,
  frontPageSlider,
  homepage as createHomepage,
  articleGroup,
  articleSubgroup,
  featured,
} from './factories'
import * as faker from 'faker'
import orderBy from 'lodash/orderBy'
import { Article } from '../../types'

faker.seed(100)

export const articleCategories = articleCategory.list(5)

// Create articles, groups and subgroups in every category.
export const articles = articleCategories.reduce<Article[]>(
  (articles, category) => {
    const groups = articleGroup.list(faker.random.number({ min: 2, max: 4 }))

    for (const group of groups) {
      const subGroups =
        faker.random.number(4) === 0
          ? []
          : articleSubgroup.list(faker.random.number({ min: 2, max: 4 }))

      const groupArticles = article.list(subGroups.length * 2 + 2, {
        group,
        category,
        subgroup: () =>
          subGroups.length > 0 ? faker.random.arrayElement(subGroups) : null,
      })
      articles = articles.concat(groupArticles)
    }
    return articles
  },
  [],
)

export const menu = createMenu()

export const alertBanner = createAlertBanner()

export const newsList = orderBy(news.list(12), ['date'], ['desc'])

export const lifeEvents = lifeEvent.list(6, {
  category: () => faker.random.arrayElement(articleCategories),
})

export const frontPageSliders = frontPageSlider.list(3)

export const homepage = createHomepage({
  featuredThings: featured.list(3, {
    thing: () => faker.random.arrayElement(articles),
  }),
})
