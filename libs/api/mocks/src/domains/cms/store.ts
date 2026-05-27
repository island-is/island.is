import {
  article,
  articleCategory,
  alertBanner as createAlertBanner,
  menu as createMenu,
  groupedMenu as createGroupedMenu,
  news,
  anchorPage,
  lifeEventPage,
  articleGroup,
  articleSubgroup,
  genericPage,
  frontpage as createFrontpage,
  image as createImage,
  organization,
} from './factories'
import orderBy from 'lodash/orderBy'
import { Article, GroupedMenu, Organization } from '../../types'
import { createStore, faker } from '@island.is/shared/mocking'

export const HEADER_NAV_GROUPED_MENU_ID = '1SCm5KnfQ3DrWT600MTt82'

const createHeaderMenuLink = (title: string, slug: string, type: string) => ({
  title,
  link: { slug, type },
  childLinks: [],
})

const createHeaderNavGroupedMenu = (): GroupedMenu => ({
  id: HEADER_NAV_GROUPED_MENU_ID,
  title: 'Header navigation',
  menus: [
    createMenu({
      id: '667soOAm18qMsyKWawUQgx',
      title: 'Stofnanir',
      links: [],
      menuLinks: [
        createHeaderMenuLink(
          'Stafraent Island',
          'stafraent-island',
          'organizationpage',
        ),
        createHeaderMenuLink('Syslumenn', 'syslumenn', 'organizationpage'),
        createHeaderMenuLink(
          'Vinnumalastofnun',
          'vinnumalastofnun',
          'organizationpage',
        ),
      ],
    }),
    createMenu({
      id: '62QvK3jzHzWnuIAp0jYgvq',
      title: 'Thjonustuflokkar',
      links: [],
      menuLinks: [
        createHeaderMenuLink('Fjolskylda', 'fjolskylda', 'articlecategory'),
        createHeaderMenuLink(
          'Atvinna',
          'atvinna-rekstur-og-felag',
          'articlecategory',
        ),
        createHeaderMenuLink('Heilsa', 'heilsa', 'articlecategory'),
      ],
    }),
    createMenu({
      id: '4nXPzCHn5X8UDEKaDZqCgb',
      title: 'Lifsvidburdir',
      links: [],
      menuLinks: [
        createHeaderMenuLink('Barneignir', 'barneignir', 'lifeeventpage'),
        createHeaderMenuLink(
          'Buin ad eignast barn',
          'nyfaett-barn',
          'lifeeventpage',
        ),
        createHeaderMenuLink(
          'Flytja til Islands',
          'flytja-til-islands',
          'lifeeventpage',
        ),
      ],
    }),
  ],
})

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
  const headerNavGroupedMenu = createHeaderNavGroupedMenu()

  const alertBanner = createAlertBanner()

  const menu = createMenu()

  const newsList = orderBy(news.list(12), ['date'], ['desc'])

  const anchorPages = anchorPage.list(6, {
    category: () => faker.random.arrayElement(articleCategories),
  })

  const lifeEventsPages = lifeEventPage.list(6, {
    category: () => faker.random.arrayElement(articleCategories),
  })

  const frontpage = {
    ...createFrontpage(),
    ...{ namespace: { namespace: 'homepage', fields: '{}' } },
  }

  const genericPages = [genericPage({ title: 'Loftbrú', slug: 'loftbru' })]

  const organizations: { items: Organization[] } = {
    items: [
      organization({
        title: 'Stafraent Island',
        slug: 'stafraent-island',
        logo: createImage({
          title: 'Stafraent Island',
          url: '/assets/mock-logo-1.svg',
        }),
      }),
      organization({
        title: 'Syslumenn',
        slug: 'syslumenn',
        logo: createImage({
          title: 'Syslumenn',
          url: '/assets/mock-logo-2.svg',
        }),
      }),
      organization({
        title: 'Vinnumalastofnun',
        slug: 'vinnumalastofnun',
        logo: createImage({
          title: 'Vinnumalastofnun',
          url: '/assets/mock-logo-3.svg',
        }),
      }),
      ...organization.list(2),
    ],
  }

  return {
    frontpage,
    anchorPages,
    lifeEventsPages,
    newsList,
    alertBanner,
    menu,
    groupedMenu,
    headerNavGroupedMenu,
    articles,
    articleCategories,
    genericPages,
    organizations,
  }
})
