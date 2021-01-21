/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from 'react'
import { Box, Navigation, NavigationItem } from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Main, HeadWithSocialSharing } from '@island.is/web/components'
import { useI18n } from '@island.is/web/i18n'
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
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import LatestOrganizationNewsSection from '@island.is/web/components/LatestOrganizationNewsSection/LatestOrganizationNewsSection'
import { GlobalContext } from '@island.is/web/context'
import OrganizationHeader from '@island.is/web/components/Organization/Header/OrganizationHeader'
import OrganizationSlice from '@island.is/web/components/Organization/Slice/OrganizationSlice'
import NextLink from "next/link";

interface HomeProps {
  organizationPage: Query['getOrganizationPage']
  namespace: Query['getNamespace']
  news: Query['getOrganizationNews']
}

const Home: Screen<HomeProps> = ({ organizationPage, namespace, news }) => {
  const { globalNamespace } = useContext(GlobalContext)
  const n = useNamespace(namespace)
  const gn = useNamespace(globalNamespace)

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
      <HeadWithSocialSharing
        title={organizationPage.title}
        description={organizationPage.description}
        /*
        imageUrl={organization.featuredImage?.url}
        imageWidth={organization.featuredImage?.width?.toString()}
        imageHeight={organization.featuredImage?.height?.toString()}
        */
      />
      <OrganizationHeader
        organizationPage={organizationPage}
        breadcrumbItems={[
          {
            title: 'Ísland.is',
            href: '/',
          },
          {
            title: organizationPage.title,
          },
        ]}
        mobileNav={
          <Navigation
            baseId={'mobileNav'}
            isMenuDialog
            activeItemTitle={organizationPage.title}
            items={navList}
            title="Efnisyfirlit"
            titleLink={{
              href: `/${organizationPage.slug}`,
              active: false,
            }}
            renderLink={(link, item) => {
              return (
                <NextLink
                  href={item?.href ?? "/hello"}
                >
                  {link}
                </NextLink>
              )
            }}
          />
        }
      />
      <Main>
        <SidebarLayout
          isSticky={false}
          sidebarContent={
            <Box className={styles.desktopNav}>
              <Navigation
                baseId="desktopNav"
                items={navList}
                title="Efnisyfirlit"
                titleLink={{
                  href: `/${organizationPage.slug}`,
                  active: false,
                }}
                renderLink={(link, item) => {
                  return (
                    <NextLink
                      href={item?.href ?? "/hello"}
                    >
                      {link}
                    </NextLink>
                  )
                }}
              />
            </Box>
          }
        >
          <Box className={styles.intro} paddingTop={[4, 4, 0]}>
            {organizationPage.description}
          </Box>
        </SidebarLayout>
        {organizationPage.slices.map((slice) => (
          <OrganizationSlice
            key={slice.id}
            slice={slice}
            organization={organizationPage.organization}
            namespace={namespace}
          />
        ))}
        <Box
          className={styles.newsBg}
          paddingTop={[4, 5, 10]}
          paddingBottom={[4, 5, 10]}
        >
          <LatestOrganizationNewsSection
            label={gn('newsAndAnnouncements')}
            labelId="latestNewsTitle"
            items={news}
            subtitle={organizationPage.title}
            organizationSlug={organizationPage.slug}
          />
        </Box>
      </Main>
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
            namespace: 'Vidspyrna',
            lang: locale,
          },
        },
      })
      .then((variables) => JSON.parse(variables.data.getNamespace.fields)),
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
