/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  NavigationItem,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  Query,
  QueryGetNamespaceArgs,
  ContentLanguage,
} from '@island.is/api/schema'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_NEWS_QUERY,
} from '../queries'
import { Screen } from '../../types'
import { useNamespace } from '@island.is/web/hooks'
import * as styles from './Home.treat'
import {
  QueryGetOrganizationPageArgs,
  QueryGetOrganizationNewsArgs,
} from '@island.is/web/graphql/schema'
import LatestOrganizationNewsSection from '@island.is/web/components/LatestOrganizationNewsSection/LatestOrganizationNewsSection'
import OrganizationWrapper from '@island.is/web/components/Organization/Wrapper/OrganizationWrapper'
import OrganizationSlice from '@island.is/web/components/Organization/Slice/OrganizationSlice'
import { CustomNextError } from '@island.is/web/units/errors'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

interface HomeProps {
  organizationPage: Query['getOrganizationPage']
  namespace: Query['getNamespace']
  news: Query['getOrganizationNews']
}

const Home: Screen<HomeProps> = ({ organizationPage, namespace, news }) => {
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()

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
    <>
      <OrganizationWrapper
        pageTitle={organizationPage.title}
        pageDescription={organizationPage.description}
        organizationPage={organizationPage}
        pageFeaturedImage={organizationPage.featuredImage}
        fullWidthContent={false}
        breadcrumbItems={[
          {
            title: 'Ísland.is',
            href: linkResolver('homepage').as,
          },
          {
            title: n('organizations', 'Stofnanir'),
            href: linkResolver('organizations').as,
          },
        ]}
        navigationData={{
          title: n('navigationTitle', 'Efnisyfirlit'),
          items: navList,
          titleLink: {
            href: linkResolver('organizationpage', [organizationPage.slug]).as,
            active: false,
          },
        }}
        mainContent={
          <Box className={styles.intro}>{organizationPage.description}</Box>
        }
      >
        <GridContainer>
          <GridRow>
            <GridColumn span={'10/12'} offset={'1/12'}>
              {organizationPage.slices.map((slice) => (
                <OrganizationSlice
                  key={slice.id}
                  slice={slice}
                  organization={organizationPage.organization}
                  namespace={namespace}
                />
              ))}
            </GridColumn>
          </GridRow>
        </GridContainer>
        <Box
          className={styles.newsBg}
          paddingTop={[4, 5, 10]}
          paddingBottom={[4, 5, 10]}
        >
          <LatestOrganizationNewsSection
            label={n('newsAndAnnouncements')}
            labelId="latestNewsTitle"
            items={news}
            subtitle={organizationPage.title}
            organizationSlug={organizationPage.slug}
          />
        </Box>
      </OrganizationWrapper>
    </>
  )
}

Home.getInitialProps = async ({ apolloClient, locale }) => {
  const [
    {
      data: { getOrganizationPage },
    },
    namespace,
    {
      data: { getOrganizationNews },
    },
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
    apolloClient.query<Query, QueryGetOrganizationNewsArgs>({
      query: GET_ORGANIZATION_NEWS_QUERY,
      variables: {
        input: {
          organizationSlug: 'syslumenn',
          lang: locale as ContentLanguage,
        },
      },
    }),
  ])

  if (!getOrganizationPage) {
    throw new CustomNextError(404, 'Organization not found')
  }

  return {
    organizationPage: getOrganizationPage,
    namespace,
    news: getOrganizationNews,
    showSearchInHeader: false,
  }
}

export default withMainLayout(Home, {
  headerButtonColorScheme: 'negative',
  headerColorScheme: 'white',
})
