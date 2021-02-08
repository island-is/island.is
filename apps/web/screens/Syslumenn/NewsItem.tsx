import React from 'react'
import { BreadCrumbItem } from '@island.is/island-ui/core'
import { Screen } from '@island.is/web/types'
import {
  GET_NAMESPACE_QUERY,
  GET_SINGLE_NEWS_ITEM_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
} from '@island.is/web/screens/queries'
import { withMainLayout } from '@island.is/web/layouts/main'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import {
  ContentLanguage,
  GetSingleNewsItemQuery,
  QueryGetSingleNewsArgs,
  QueryGetNamespaceArgs,
  GetNamespaceQuery,
  Query,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import {
  HeadWithSocialSharing,
  OrganizationHeader,
  OrganizationFooter,
  NewsArticle,
} from '@island.is/web/components'
import { useNamespace } from '@island.is/web/hooks'
import { useLinkResolver } from '../../hooks/useLinkResolver'

import { CustomNextError } from '../../units/errors'

interface NewsItemProps {
  newsItem: GetSingleNewsItemQuery['getSingleNews']
  namespace: GetNamespaceQuery['getNamespace']
  organizationPage: Query['getOrganizationPage']
}

const NewsItem: Screen<NewsItemProps> = ({ newsItem, namespace, organizationPage }) => {
  useContentfulId(newsItem?.id)
  const { linkResolver } = useLinkResolver()
  const n = useNamespace(namespace)

  const breadCrumbs: BreadCrumbItem[] = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage').href,
      typename: 'homepage',
    },
    {
      title: n('organizations', 'Stofnanir'),
      href: linkResolver('organizations').href,
      typename: 'organizations',
    },
    {
      title: organizationPage.title,
      href: linkResolver('organizationpage', [organizationPage.slug]).href,
      typename: 'organizationpage',
    },
    {
      title: n('newsTitle', 'Fréttir og tilkynningar'),
      href: linkResolver('organizationnewsoverview', [organizationPage.slug]).href,
      typename: 'organizationnewsoverview',
    },
  ]

  return (
    <>
      <HeadWithSocialSharing
        title={`${newsItem.title} | Sýslumenn | Ísland.is`}
        description={newsItem.intro}
        imageUrl={newsItem.image?.url}
        imageWidth={newsItem.image?.width.toString()}
        imageHeight={newsItem.image?.height.toString()}
      />
      <OrganizationHeader
        title={organizationPage.title}
        logoUrl={organizationPage.organization.logo.url}
        logoAtl={organizationPage.organization.logo.title}
        breadcrumbItems={breadCrumbs}
      />
      <NewsArticle newsItem={newsItem} namespace={namespace}/>
      <OrganizationFooter organizationPage={organizationPage}/>
    </>
  )
}

NewsItem.getInitialProps = async ({ apolloClient, locale, query }) => {
  const [
    {
      data: { getOrganizationPage },
    },
    {
      data: { getSingleNews: newsItem },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug: 'syslumenn',
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<GetSingleNewsItemQuery, QueryGetSingleNewsArgs>({
      query: GET_SINGLE_NEWS_ITEM_QUERY,
      variables: {
        input: {
          slug: query.slug as string,
          lang: locale as ContentLanguage,
        },
      },
    }),

    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            lang: locale as ContentLanguage,
            namespace: 'Newspages',
          },
        },
      })
      .then((variables) => {
        // map data here to reduce data processing in component
        return JSON.parse(variables.data.getNamespace.fields)
      }),
  ])

  if (!newsItem) {
    throw new CustomNextError(404, 'News not found')
  }

  return {
    organizationPage: getOrganizationPage,
    newsItem,
    namespace,
  }
}

export default withMainLayout(NewsItem, {
  headerButtonColorScheme: 'negative',
  headerColorScheme: 'white',
})
