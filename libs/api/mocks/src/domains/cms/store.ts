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
import orderBy from 'lodash/orderBy'
import { Article } from '../../types'
import { createStore, faker } from '@island.is/shared/mocking'

export const store = createStore(() => {
  faker.seed(100)

  const articleCategories = articleCategory.list(5)

  // Create articles, groups and subgroups in every category.
  const articles = articleCategories.reduce<Article[]>((articles, category) => {
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
  }, [])

  const menu = createMenu()

  const alertBanner = createAlertBanner()

  const newsList = orderBy(news.list(12), ['date'], ['desc'])

  const lifeEvents = lifeEvent.list(6, {
    category: () => faker.random.arrayElement(articleCategories),
  })

  const frontPageSliders = frontPageSlider.list(3)

  const homepage = createHomepage({
    featuredThings: featured.list(3, {
      thing: () => faker.random.arrayElement(articles),
    }),
  })

  return {
    homepage,
    frontPageSliders,
    lifeEvents,
    newsList,
    alertBanner,
    menu,
    articles,
    articleCategories,
  }
})
