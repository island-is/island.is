import React from 'react'
import Head from 'next/head'
import {
  Page,
  Box,
  FooterLinkProps,
  Footer,
  AlertBanner,
  AlertBannerVariants,
} from '@island.is/island-ui/core'
import { NextComponentType, NextPageContext } from 'next'
import { Screen, GetInitialPropsContext } from '../types'
import { MD5 } from 'crypto-js'
import Cookies from 'js-cookie'

import { Header, PageLoader, FixedNav, SkipToMainContent } from '../components'
import { GET_MENU_QUERY } from '../screens/queries/Menu'
import { GET_CATEGORIES_QUERY, GET_NAMESPACE_QUERY } from '../screens/queries'
import {
  QueryGetMenuArgs,
  GetMenuQuery,
  GetNamespaceQuery,
  QueryGetNamespaceArgs,
  ContentLanguage,
  GetAlertBannerQuery,
  QueryGetAlertBannerArgs,
  GetArticleCategoriesQuery,
  QueryGetArticleCategoriesArgs,
} from '../graphql/schema'
import { GlobalNamespaceContext } from '../context/GlobalNamespaceContext/GlobalNamespaceContext'
import { MenuTabsContext } from '../context/MenuTabsContext/MenuTabsContext'
import routeNames from '../i18n/routeNames'
import { useI18n } from '../i18n'
import { GET_ALERT_BANNER_QUERY } from '../screens/queries/AlertBanner'
import { AlertBanner as AlertBannerSchema } from '@island.is/api/schema'

export interface LayoutProps {
  showSearchInHeader?: boolean
  wrapContent?: boolean
  showHeader?: boolean
  showFooter?: boolean
  categories: GetArticleCategoriesQuery['getArticleCategories']
  topMenuCustomLinks?: FooterLinkProps[]
  footerUpperMenu?: FooterLinkProps[]
  footerLowerMenu?: FooterLinkProps[]
  footerMiddleMenu?: FooterLinkProps[]
  footerTagsMenu?: FooterLinkProps[]
  namespace: Record<string, string | string[]>
  alertBannerContent?: AlertBannerSchema
}

const Layout: NextComponentType<
  GetInitialPropsContext<NextPageContext>,
  LayoutProps,
  LayoutProps
> = ({
  showSearchInHeader = true,
  wrapContent = true,
  showHeader = true,
  showFooter = true,
  categories,
  topMenuCustomLinks,
  footerUpperMenu,
  footerLowerMenu,
  footerMiddleMenu,
  footerTagsMenu,
  namespace,
  alertBannerContent,
  children,
}) => {
  const { activeLocale, t } = useI18n()
  const { makePath } = routeNames(activeLocale)

  const menuTabs = [
    {
      title: t.serviceCategories,
      externalLinksHeading: t.serviceCategories,
      links: categories.map((x) => {
        return {
          title: x.title,
          as: makePath(x.__typename, x.slug),
          href: makePath(x.__typename, '[slug]'),
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

  const alertBannerId = MD5(JSON.stringify(alertBannerContent)).toString()
  return (
    <GlobalNamespaceContext.Provider value={{ globalNamespace: namespace }}>
      <Page>
        <Head>
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
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
          <meta
            name="description"
            content="Ísland.is er upplýsinga- og þjónustuveita opinberra aðila á Íslandi. Þar getur fólk og fyrirtæki fengið upplýsingar og notið margvíslegrar þjónustu hjá opinberum aðilum á einum stað í gegnum eina gátt."
          />
          <title>Ísland.is</title>
        </Head>
        {!Cookies.get(alertBannerId) && alertBannerContent.showAlertBanner && (
          <AlertBanner
            title={alertBannerContent.title}
            description={alertBannerContent.description}
            link={{
              href: alertBannerContent.link.url,
              title: alertBannerContent.link.text,
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
        <SkipToMainContent />
        <PageLoader />
        <MenuTabsContext.Provider
          value={{
            menuTabs,
          }}
        >
          <FixedNav />
          {showHeader && <Header showSearchInHeader={showSearchInHeader} />}
          <div id="main-content">
            {wrapContent ? <Box width="full">{children}</Box> : children}
          </div>
        </MenuTabsContext.Provider>
        {showFooter && (
          <Footer
            topLinks={footerUpperMenu}
            bottomLinks={footerLowerMenu}
            middleLinks={footerMiddleMenu}
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
    </GlobalNamespaceContext.Provider>
  )
}

Layout.getInitialProps = async ({ apolloClient, locale }) => {
  const lang = locale ?? 'is' // Defaulting to is when locale is undefined

  const [
    categories,
    topMenuCustomLinks,
    alertBanner,
    upperMenu,
    lowerMenu,
    middleMenu,
    tagsMenu,
    namespace,
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
      .query<GetMenuQuery, QueryGetMenuArgs>({
        query: GET_MENU_QUERY,
        variables: {
          input: { name: 'Top menu custom links', lang },
        },
      })
      .then((res) => res.data.getMenu),
    apolloClient
      .query<GetAlertBannerQuery, QueryGetAlertBannerArgs>({
        query: GET_ALERT_BANNER_QUERY,
        variables: {
          input: { id: '2foBKVNnRnoNXx9CfiM8to', lang },
        },
      })
      .then((res) => res.data.getAlertBanner),
    apolloClient
      .query<GetMenuQuery, QueryGetMenuArgs>({
        query: GET_MENU_QUERY,
        variables: {
          input: { name: 'Footer upper', lang },
        },
      })
      .then((res) => res.data.getMenu),
    apolloClient
      .query<GetMenuQuery, QueryGetMenuArgs>({
        query: GET_MENU_QUERY,
        variables: {
          input: { name: 'Footer lower', lang },
        },
      })
      .then((res) => res.data.getMenu),
    apolloClient
      .query<GetMenuQuery, QueryGetMenuArgs>({
        query: GET_MENU_QUERY,
        variables: {
          input: { name: 'Footer middle', lang },
        },
      })
      .then((res) => res.data.getMenu),
    apolloClient
      .query<GetMenuQuery, QueryGetMenuArgs>({
        query: GET_MENU_QUERY,
        variables: {
          input: { name: 'Footer tags', lang },
        },
      })
      .then((res) => res.data.getMenu),
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
  ])

  return {
    categories,
    topMenuCustomLinks: (topMenuCustomLinks.links ?? []).map(
      ({ text, url }) => ({
        title: text,
        href: url,
      }),
    ),
    alertBannerContent: alertBanner,
    footerUpperMenu: (upperMenu.links ?? []).map(({ text, url }) => ({
      title: text,
      href: url,
    })),
    footerLowerMenu: (lowerMenu.links ?? []).map(({ text, url }) => ({
      title: text,
      href: url,
    })),
    footerTagsMenu: (tagsMenu.links ?? []).map(({ text, url }) => ({
      title: text,
      href: url,
    })),
    footerMiddleMenu: (middleMenu.links ?? []).map(({ text, url }) => ({
      title: text,
      href: url,
    })),
    namespace,
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
    const [layoutProps, componentProps] = await Promise.all([
      Layout.getInitialProps(ctx),
      Component.getInitialProps(ctx),
    ])

    return { layoutProps: { ...layoutProps, ...layoutConfig }, componentProps }
  }

  return WithMainLayout
}

export default Layout
