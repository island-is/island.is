import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import getConfig from 'next/config'
import Head from 'next/head'
import { useRouter } from 'next/router'

import {
  AlertBanner,
  AlertBannerVariants,
  Box,
  ButtonTypes,
  ColorSchemeContext,
  ColorSchemes,
  Footer,
  FooterLinkProps,
  Hidden,
  Page,
} from '@island.is/island-ui/core'
import { CACHE_CONTROL_HEADER } from '@island.is/shared/constants'
import { Locale } from '@island.is/shared/types'
import { stringHash } from '@island.is/shared/utils'
import { userMonitoring } from '@island.is/user-monitoring'
import {
  Header,
  Main,
  MobileAppBanner,
  PageLoader,
  SkipToMainContent,
} from '@island.is/web/components'

import { OrganizationIslandFooter } from '../components/Organization/OrganizationIslandFooter'
import { PRELOADED_FONTS } from '../constants'
import { GlobalContextProvider } from '../context'
import { MenuTabsContext } from '../context/MenuTabsContext/MenuTabsContext'
import {
  ContentLanguage,
  GetAlertBannerQuery,
  GetArticleCategoriesQuery,
  GetGroupedMenuQuery,
  GetNamespaceQuery,
  GetOrganizationPageQuery,
  GetSingleArticleQuery,
  Menu,
  QueryGetAlertBannerArgs,
  QueryGetArticleCategoriesArgs,
  QueryGetGroupedMenuArgs,
  QueryGetNamespaceArgs,
} from '../graphql/schema'
import { useNamespace } from '../hooks'
import {
  linkResolver as LinkResolver,
  LinkType,
  pathIsRoute,
  useLinkResolver,
} from '../hooks/useLinkResolver'
import { getLocaleFromPath, useI18n } from '../i18n'
import { GET_CATEGORIES_QUERY, GET_NAMESPACE_QUERY } from '../screens/queries'
import { GET_ALERT_BANNER_QUERY } from '../screens/queries/AlertBanner'
import { GET_GROUPED_MENU_QUERY } from '../screens/queries/Menu'
import { Screen, ScreenContext } from '../types'
import { extractOrganizationSlugFromPathname } from '../utils/organization'
import {
  formatMegaMenuCategoryLinks,
  formatMegaMenuLinks,
} from '../utils/processMenuData'
import Illustration from './Illustration'
import * as styles from './main.css'

const { publicRuntimeConfig = {} } = getConfig() ?? {}

const IS_MOCK =
  process.env.NODE_ENV !== 'production' && process.env.API_MOCKS === 'true'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error make web strict
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
  showFooterIllustration?: boolean
  categories: GetArticleCategoriesQuery['getArticleCategories']
  topMenuCustomLinks?: FooterLinkProps[]
  footerUpperInfo?: FooterLinkProps[]
  footerUpperContact?: FooterLinkProps[]
  footerLowerMenu?: FooterLinkProps[]
  footerMiddleMenu?: FooterLinkProps[]
  footerTagsMenu?: FooterLinkProps[]
  namespace: Record<string, string | string[]>
  alertBannerContent?: GetAlertBannerQuery['getAlertBanner']
  organizationAlertBannerContent?: GetAlertBannerQuery['getAlertBanner']
  articleAlertBannerContent?: GetAlertBannerQuery['getAlertBanner']
  customAlertBannerContent?: GetAlertBannerQuery['getAlertBanner']
  languageToggleQueryParams?: Record<Locale, Record<string, string>>
  languageToggleHrefOverride?: {
    is: string
    en: string
  }
  footerVersion?: 'default' | 'organization'
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error make web strict
  respOrigin
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error make web strict
  megaMenuData
  customTopLoginButtonItem: LayoutComponentProps['customTopLoginButtonItem']
  children?: React.ReactNode
}

if (publicRuntimeConfig.ddLogsClientToken && typeof window !== 'undefined') {
  userMonitoring.initDdLogs({
    service: 'islandis',
    clientToken: publicRuntimeConfig.ddLogsClientToken,
    env: publicRuntimeConfig.environment || 'local',
    version: publicRuntimeConfig.appVersion || 'local',
  })
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error make web strict
const Layout: Screen<LayoutProps> = ({
  showSearchInHeader = true,
  wrapContent = true,
  showHeader = true,
  headerColorScheme,
  headerButtonColorScheme,
  showFooter = true,
  showFooterIllustration = false,
  categories,
  topMenuCustomLinks,
  footerUpperInfo,
  footerUpperContact,
  footerLowerMenu,
  footerMiddleMenu,
  namespace,
  alertBannerContent,
  organizationAlertBannerContent,
  articleAlertBannerContent,
  customAlertBannerContent,
  languageToggleQueryParams,
  footerVersion = 'default',
  respOrigin,
  children,
  megaMenuData,
  customTopLoginButtonItem,
  languageToggleHrefOverride,
}) => {
  const { activeLocale, t } = useI18n()
  const { linkResolver } = useLinkResolver()
  const n = useNamespace(namespace)
  const router = useRouter()
  const fullUrl = `${respOrigin}${router.asPath}`

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

  const [alertBanners, setAlertBanners] = useState([])

  useEffect(() => {
    setAlertBanners(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error make web strict
      [
        {
          bannerId: `alert-${stringHash(
            JSON.stringify(alertBannerContent ?? {}),
          )}`,
          ...alertBannerContent,
        },
        {
          bannerId: `organization-alert-${stringHash(
            JSON.stringify(organizationAlertBannerContent ?? {}),
          )}`,
          ...organizationAlertBannerContent,
        },
        {
          bannerId: `article-alert-${stringHash(
            JSON.stringify(articleAlertBannerContent ?? {}),
          )}`,
          ...articleAlertBannerContent,
        },
        {
          bannerId: `custom-alert-${stringHash(
            JSON.stringify(customAlertBannerContent ?? {}),
          )}`,
          ...customAlertBannerContent,
        },
      ].filter(
        (banner) => !Cookies.get(banner.bannerId) && banner?.showAlertBanner,
      ),
    )
  }, [
    alertBannerContent,
    articleAlertBannerContent,
    organizationAlertBannerContent,
    customAlertBannerContent,
  ])

  // Update html lang in case a route change leads us to a new locale
  useEffect(() => {
    const handleRouteChange = () => {
      const language = getLocaleFromPath(router.asPath)
      document.documentElement.lang = language
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.asPath, router.events])

  const isServiceWeb = pathIsRoute(router.asPath, 'serviceweb', activeLocale)

  const organizationSearchFilter = extractOrganizationSlugFromPathname(
    router.asPath,
    activeLocale,
  )

  return (
    <GlobalContextProvider namespace={namespace} isServiceWeb={isServiceWeb}>
      <Page component="div">
        <Head>
          {PRELOADED_FONTS.map((href, index) => {
            return (
              <link
                key={index}
                rel="preload"
                href={href}
                as="font"
                type="font/woff2"
                crossOrigin="anonymous"
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
        {alertBanners.map((banner) => (
          <AlertBanner
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error make web strict
            key={banner.bannerId}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error make web strict
            title={banner.title}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error make web strict
            description={banner.description}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error make web strict
            link={{
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error make web strict
              ...(!!banner.link &&
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error make web strict
                !!banner.linkTitle && {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-expect-error make web strict
                  href: linkResolver(banner.link.type as LinkType, [
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error make web strict
                    banner.link.slug,
                  ]).href,
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-expect-error make web strict
                  title: banner.linkTitle,
                }),
            }}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error make web strict
            variant={banner.bannerVariant as AlertBannerVariants}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error make web strict
            dismissable={banner.isDismissable}
            onDismiss={() => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error make web strict
              if (banner.dismissedForDays !== 0) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error make web strict
                Cookies.set(banner.bannerId, 'hide', {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-expect-error make web strict
                  expires: banner.dismissedForDays,
                })
              }
            }}
            closeButtonLabel={activeLocale === 'is' ? 'Loka' : 'Close'}
          />
        ))}
        <Hidden above="sm">
          <MobileAppBanner namespace={namespace} />
        </Hidden>
        <PageLoader />
        <MenuTabsContext.Provider
          value={{
            menuTabs,
          }}
        >
          {showHeader && (
            <ColorSchemeContext.Provider
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error make web strict
              value={{ colorScheme: headerColorScheme }}
            >
              <Header
                buttonColorScheme={headerButtonColorScheme}
                showSearchInHeader={showSearchInHeader}
                megaMenuData={megaMenuData}
                languageToggleQueryParams={languageToggleQueryParams}
                organizationSearchFilter={organizationSearchFilter}
                searchPlaceholder={
                  organizationSearchFilter
                    ? n(
                        'organizationPageSearchPlaceholder',
                        activeLocale === 'is' ? 'Leita' : 'Search',
                      )
                    : undefined
                }
                customTopLoginButtonItem={customTopLoginButtonItem}
                loginButtonType={n('minarsidurLoginButtonType', 'dropdown')}
                languageToggleHrefOverride={languageToggleHrefOverride}
              />
            </ColorSchemeContext.Provider>
          )}
          <Main>
            {wrapContent ? (
              <Box width="full" display="flex" flexDirection="column">
                {children}
              </Box>
            ) : (
              children
            )}
          </Main>
        </MenuTabsContext.Provider>
        {showFooter && (
          <Hidden print={true}>
            {footerVersion === 'default' && (
              <>
                {showFooterIllustration && (
                  <Illustration className={styles.illustration} />
                )}
                <Footer
                  topLinks={footerUpperInfo}
                  topLinksContact={footerUpperContact}
                  bottomLinks={footerLowerMenu}
                  middleLinks={footerMiddleMenu}
                  bottomLinksTitle={t.siteExternalTitle}
                  middleLinksTitle={String(namespace.footerMiddleLabel)}
                  languageSwitchLink={{
                    title: activeLocale === 'en' ? 'Íslenska' : 'English',
                    href: activeLocale === 'en' ? '/' : '/en',
                  }}
                  privacyPolicyLink={{
                    title: n('privacyPolicyTitle', 'Persónuverndarstefna'),
                    href: n(
                      'privacyPolicyHref',
                      '/personuverndarstefna-stafraent-islands',
                    ),
                  }}
                  termsLink={{
                    title: n('termsTitle', 'Skilmálar'),
                    href: n('termsHref', '/skilmalar-island-is'),
                  }}
                  showMiddleLinks
                />
              </>
            )}
            {footerVersion === 'organization' && <OrganizationIslandFooter />}
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
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error make web strict
Layout.getProps = async ({ apolloClient, locale, req }) => {
  const lang = locale ?? 'is' // Defaulting to is when locale is undefined

  const { origin } = absoluteUrl(req, 'localhost:4200')
  const respOrigin = `${origin}`
  const [categories, alertBanner, namespace, megaMenuData, footerMenuData] =
    await Promise.all([
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
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error make web strict
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error make web strict
  const [asideTopLinksData, asideBottomLinksData] = megaMenuData.menus

  const mapLinks = (item: Menu) =>
    item.menuLinks
      .filter((x) => x?.link?.slug && x?.link?.type)
      .map((x) => {
        // These will be strings due to the .filter()
        const type = x.link?.type as string
        const slug = x.link?.slug as string

        const href = LinkResolver(
          type as LinkType,
          [slug],
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error make web strict
  const footerMenu = footerMenuData.menus.reduce((menus, menu, idx) => {
    if (IS_MOCK) {
      const key = Object.keys(menus)[idx]
      if (key) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error make web strict
        menus[key] = mapLinks(menu as Menu)
      }
      return menus
    }

    switch (menu.id) {
      // Footer lower
      case '6vTuiadpCKOBhAlSjYY8td':
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error make web strict
        menus.footerLowerMenu = mapLinks(menu as Menu)
        break
      // Footer middle
      case '7hSbSQm5F5EBc0KxPTFVAS':
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error make web strict
        menus.footerMiddleMenu = mapLinks(menu as Menu)
        break
      // Footer tags
      case '6oGQDyWos4xcKX9BdMHd5R':
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error make web strict
        menus.footerTagsMenu = mapLinks(menu as Menu)
        break
      // Footer upper
      case '62Zh6hUc3bi0JwNRnqV8Nm':
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error make web strict
        menus.footerUpperInfo = mapLinks(menu as Menu)
        break
      // Footer upper contact
      case '5yUCZ4U6aZ8rZ9Jigme7GI':
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error make web strict
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
        alertBanner?.showAlertBanner &&
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

type LayoutWrapper<T, C = ScreenContext> = Screen<
  { layoutProps: LayoutProps; componentProps: T },
  C
>

interface LayoutComponentProps {
  themeConfig?: Partial<LayoutProps>
  organizationPage?: GetOrganizationPageQuery['getOrganizationPage']
  article?: GetSingleArticleQuery['getSingleArticle']
  customAlertBanner?: GetAlertBannerQuery['getAlertBanner']
  languageToggleQueryParams?: LayoutProps['languageToggleQueryParams']
  customTopLoginButtonItem?: {
    href: string
    imgSrc: string
    label: string
    buttonType: string
    blacklistedPathnames?: string[]
  }
  languageToggleHrefOverride?: {
    is: string
    en: string
  }
}

export const withMainLayout = <T, C extends ScreenContext>(
  Component: Screen<T, C>,
  layoutConfig: Partial<LayoutProps> = {},
): LayoutWrapper<T, C> => {
  const WithMainLayout: LayoutWrapper<T, C> = ({
    layoutProps,
    componentProps,
  }) => {
    return (
      <Layout {...layoutProps}>
        {/**
         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
         // @ts-expect-error make web strict */}
        <Component {...componentProps} />
      </Layout>
    )
  }

  WithMainLayout.getProps = async (ctx) => {
    // Configure default full-page caching.
    if (ctx.res) {
      ctx.res.setHeader('Cache-Control', CACHE_CONTROL_HEADER)
    }

    const getLayoutProps = Layout.getProps as Exclude<
      typeof Layout.getProps,
      undefined
    >

    const [layoutProps, componentProps] = await Promise.all([
      getLayoutProps(ctx),
      Component.getProps ? Component.getProps(ctx) : ({} as T),
    ])
    const layoutComponentProps = componentProps as LayoutComponentProps

    const themeConfig = layoutComponentProps?.themeConfig ?? {}
    const organizationAlertBannerContent =
      layoutComponentProps?.organizationPage?.alertBanner
    const articleAlertBannerContent = layoutComponentProps?.article?.alertBanner
    const customAlertBannerContent = layoutComponentProps?.customAlertBanner
    const languageToggleQueryParams =
      layoutComponentProps?.languageToggleQueryParams

    const customTopLoginButtonItem =
      layoutComponentProps?.customTopLoginButtonItem

    const languageToggleHrefOverride =
      layoutComponentProps?.languageToggleHrefOverride

    return {
      layoutProps: {
        ...layoutProps,
        ...layoutConfig,
        ...themeConfig,
        organizationAlertBannerContent,
        articleAlertBannerContent,
        customAlertBannerContent,
        languageToggleQueryParams,
        customTopLoginButtonItem,
        languageToggleHrefOverride,
      },
      componentProps,
    }
  }

  return WithMainLayout
}

export default Layout
