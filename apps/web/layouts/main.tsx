import React, { useEffect, useState } from 'react'
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
import getConfig from 'next/config'
import { NextComponentType, NextPageContext } from 'next'
import { Screen, GetInitialPropsContext } from '../types'
import Cookies from 'js-cookie'
import { userMonitoring } from '@island.is/user-monitoring'
import { useRouter } from 'next/router'
import {
  Header,
  Main,
  MobileAppBanner,
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
import { useFeatureFlag, useNamespace } from '../hooks'
import {
  formatMegaMenuCategoryLinks,
  formatMegaMenuLinks,
} from '../utils/processMenuData'
import { Locale } from '@island.is/shared/types'
import {
  LinkType,
  useLinkResolver,
  linkResolver as LinkResolver,
  pathIsRoute,
} from '../hooks/useLinkResolver'
import { stringHash } from '@island.is/web/utils/stringHash'
import { OrganizationIslandFooter } from '../components/Organization/OrganizationIslandFooter'
import Illustration from './Illustration'
import * as styles from './main.css'

const { publicRuntimeConfig = {} } = getConfig() ?? {}

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
  customAlertBanners?: GetAlertBannerQuery['getAlertBanner'][]
  languageToggleQueryParams?: Record<Locale, Record<string, string>>
  footerVersion?: 'default' | 'organization'
  respOrigin
  megaMenuData
}

if (
  publicRuntimeConfig.ddRumApplicationId &&
  publicRuntimeConfig.ddRumClientToken &&
  typeof window !== 'undefined'
) {
  userMonitoring.initDdRum({
    service: 'islandis',
    applicationId: publicRuntimeConfig.ddRumApplicationId,
    clientToken: publicRuntimeConfig.ddRumClientToken,
    env: publicRuntimeConfig.environment || 'local',
    version: publicRuntimeConfig.appVersion || 'local',
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
  customAlertBanners,
  languageToggleQueryParams,
  footerVersion = 'default',
  respOrigin,
  children,
  megaMenuData,
}) => {
  const { activeLocale, t } = useI18n()
  const { linkResolver } = useLinkResolver()
  const n = useNamespace(namespace)
  const { asPath } = useRouter()
  const fullUrl = `${respOrigin}${asPath}`

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
      ]
        .concat(
          customAlertBanners?.map((banner) => ({
            bannerId: `custom-alert-${stringHash(
              JSON.stringify(banner ?? {}),
            )}`,
            ...banner,
          })) ?? [],
        )
        .filter(
          (banner) => !Cookies.get(banner.bannerId) && banner?.showAlertBanner,
        ),
    )
  }, [
    alertBannerContent,
    articleAlertBannerContent,
    organizationAlertBannerContent,
    customAlertBanners,
  ])

  const preloadedFonts = [
    '/fonts/ibm-plex-sans-v7-latin-300.woff2',
    '/fonts/ibm-plex-sans-v7-latin-regular.woff2',
    '/fonts/ibm-plex-sans-v7-latin-italic.woff2',
    '/fonts/ibm-plex-sans-v7-latin-500.woff2',
    '/fonts/ibm-plex-sans-v7-latin-600.woff2',
  ]

  const isServiceWeb = pathIsRoute(asPath, 'serviceweb')

  return (
    <GlobalContextProvider namespace={namespace} isServiceWeb={isServiceWeb}>
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
            key={banner.bannerId}
            title={banner.title}
            description={banner.description}
            link={{
              ...(!!banner.link &&
                !!banner.linkTitle && {
                  href: linkResolver(banner.link.type as LinkType, [
                    banner.link.slug,
                  ]).href,
                  title: banner.linkTitle,
                }),
            }}
            variant={banner.bannerVariant as AlertBannerVariants}
            dismissable={banner.isDismissable}
            onDismiss={() => {
              if (banner.dismissedForDays !== 0) {
                Cookies.set(banner.bannerId, 'hide', {
                  expires: banner.dismissedForDays,
                })
              }
            }}
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
              value={{ colorScheme: headerColorScheme }}
            >
              <Header
                buttonColorScheme={headerButtonColorScheme}
                showSearchInHeader={showSearchInHeader}
                megaMenuData={megaMenuData}
                languageToggleQueryParams={languageToggleQueryParams}
              />
            </ColorSchemeContext.Provider>
          )}
          <Main>
            {wrapContent ? <Box width="full">{children}</Box> : children}
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
      'themeConfig' in componentProps ? componentProps['themeConfig'] : {}

    const organizationAlertBannerContent: GetAlertBannerQuery['getAlertBanner'] =
      'organizationPage' in componentProps
        ? componentProps['organizationPage']?.['alertBanner']
        : undefined

    const articleAlertBannerContent: GetAlertBannerQuery['getAlertBanner'] =
      'article' in componentProps
        ? componentProps['article']?.['alertBanner']
        : undefined

    const customAlertBanners =
      'customAlertBanners' in componentProps
        ? componentProps['customAlertBanners']
        : []

    const languageToggleQueryParams =
      'languageToggleQueryParams' in componentProps
        ? componentProps['languageToggleQueryParams']
        : undefined

    return {
      layoutProps: {
        ...layoutProps,
        ...layoutConfig,
        ...themeConfig,
        organizationAlertBannerContent,
        articleAlertBannerContent,
        customAlertBanners,
        languageToggleQueryParams,
      },
      componentProps,
    }
  }

  return WithMainLayout
}

export default Layout
