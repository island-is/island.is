import React from 'react'
import Head from 'next/head'
import { Page, Box, FooterLinkProps, Footer } from '@island.is/island-ui/core'
import { Header, PageLoader, FixedNav, SkipToMainContent } from '../components'
import { NextComponentType, NextPageContext } from 'next'
import { GetInitialPropsContext } from '../types'
import {
  Query,
  QueryGetMenuArgs,
  QueryCategoriesArgs,
  ContentLanguage,
} from '@island.is/api/schema'
import { GET_MENU_QUERY } from '../screens/queries/Menu'
import { GET_CATEGORIES_QUERY } from '../screens/queries'

interface LayoutProps {
  showSearchInHeader?: boolean
  wrapContent?: boolean
  showHeader?: boolean
  showFooter?: boolean
  footerUpperMenu?: FooterLinkProps[]
  footerLowerMenu?: FooterLinkProps[]
  footerMiddleMenu?: FooterLinkProps[]
  footerTagsMenu?: FooterLinkProps[]
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
  footerUpperMenu,
  footerLowerMenu,
  footerMiddleMenu,
  footerTagsMenu,
  children,
}) => {
  return (
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
      <SkipToMainContent />
      <PageLoader />
      <FixedNav />
      {showHeader && <Header showSearchInHeader={showSearchInHeader} />}
      <div id="main-content">
        {wrapContent ? <Box width="full">{children}</Box> : children}
      </div>
      {showFooter && (
        <Footer
          topLinks={footerUpperMenu}
          bottomLinks={footerLowerMenu}
          middleLinks={footerMiddleMenu}
          tagLinks={footerTagsMenu}
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
  )
}

Layout.getInitialProps = async ({ apolloClient, locale }) => {
  const [upperMenu, lowerMenu, middleMenu, tagsMenu] = await Promise.all([
    apolloClient
      .query<Query, QueryGetMenuArgs>({
        query: GET_MENU_QUERY,
        variables: {
          input: { name: 'Footer upper', lang: locale },
        },
      })
      .then((result) => result.data.getMenu),
    apolloClient
      .query<Query, QueryGetMenuArgs>({
        query: GET_MENU_QUERY,
        variables: {
          input: { name: 'Footer lower', lang: locale },
        },
      })
      .then((result) => result.data.getMenu),
    apolloClient
      .query<Query, QueryCategoriesArgs>({
        query: GET_CATEGORIES_QUERY,
        variables: {
          input: {
            language: locale as ContentLanguage,
          },
        },
      })
      .then((result) => {
        const categories = result.data.categories

        return {
          links: categories.map(({ title, slug }) => {
            return {
              text: title,
              url: `${locale === 'en' ? '/en/category' : '/flokkur'}/${slug}`,
            }
          }),
        }
      }),
    apolloClient
      .query<Query, QueryGetMenuArgs>({
        query: GET_MENU_QUERY,
        variables: {
          input: { name: 'Footer middle', lang: locale },
        },
      })
      .then((result) => result.data.getMenu),
    apolloClient
      .query<Query, QueryGetMenuArgs>({
        query: GET_MENU_QUERY,
        variables: {
          input: { name: 'Footer tags', lang: locale },
        },
      })
      .then((result) => result.data.getMenu),
  ])

  const upperMenuLinks = upperMenu ? upperMenu.links : []
  const lowerMenuLinks = lowerMenu ? lowerMenu.links : []
  const middleMenuLinks = middleMenu ? middleMenu.links : []
  const tagsMenuLinks = middleMenu ? middleMenu.links : []

  return {
    footerUpperMenu: upperMenuLinks.map(({ text, url }) => ({
      title: text,
      href: url,
    })),
    footerLowerMenu: lowerMenuLinks.map(({ text, url }) => ({
      title: text,
      href: url,
    })),
    footerTagsMenu: tagsMenuLinks.map(({ text, url }) => ({
      title: text,
      href: url,
    })),
    footerMiddleMenu: middleMenuLinks.map(({ text, url }) => ({
      title: text,
      href: url,
    })),
  }
}

export default Layout
