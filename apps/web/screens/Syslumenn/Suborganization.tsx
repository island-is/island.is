/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useContext } from 'react'
import NextLink from 'next/link'
import {
  Box,
  Text,
  Breadcrumbs,
  ColorSchemeContext,
  Navigation,
  NavigationItem,
  GridContainer,
  GridColumn,
  GridRow,
  Button,
  FocusableBox,
  LinkCard,
  Stack,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  HeadWithSocialSharing,
  Header,
  Main,
  Heading,
  LatestNewsSection,
} from '@island.is/web/components'
import { useI18n } from '@island.is/web/i18n'
import {
  Query,
  QueryGetNamespaceArgs,
  ContentLanguage,
  QueryGetGroupedMenuArgs,
  QueryGetOrganizationSubpageArgs,
} from '@island.is/api/schema'
import {
  GET_NAMESPACE_QUERY,
  GET_CATEGORIES_QUERY,
  GET_ORGANIZATION_QUERY,
  GET_ORGANIZATION_NEWS_QUERY,
  GET_ORGANIZATION_SUBPAGE_QUERY, GET_ORGANIZATION_PAGE_QUERY,
} from '../queries'
import { Screen } from '../../types'
import { useNamespace } from '@island.is/web/hooks'
import * as styles from './Home.treat'
import {
  AllSlicesEmbeddedVideoFragment,
  AllSlicesFragment,
  AllSlicesImageFragment,
  Districts,
  FeaturedArticles,
  GetArticleCategoriesQuery,
  GetGroupedMenuQuery,
  GetNamespaceQuery,
  HeadingSlice,
  News,
  Organization,
  QueryGetArticleCategoriesArgs,
  QueryGetOrganizationArgs,
  QueryGetOrganizationNewsArgs, QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import { GET_GROUPED_MENU_QUERY } from '../queries/Menu'
import { Locale } from '../../i18n/I18n'
import {
  formatMegaMenuCategoryLinks,
  formatMegaMenuLinks,
} from '@island.is/web/utils/processMenuData'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { useRouter } from 'next/router'
import {
  renderSlices,
  Slice as SliceType,
} from '@island.is/island-ui/contentful'
import Link from 'next/link'
import LatestOrganizationNewsSection from '@island.is/web/components/LatestOrganizationNewsSection/LatestOrganizationNewsSection'
import { GlobalContext } from '../../context/GlobalContext/GlobalContext'
import OrganizationHeader from '@island.is/web/components/Organization/Header/OrganizationHeader'

interface HomeProps {
  organizationPage: Query['getOrganizationPage']
  subpage: Query['getOrganizationSubpage']
  namespace: Query['getNamespace']
}

const Suborganization: Screen<HomeProps> = ({
  organizationPage,
  subpage,
  namespace,
}) => {
  const { activeLocale } = useI18n()
  const { globalNamespace } = useContext(GlobalContext)
  const n = useNamespace(namespace)
  const gn = useNamespace(globalNamespace)
  const { asPath } = useRouter()
  const { linkResolver } = useLinkResolver()

  if (typeof document === 'object') {
    document.documentElement.lang = activeLocale
  }

  const parentPageLink: NavigationItem = {
    title: organizationPage.title,
    href: `/stofnanir/${organizationPage.slug}`,
    active: false,
  }

  const items: NavigationItem[] = organizationPage.menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink.text,
      href: primaryLink.url,
      active: subpage.menuItem.url === primaryLink.url || childrenLinks.some(link => link.url === subpage.menuItem.url),
      items: childrenLinks.map(({ text, url }) => ({
          title: text,
          href: url,
          active: url === subpage.menuItem.url
        })
      )
    }),
  )

  const navList = [parentPageLink, ...items]

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
          {
            title: subpage.title,
            href: '/',
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
              />
            </Box>
          }
        >
          <Box className={styles.intro} paddingTop={[4, 4, 0]}>
            <Text variant="h2" as="h2">
              {subpage.title}
            </Text>
            {subpage.description}
          </Box>
        </SidebarLayout>
      </Main>
    </>
  )
}

Suborganization.getInitialProps = async ({ apolloClient, locale, query }) => {
  const [
    {
      data: { getOrganizationPage },
    },
    {
      data: { getOrganizationSubpage },
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
    apolloClient.query<Query, QueryGetOrganizationSubpageArgs>({
      query: GET_ORGANIZATION_SUBPAGE_QUERY,
      variables: {
        input: {
          organizationSlug: 'syslumenn',
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
            namespace: 'Vidspyrna',
            lang: locale,
          },
        },
      })
      .then((variables) => JSON.parse(variables.data.getNamespace.fields)),
  ])

  return {
    organizationPage: getOrganizationPage,
    subpage: getOrganizationSubpage,
    namespace,
    showSearchInHeader: false,
  }
}

export default withMainLayout(Suborganization, {
  headerButtonColorScheme: 'negative',
  headerColorScheme: 'white',
})
