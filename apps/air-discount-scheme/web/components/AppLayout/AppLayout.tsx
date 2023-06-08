import React, { useState } from 'react'
import Head from 'next/head'
import { gql } from '@apollo/client'
import { NextComponentType, NextPageContext } from 'next'

import {
  Box,
  Footer,
  Page,
  FooterLinkProps,
  GridContainer,
} from '@island.is/island-ui/core'

import { ErrorBoundary, Header } from '../../components'
import { UserContext } from '../../context'
import { GetInitialPropsContext, Routes } from '../../types'
import {
  Query,
  QueryGetMenuArgs,
  QueryGetNamespaceArgs,
} from '@island.is/api/schema'
import { useI18n } from '../../i18n'

interface AppLayoutProps {
  children?: React.ReactNode
  showSearchInHeader?: boolean
  wrapContent?: boolean
  showHeader?: boolean
  showFooter?: boolean
  footerUpperMenu?: FooterLinkProps[]
  footerLowerMenu?: FooterLinkProps[]
  footerMiddleMenu?: FooterLinkProps[]
  footerTagsMenu?: FooterLinkProps[]
  namespace: any
  routeKey: keyof Routes
  localeKey: string
}

export const AppLayout: NextComponentType<
  GetInitialPropsContext<NextPageContext>,
  AppLayoutProps,
  AppLayoutProps
> = ({
  children,
  footerUpperMenu,
  footerLowerMenu,
  namespace,
  routeKey,
  localeKey,
}) => {
  const [user, setUser] = useState(null)
  const { toRoute, activeLocale, switchLanguage } = useI18n()
  const nextLanguage = activeLocale === 'is' ? 'en' : 'is'
  const languageRoute: FooterLinkProps = {
    title: nextLanguage === 'en' ? 'English' : 'Íslenska',
    href: toRoute(routeKey, nextLanguage),
  }

  const islandHref = 'https://island.is'
  const noEmptyOrHash = ({ href }) => href && href !== '#'
  const mapLocalLinks = (link) =>
    link.href.substring(0, 1) === '/'
      ? { ...link, href: islandHref + link.href }
      : link
  const footerUpperMenuFiltered = footerUpperMenu
    .filter(noEmptyOrHash)
    .map(mapLocalLinks)
  const footerLowerMenuFiltered = footerLowerMenu
    .filter(noEmptyOrHash)
    .map(mapLocalLinks)
  const footerMiddleMenuFiltered = [] // footerMiddleMenu.filter(noEmptyOrHash)

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
          name="url"
          property="og:url"
          content="https://loftbru.island.is"
        />
        <meta name="title" property="og:title" content="Ísland.is" />
        <meta
          name="image"
          property="og:image"
          content="https://loftbru.island.is/og-img.png?version=1"
        />
        <meta name="image-width" property="og:image:width" content="1200" />
        <meta name="image-height" property="og:image:height" content="630" />
        <meta
          name="description"
          property="og:description"
          content="Ísland.is er upplýsinga- og þjónustuveita opinberra aðila á Íslandi. Þar getur fólk og fyrirtæki fengið upplýsingar og notið margvíslegrar þjónustu hjá opinberum aðilum á einum stað í gegnum eina gátt."
        />
        <title>Ísland.is</title>
      </Head>
      <GridContainer>
        <Header routeKey={routeKey} localeKey={localeKey} />
      </GridContainer>
      <Box paddingTop={[5, 5, 9]} paddingBottom={[7, 7, 12]}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </Box>
      <Footer
        topLinks={footerUpperMenuFiltered}
        topLinksContact={[]}
        bottomLinks={footerLowerMenuFiltered}
        middleLinks={footerMiddleMenuFiltered}
        middleLinksTitle={namespace.footerMiddleLabel}
        showMiddleLinks={footerMiddleMenuFiltered.length > 0}
        languageSwitchLink={languageRoute}
        languageSwitchOnClick={() => {
          switchLanguage(null, nextLanguage)
        }}
      />
      <style jsx global>{`
        @font-face {
          font-family: 'IBM Plex Sans';
          font-style: normal;
          font-weight: 300;
          font-display: swap;
          src: local('IBM Plex Sans Light'), local('IBMPlexSans-Light'),
            url('/fonts/ibm-plex/ibm-plex-sans-v7-latin-300.woff2')
              format('woff2'),
            url('/fonts/ibm-plex/ibm-plex-sans-v7-latin-300.woff')
              format('woff');
        }
        @font-face {
          font-family: 'IBM Plex Sans';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: local('IBM Plex Sans'), local('IBMPlexSans'),
            url('/fonts/ibm-plex/ibm-plex-sans-v7-latin-regular.woff2')
              format('woff2'),
            url('/fonts/ibm-plex/ibm-plex-sans-v7-latin-regular.woff')
              format('woff');
        }
        @font-face {
          font-family: 'IBM Plex Sans';
          font-style: italic;
          font-weight: 400;
          font-display: swap;
          src: local('IBM Plex Sans Italic'), local('IBMPlexSans-Italic'),
            url('/fonts/ibm-plex/ibm-plex-sans-v7-latin-italic.woff2')
              format('woff2'),
            url('/fonts/ibm-plex/ibm-plex-sans-v7-latin-italic.woff')
              format('woff');
        }
        @font-face {
          font-family: 'IBM Plex Sans';
          font-style: normal;
          font-weight: 500;
          font-display: swap;
          src: local('IBM Plex Sans Medium'), local('IBMPlexSans-Medium'),
            url('/fonts/ibm-plex/ibm-plex-sans-v7-latin-500.woff2')
              format('woff2'),
            url('/fonts/ibm-plex/ibm-plex-sans-v7-latin-500.woff')
              format('woff');
        }
        @font-face {
          font-family: 'IBM Plex Sans';
          font-style: normal;
          font-weight: 600;
          font-display: swap;
          src: local('IBM Plex Sans SemiBold'), local('IBMPlexSans-SemiBold'),
            url('/fonts/ibm-plex/ibm-plex-sans-v7-latin-600.woff2')
              format('woff2'),
            url('/fonts/ibm-plex/ibm-plex-sans-v7-latin-600.woff')
              format('woff');
        }
      `}</style>
    </Page>
  )
}

const GetMenuQuery = gql`
  query GetMenu($input: GetMenuInput!) {
    getMenu(input: $input) {
      title
      links {
        text
        url
      }
    }
  }
`
export const GetNamespaceQuery = gql`
  query GetNamespace($input: GetNamespaceInput!) {
    getNamespace(input: $input) {
      fields
    }
  }
`

AppLayout.getInitialProps = async ({
  apolloClient,
  locale,
  routeKey,
  localeKey,
}) => {
  const [upperMenu, lowerMenu, middleMenu, tagsMenu, namespace] =
    await Promise.all([
      apolloClient
        .query<Query, QueryGetMenuArgs>({
          query: GetMenuQuery,
          variables: {
            input: { name: 'Footer upper', lang: locale },
          },
        })
        .then((result) => result.data.getMenu),
      apolloClient
        .query<Query, QueryGetMenuArgs>({
          query: GetMenuQuery,
          variables: {
            input: { name: 'Footer lower', lang: locale },
          },
        })
        .then((result) => result.data.getMenu),
      apolloClient
        .query<Query, QueryGetMenuArgs>({
          query: GetMenuQuery,
          variables: {
            input: { name: 'Footer middle', lang: locale },
          },
        })
        .then((result) => result.data.getMenu),
      apolloClient
        .query<Query, QueryGetMenuArgs>({
          query: GetMenuQuery,
          variables: {
            input: { name: 'Footer tags', lang: locale },
          },
        })
        .then((result) => result.data.getMenu),
      apolloClient
        .query<Query, QueryGetNamespaceArgs>({
          query: GetNamespaceQuery,
          variables: {
            input: {
              namespace: 'Global',
              lang: locale,
            },
          },
        })
        .then((content) => {
          // map data here to reduce data processing in component
          return JSON.parse(content.data.getNamespace.fields)
        }),
    ])

  const upperMenuLinks = upperMenu ? upperMenu.links : []
  const lowerMenuLinks = lowerMenu ? lowerMenu.links : []
  const middleMenuLinks = middleMenu ? middleMenu.links : []
  const tagsMenuLinks = tagsMenu ? tagsMenu.links : []

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
    namespace,
    routeKey,
    localeKey,
  }
}

export default AppLayout
