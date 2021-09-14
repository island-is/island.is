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
import {
  GetAlertBannerQuery,
  GetArticleCategoriesQuery,
} from '../graphql/schema'
import { GlobalContextProvider } from '../context'
import { MenuTabsContext } from '../context/MenuTabsContext/MenuTabsContext'
import { useI18n } from '../i18n'
import { environment } from '../environments'
import { useNamespace } from '../hooks'
import { Locale } from '@island.is/shared/types'
import { LinkType, useLinkResolver } from '../hooks/useLinkResolver'
import { stringHash } from '@island.is/web/utils/stringHash'
import { getMainLayoutData } from '../data'

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

export const Layout: NextComponentType<
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
  const layoutData = await getMainLayoutData(
    locale as Locale,
    req,
    apolloClient,
  )

  return {
    ...layoutData,
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
