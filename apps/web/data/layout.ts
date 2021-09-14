import { Locale } from '@island.is/shared/types'
import {
  QueryGetArticleCategoriesArgs,
  ContentLanguage,
  QueryGetAlertBannerArgs,
  QueryGetNamespaceArgs,
  QueryGetGroupedMenuArgs,
  Menu,
} from '@island.is/api/schema'
import initApollo from '../graphql/client'
import {
  GetArticleCategoriesQuery,
  GetAlertBannerQuery,
  GetNamespaceQuery,
  GetGroupedMenuQuery,
} from '../graphql/schema'
import { GET_CATEGORIES_QUERY, GET_NAMESPACE_QUERY } from '../screens/queries'
import { GET_ALERT_BANNER_QUERY } from '../screens/queries/AlertBanner'
import { GET_GROUPED_MENU_QUERY } from '../screens/queries/Menu'
import {
  formatMegaMenuLinks,
  formatMegaMenuCategoryLinks,
} from '../utils/processMenuData'
import { stringHash } from '../utils/stringHash'
import {
  LinkType,
  linkResolver as LinkResolver,
} from '../hooks/useLinkResolver'
import { IncomingMessage } from 'http'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'

const IS_MOCK =
  process.env.NODE_ENV !== 'production' && process.env.API_MOCKS === 'true'

const absoluteUrl = (req: IncomingMessage, setLocalhost: string) => {
  let protocol = 'https:'
  let host = req
    ? req.headers['x-forwarded-host'] || req.headers['host']
    : window.location.host
  if (host.indexOf('localhost') > -1) {
    if (setLocalhost) host = setLocalhost
    protocol = 'http:'
  }
  return {
    protocol: protocol,
    host: host,
    origin: protocol + '//' + host,
  }
}

export const getMainLayoutData = async (
  locale: Locale = 'is',
  req: IncomingMessage,
  existingClient: ApolloClient<NormalizedCacheObject>,
) => {
  const apolloClient = existingClient ?? initApollo({}, locale as Locale)

  const lang = locale ?? 'is'

  const { origin } = absoluteUrl(req, 'localhost:4200')
  const respOrigin = `${origin}`
  const [
    categories,
    alertBanner,
    namespace,
    megaMenuData,
    footerMenuData,
  ] = await Promise.all([
    apolloClient
      .query<GetArticleCategoriesQuery, QueryGetArticleCategoriesArgs>({
        query: GET_CATEGORIES_QUERY,
        variables: {
          input: {
            lang: locale as ContentLanguage,
          },
        },
      })
      .then((res) => res.data.getArticleCategories),
    apolloClient
      .query<GetAlertBannerQuery, QueryGetAlertBannerArgs>({
        query: GET_ALERT_BANNER_QUERY,
        variables: {
          input: { id: '2foBKVNnRnoNXx9CfiM8to', lang: locale },
        },
      })
      .then((res) => res.data.getAlertBanner),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Global',
            lang: locale,
          },
        },
      })
      .then((res) => {
        // map data here to reduce data processing in component
        return JSON.parse(res.data.getNamespace.fields)
      }),
    apolloClient
      .query<GetGroupedMenuQuery, QueryGetGroupedMenuArgs>({
        query: GET_GROUPED_MENU_QUERY,
        variables: {
          input: { id: '5prHB8HLyh4Y35LI4bnhh2', lang: locale },
        },
      })
      .then((res) => res.data.getGroupedMenu),
    apolloClient
      .query<GetGroupedMenuQuery, QueryGetGroupedMenuArgs>({
        query: GET_GROUPED_MENU_QUERY,
        variables: {
          input: { id: '7MeplCDXx2n01BoxRrekCi', lang: locale },
        },
      })
      .then((res) => res.data.getGroupedMenu),
  ])
  const alertBannerId = `alert-${stringHash(JSON.stringify(alertBanner))}`
  const [asideTopLinksData, asideBottomLinksData] = megaMenuData.menus

  const mapLinks = (item: Menu) =>
    item.menuLinks.map((x) => {
      const href = LinkResolver(
        x.link.type as LinkType,
        [x.link.slug],
        lang as Locale,
      ).href.trim()

      // If a link type is an url string and the url has the same origin, strip the origin part out
      // so that the Link component does not treat it as an external url.
      return {
        title: x.title,
        href: href.startsWith(origin) ? href.replace(origin, '') : href,
      }
    })

  const initialFooterMenu = {
    footerUpperInfo: [],
    footerUpperContact: [],
    footerLowerMenu: [],
    footerTagsMenu: [],
    footerMiddleMenu: [],
  }

  const footerMenu = footerMenuData.menus.reduce((menus, menu, idx) => {
    if (IS_MOCK) {
      const key = Object.keys(menus)[idx]
      if (key) {
        menus[key] = mapLinks(menu as Menu)
      }
      return menus
    }

    switch (menu.id) {
      // Footer lower
      case '6vTuiadpCKOBhAlSjYY8td':
        menus.footerLowerMenu = mapLinks(menu as Menu)
        break
      // Footer middle
      case '7hSbSQm5F5EBc0KxPTFVAS':
        menus.footerMiddleMenu = mapLinks(menu as Menu)
        break
      // Footer tags
      case '6oGQDyWos4xcKX9BdMHd5R':
        menus.footerTagsMenu = mapLinks(menu as Menu)
        break
      // Footer upper
      case '62Zh6hUc3bi0JwNRnqV8Nm':
        menus.footerUpperInfo = mapLinks(menu as Menu)
        break
      // Footer upper contact
      case '5yUCZ4U6aZ8rZ9Jigme7GI':
        menus.footerUpperContact = mapLinks(menu as Menu)
        break
      default:
        break
    }

    return menus
  }, initialFooterMenu)

  return {
    categories,
    alertBannerContent: {
      ...alertBanner,
      showAlertBanner:
        alertBanner.showAlertBanner &&
        (!req?.headers.cookie ||
          req.headers.cookie?.indexOf(alertBannerId) === -1),
    },
    ...footerMenu,
    namespace,
    respOrigin,
    megaMenuData: {
      asideTopLinks: formatMegaMenuLinks(
        lang as Locale,
        asideTopLinksData.menuLinks,
      ),
      asideBottomTitle: asideBottomLinksData.title,
      asideBottomLinks: formatMegaMenuLinks(
        lang as Locale,
        asideBottomLinksData.menuLinks,
      ),
      mainLinks: formatMegaMenuCategoryLinks(lang as Locale, categories),
    },
  }
}
