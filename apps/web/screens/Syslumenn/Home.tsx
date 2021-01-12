/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import NextLink from 'next/link'
import {
  Box,
  Text,
  Breadcrumbs,
  ColorSchemeContext,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import { HeadWithSocialSharing, Header, Main } from '@island.is/web/components'
import { useI18n } from '@island.is/web/i18n'
import {
  Query,
  QueryGetNamespaceArgs,
  ContentLanguage,
  QueryGetGroupedMenuArgs,
} from '@island.is/api/schema'
import {
  GET_NAMESPACE_QUERY,
  GET_CATEGORIES_QUERY,
  GET_ORGANIZATION_QUERY,
} from '../queries'
import { Screen } from '../../types'
import { useNamespace } from '@island.is/web/hooks'
import * as styles from './Home.treat'
import {
  GetArticleCategoriesQuery,
  GetGroupedMenuQuery,
  QueryGetArticleCategoriesArgs,
  QueryGetOrganizationArgs,
} from '@island.is/web/graphql/schema'
import { GET_GROUPED_MENU_QUERY } from '../queries/Menu'
import { Locale } from '../../i18n/I18n'
import {
  formatMegaMenuCategoryLinks,
  formatMegaMenuLinks,
} from '@island.is/web/utils/processMenuData'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'

interface HomeProps {
  organization: Query['getOrganization']
  namespace: Query['getNamespace']
  megaMenuData
}

const Home: Screen<HomeProps> = ({ organization, namespace, megaMenuData }) => {
  const { activeLocale } = useI18n()
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()

  if (typeof document === 'object') {
    document.documentElement.lang = activeLocale
  }

  return (
    <>
      <HeadWithSocialSharing
        title={organization.title}
        description={organization.description}
        /*
        imageUrl={organization.featuredImage?.url}
        imageWidth={organization.featuredImage?.width?.toString()}
        imageHeight={organization.featuredImage?.height?.toString()}
        */
      />
      <Box className={styles.headerBorder}>
        <Box className={styles.headerBg}>
          <ColorSchemeContext.Provider value={{ colorScheme: 'white' }}>
            <Header buttonColorScheme="negative" megaMenuData={megaMenuData}>
              <SidebarLayout fullWidthContent sidebarContent="">
                <Box paddingTop={[2, 2, 10]} paddingBottom={[4, 4, 4, 10]}>
                  <Text variant="h1" as="h1" color="white">
                    {organization.title}
                  </Text>
                </Box>
              </SidebarLayout>
            </Header>
          </ColorSchemeContext.Provider>
        </Box>
      </Box>
      <Main>
        <SidebarLayout
          fullWidthContent
          isSticky={false}
          sidebarContent={
            <Breadcrumbs
              color="white"
              items={[
                {
                  title: 'Ísland.is',
                  href: '/',
                },
                {
                  title: organization.title,
                },
              ]}
              renderLink={(link) => {
                return (
                  <NextLink {...linkResolver('homepage')} passHref>
                    {link}
                  </NextLink>
                )
              }}
            />
          }
        >
          {organization.description}
        </SidebarLayout>
      </Main>
    </>
  )
}

Home.getInitialProps = async ({ apolloClient, locale }) => {
  const [
    {
      data: { getOrganization },
    },
    namespace,
    megaMenuData,
    categories,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationArgs>({
      query: GET_ORGANIZATION_QUERY,
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
    apolloClient
      .query<GetGroupedMenuQuery, QueryGetGroupedMenuArgs>({
        query: GET_GROUPED_MENU_QUERY,
        variables: {
          input: { id: '5prHB8HLyh4Y35LI4bnhh2', lang: locale },
        },
      })
      .then((res) => res.data.getGroupedMenu),
    apolloClient
      .query<GetArticleCategoriesQuery, QueryGetArticleCategoriesArgs>({
        query: GET_CATEGORIES_QUERY,
        variables: {
          input: {
            lang: locale,
          },
        },
      })
      .then((res) => res.data.getArticleCategories),
  ])

  const [asideTopLinksData, asideBottomLinksData] = megaMenuData.menus

  return {
    organization: getOrganization,
    namespace,
    showSearchInHeader: false,
    megaMenuData: {
      asideTopLinks: formatMegaMenuLinks(
        locale as Locale,
        asideTopLinksData.menuLinks,
      ),
      asideBottomTitle: asideBottomLinksData.title,
      asideBottomLinks: formatMegaMenuLinks(
        locale as Locale,
        asideBottomLinksData.menuLinks,
      ),
      mainLinks: formatMegaMenuCategoryLinks(locale as Locale, categories),
    },
  }
}

export default withMainLayout(Home, {
  showHeader: false,
})
