import React from 'react'
import Head from 'next/head'
import {
  Page,
  Box,
  FooterLinkProps,
  Footer,
  AlertBanner,
  AlertBannerVariants,
  Hidden,
  ButtonTypes,
  ColorSchemeContext,
  ColorSchemes,
} from '@island.is/island-ui/core'
import { NextComponentType, NextPageContext } from 'next'
import { Screen, GetInitialPropsContext } from '../types'
import Cookies from 'js-cookie'
import * as Sentry from '@sentry/node'
import { RewriteFrames } from '@sentry/integrations'
import { useRouter } from 'next/router'
import {
  Header,
  Main,
  PageLoader,
  SkipToMainContent,
} from '@island.is/web/components'
import { GET_GROUPED_MENU_QUERY } from '../screens/queries/Menu'
import { GET_CATEGORIES_QUERY, GET_NAMESPACE_QUERY } from '../screens/queries'
import {
  GetGroupedMenuQuery,
  GetNamespaceQuery,
  QueryGetNamespaceArgs,
  ContentLanguage,
  GetAlertBannerQuery,
  QueryGetAlertBannerArgs,
  GetArticleCategoriesQuery,
  QueryGetArticleCategoriesArgs,
  QueryGetGroupedMenuArgs,
  Menu,
} from '../graphql/schema'
import { GlobalContextProvider } from '../context'
import { MenuTabsContext } from '../context/MenuTabsContext/MenuTabsContext'
import { useI18n } from '../i18n'
import { GET_ALERT_BANNER_QUERY } from '../screens/queries/AlertBanner'
import { environment } from '../environments'
import { useNamespace } from '../hooks'
import {
  formatMegaMenuCategoryLinks,
  formatMegaMenuLinks,
} from '../utils/processMenuData'
import { Locale } from '@island.is/shared/types'
import {
  LinkType,
  useLinkResolver,
  linkResolver as LinkResolver,
} from '../hooks/useLinkResolver'
import { stringHash } from '@island.is/web/utils/stringHash'

const IS_MOCK =
  process.env.NODE_ENV !== 'production' && process.env.API_MOCKS === 'true'

const absoluteUrl = (req, setLocalhost) => {
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

export interface LayoutProps {
  showSearchInHeader?: boolean
  wrapContent?: boolean
  showHeader?: boolean
  headerColorScheme?: ColorSchemes
  headerButtonColorScheme?: ButtonTypes['colorScheme']
  showFooter?: boolean
  categories: GetArticleCategoriesQuery['getArticleCategories']
  topMenuCustomLinks?: FooterLinkProps[]
  footerUpperInfo?: FooterLinkProps[]
  footerUpperContact?: FooterLinkProps[]
  footerLowerMenu?: FooterLinkProps[]
  footerMiddleMenu?: FooterLinkProps[]
  footerTagsMenu?: FooterLinkProps[]
  namespace: Record<string, string | string[]>
  alertBannerContent?: GetAlertBannerQuery['getAlertBanner']
  respOrigin
  megaMenuData
}

if (environment.sentryDsn) {
  Sentry.init({
    dsn: environment.sentryDsn,
    enabled: environment.production,
    integrations: [
      new RewriteFrames({
        iteratee: (frame) => {
          frame.filename = frame.filename.replace(`~/.next`, 'app:///_next')
          return frame
        },
      }),
    ],
  })
}

const Layout: NextComponentType<
  GetInitialPropsContext<NextPageContext>,
  LayoutProps,
  LayoutProps
> = ({
  showSearchInHeader = true,
  wrapContent = true,
  showHeader = true,
  headerColorScheme,
  headerButtonColorScheme,
  showFooter = true,
  categories,
  topMenuCustomLinks,
  footerUpperInfo,
  footerUpperContact,
  footerLowerMenu,
  footerMiddleMenu,
  footerTagsMenu,
  namespace,
  alertBannerContent,
  respOrigin,
  children,
  megaMenuData,
}) => {
  const { activeLocale, t } = useI18n()
  const { linkResolver } = useLinkResolver()
  const n = useNamespace(namespace)
  const { route, pathname, query, asPath } = useRouter()
  const fullUrl = `${respOrigin}${asPath}`

  Sentry.configureScope((scope) => {
    scope.setExtra('lang', activeLocale)

    scope.setContext('router', {
      route,
      pathname,
      query,
      asPath,
    })
  })

  Sentry.addBreadcrumb({
    category: 'pages/main',
    message: `Rendering from ${process.browser ? 'browser' : 'server'}`,
    level: Sentry.Severity.Debug,
  })

  const menuTabs = [
    {
      title: t.serviceCategories,
      externalLinksHeading: t.serviceCategories,
      links: categories.map((x) => {
        return {
          title: x.title,
          href: linkResolver(x.__typename as LinkType, [x.slug]).href,
        }
      }),
    },
    {
      title: t.siteTitle,
      links: topMenuCustomLinks,
      externalLinksHeading: t.siteExternalTitle,
      externalLinks: footerLowerMenu,
    },
  ]

  const alertBannerId = `alert-${stringHash(
    JSON.stringify(alertBannerContent),
  )}`

  const preloadedFonts = [
    '/fonts/ibm-plex-sans-v7-latin-300.woff2',
    '/fonts/ibm-plex-sans-v7-latin-regular.woff2',
    '/fonts/ibm-plex-sans-v7-latin-italic.woff2',
    '/fonts/ibm-plex-sans-v7-latin-500.woff2',
    '/fonts/ibm-plex-sans-v7-latin-600.woff2',
  ]

  return (
    <GlobalContextProvider namespace={namespace}>
      <Page component="div">
        <Head>
          {preloadedFonts.map((href, index) => {
            return (
              <link
                key={index}
                rel="preload"
                href={href}
                as="font"
                type="font/woff2"
                crossOrigin="true"
              />
            )
          })}
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
          <title>{n('title')}</title>
          <meta name="title" content={n('title')} key="title" />
          <meta
            name="description"
            content={n('description')}
            key="description"
          />
          <meta property="og:title" content={n('title')} key="ogTitle" />
          <meta
            property="og:description"
            content={n('description')}
            key="ogDescription"
          />
          <meta property="og:type" content="website" key="ogWebsite" />
          <meta property="og:url" content={fullUrl} key="ogUrl" />
          <meta
            property="og:image"
            content="https://island.is/island-fb-1200x630.png"
            key="ogImage"
          />
          <meta property="og:image:width" content="1200" key="ogImageWidth" />
          <meta property="og:image:height" content="630" key="ogImageHeight" />
          <meta
            property="twitter:card"
            content="summary_large_image"
            key="twitterCard"
          />
          <meta property="twitter:url" content={fullUrl} key="twitterUrl" />
          <meta
            property="twitter:title"
            content={n('title')}
            key="twitterTitle"
          />
          <meta
            property="twitter:description"
            content={n('description')}
            key="twitterDescription"
          />
          <meta
            property="twitter:image"
            content="https://island.is/island-fb-1200x630.png"
            key="twitterImage"
          />
        </Head>
        <SkipToMainContent
          title={n('skipToMainContent', 'Fara beint í efnið')}
        />
        {!Cookies.get(alertBannerId) && alertBannerContent.showAlertBanner && (
          <AlertBanner
            title={alertBannerContent.title}
            description={alertBannerContent.description}
            link={{
              ...(!!alertBannerContent.link &&
                !!alertBannerContent.linkTitle && {
                  href: linkResolver(alertBannerContent.link.type as LinkType, [
                    alertBannerContent.link.slug,
                  ]).href,
                  title: alertBannerContent.linkTitle,
                }),
            }}
            variant={alertBannerContent.bannerVariant as AlertBannerVariants}
            dismissable={alertBannerContent.isDismissable}
            onDismiss={() => {
              if (alertBannerContent.dismissedForDays !== 0) {
                Cookies.set(alertBannerId, 'hide', {
                  expires: alertBannerContent.dismissedForDays,
                })
              }
            }}
          />
        )}
        <PageLoader />
        <MenuTabsContext.Provider
          value={{
            menuTabs,
          }}
        >
          {showHeader && (
            <ColorSchemeContext.Provider
              value={{ colorScheme: headerColorScheme }}
            >
              <Header
                buttonColorScheme={headerButtonColorScheme}
                showSearchInHeader={showSearchInHeader}
                megaMenuData={megaMenuData}
              />
            </ColorSchemeContext.Provider>
          )}
          <Main>
            {wrapContent ? <Box width="full">{children}</Box> : children}
          </Main>
        </MenuTabsContext.Provider>
        {showFooter && (
          <Hidden print={true}>
            <Footer
              topLinks={footerUpperInfo}
              topLinksContact={footerUpperContact}
              bottomLinks={footerLowerMenu}
              middleLinks={footerMiddleMenu}
              bottomLinksTitle={t.siteExternalTitle}
              tagLinks={footerTagsMenu}
              middleLinksTitle={String(namespace.footerMiddleLabel)}
              tagLinksTitle={String(namespace.footerRightLabel)}
              languageSwitchLink={{
                title: activeLocale === 'en' ? 'Íslenska' : 'English',
                href: activeLocale === 'en' ? '/' : '/en',
              }}
              showMiddleLinks
              showTagLinks
            />
          </Hidden>
        )}
        <style jsx global>{`
          @font-face {
            font-family: 'IBM Plex Sans';
            font-style: normal;
            font-weight: 300;
            font-display: swap;
            src: local('IBM Plex Sans Light'), local('IBMPlexSans-Light'),
              url('/fonts/ibm-plex-sans-v7-latin-300.woff2') format('woff2'),
              url('/fonts/ibm-plex-sans-v7-latin-300.woff') format('woff');
          }
          @font-face {
            font-family: 'IBM Plex Sans';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: local('IBM Plex Sans'), local('IBMPlexSans'),
              url('/fonts/ibm-plex-sans-v7-latin-regular.woff2') format('woff2'),
              url('/fonts/ibm-plex-sans-v7-latin-regular.woff') format('woff');
          }
          @font-face {
            font-family: 'IBM Plex Sans';
            font-style: italic;
            font-weight: 400;
            font-display: swap;
            src: local('IBM Plex Sans Italic'), local('IBMPlexSans-Italic'),
              url('/fonts/ibm-plex-sans-v7-latin-italic.woff2') format('woff2'),
              url('/fonts/ibm-plex-sans-v7-latin-italic.woff') format('woff');
          }
          @font-face {
            font-family: 'IBM Plex Sans';
            font-style: normal;
            font-weight: 500;
            font-display: swap;
            src: local('IBM Plex Sans Medium'), local('IBMPlexSans-Medium'),
              url('/fonts/ibm-plex-sans-v7-latin-500.woff2') format('woff2'),
              url('/fonts/ibm-plex-sans-v7-latin-500.woff') format('woff');
          }
          @font-face {
            font-family: 'IBM Plex Sans';
            font-style: normal;
            font-weight: 600;
            font-display: swap;
            src: local('IBM Plex Sans SemiBold'), local('IBMPlexSans-SemiBold'),
              url('/fonts/ibm-plex-sans-v7-latin-600.woff2') format('woff2'),
              url('/fonts/ibm-plex-sans-v7-latin-600.woff') format('woff');
          }
        `}</style>
      </Page>
    </GlobalContextProvider>
  )
}

Layout.getInitialProps = async ({ apolloClient, locale, req }) => {
  const lang = locale ?? 'is' // Defaulting to is when locale is undefined

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
          input: { id: '2foBKVNnRnoNXx9CfiM8to', lang },
        },
      })
      .then((res) => res.data.getAlertBanner),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Global',
            lang,
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
          input: { id: '5prHB8HLyh4Y35LI4bnhh2', lang },
        },
      })
      .then((res) => res.data.getGroupedMenu),
    apolloClient
      .query<GetGroupedMenuQuery, QueryGetGroupedMenuArgs>({
        query: GET_GROUPED_MENU_QUERY,
        variables: {
          input: { id: '7MeplCDXx2n01BoxRrekCi', lang },
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

type LayoutWrapper<T> = NextComponentType<
  GetInitialPropsContext<NextPageContext>,
  { layoutProps: LayoutProps; componentProps: T },
  { layoutProps: LayoutProps; componentProps: T }
>

export const withMainLayout = <T,>(
  Component: Screen<T>,
  layoutConfig: Partial<LayoutProps> = {},
): LayoutWrapper<T> => {
  const WithMainLayout: LayoutWrapper<T> = ({
    layoutProps,
    componentProps,
  }) => {
    return (
      <Layout {...layoutProps}>
        <Component {...componentProps} />
      </Layout>
    )
  }

  WithMainLayout.getInitialProps = async (ctx) => {
    const getLayoutInitialProps = Layout.getInitialProps as Exclude<
      typeof Layout.getInitialProps,
      undefined
    >

    const [layoutProps, componentProps] = await Promise.all([
      getLayoutInitialProps(ctx),
      Component.getInitialProps ? Component.getInitialProps(ctx) : ({} as T),
    ])

    const themeConfig: Partial<LayoutProps> =
      'darkTheme' in componentProps
        ? { headerColorScheme: 'white', headerButtonColorScheme: 'negative' }
        : {}

    return {
      layoutProps: { ...layoutProps, ...layoutConfig, ...themeConfig },
      componentProps,
    }
  }

  return WithMainLayout
}

export default Layout
