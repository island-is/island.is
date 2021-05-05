/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { NavigationItem } from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  ContentLanguage,
  GetNewsQuery,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import {
  GET_NAMESPACE_QUERY,
  GET_NEWS_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
} from '../queries'
import { Screen } from '../../types'
import { useNamespace } from '@island.is/web/hooks'
import {
  LatestNewsSection,
  lightThemes,
  OrganizationSlice,
  OrganizationWrapper,
  Section,
  SidebarCard,
} from '@island.is/web/components'
import { CustomNextError } from '@island.is/web/units/errors'
import getConfig from 'next/config'
import { QueryGetNewsArgs } from '@island.is/api/schema'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { NEWS_TAGS } from '@island.is/web/screens/Organization/NewsList'

const { publicRuntimeConfig } = getConfig()

interface HomeProps {
  news: GetNewsQuery['getNews']['items']
  organizationPage: Query['getOrganizationPage']
  namespace: Query['getNamespace']
}

const Home: Screen<HomeProps> = ({ news, organizationPage, namespace }) => {
  const { disableSyslumennPage: disablePage } = publicRuntimeConfig
  if (disablePage === 'true') {
    throw new CustomNextError(404, 'Not found')
  }

  const n = useNamespace(namespace)
  useContentfulId(organizationPage.id)

  const navList: NavigationItem[] = organizationPage.menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink.text,
      href: primaryLink.url,
      active: false,
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
      })),
    }),
  )

  return (
    <OrganizationWrapper
      pageTitle={organizationPage.title}
      pageDescription={organizationPage.description}
      organizationPage={organizationPage}
      pageFeaturedImage={organizationPage.featuredImage}
      fullWidthContent={true}
      navigationData={{
        title: n('navigationTitle', 'Efnisyfirlit'),
        items: navList,
      }}
      mainContent={organizationPage.slices.map((slice) => (
        <OrganizationSlice
          key={slice.id}
          slice={slice}
          namespace={namespace}
          fullWidth={true}
        />
      ))}
      sidebarContent={organizationPage.sidebarCards.map((card) => (
        <SidebarCard key={card.id} sidebarCard={card} />
      ))}
    >
      {!!news.length && (
        <Section
          paddingTop={[8, 8, 6]}
          paddingBottom={[8, 8, 6]}
          background="purple100"
          aria-labelledby="latestNewsTitle"
        >
          <LatestNewsSection
            label={n('newsAndAnnouncements', 'Fréttir og tilkynningar')}
            labelId="latestNewsTitle"
            items={news}
            linkType="organizationnews"
            overview="organizationnewsoverview"
            parameters={[organizationPage.slug]}
          />
        </Section>
      )}
    </OrganizationWrapper>
  )
}

Home.getInitialProps = async ({ apolloClient, locale, query }) => {
  const [
    {
      data: {
        getNews: { items: news },
      },
    },
    {
      data: { getOrganizationPage },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<GetNewsQuery, QueryGetNewsArgs>({
      query: GET_NEWS_QUERY,
      variables: {
        input: {
          size: 3,
          lang: locale as ContentLanguage,
          tag: NEWS_TAGS[query.slug as string] ?? '',
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug: query.slug as string,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Syslumenn',
            lang: locale,
          },
        },
      })
      .then((variables) =>
        variables.data.getNamespace.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
  ])

  if (!getOrganizationPage) {
    throw new CustomNextError(404, 'Organization not found')
  }

  const lightTheme = lightThemes.includes(getOrganizationPage.theme)

  return {
    news: NEWS_TAGS[query.slug as string] ? news : [],
    organizationPage: getOrganizationPage,
    namespace,
    showSearchInHeader: false,
    ...(lightTheme ? {} : { darkTheme: true }),
  }
}

export default withMainLayout(Home)
