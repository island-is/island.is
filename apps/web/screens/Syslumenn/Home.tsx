/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
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
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  HeadWithSocialSharing,
  Header,
  Main,
  Heading,
} from '@island.is/web/components'
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
  AllSlicesEmbeddedVideoFragment,
  AllSlicesFragment,
  AllSlicesImageFragment,
  Districts,
  FeaturedArticles,
  GetArticleCategoriesQuery,
  GetGroupedMenuQuery,
  GetNamespaceQuery,
  HeadingSlice,
  Organization,
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
import { useRouter } from 'next/router'
import {
  renderSlices,
  Slice as SliceType,
} from '@island.is/island-ui/contentful'

interface HomeProps {
  organization: Query['getOrganization']
  namespace: Query['getNamespace']
  megaMenuData
}

type AvailableSlices = Exclude<
  AllSlicesFragment,
  AllSlicesEmbeddedVideoFragment | AllSlicesImageFragment
>

const Home: Screen<HomeProps> = ({ organization, namespace, megaMenuData }) => {
  const { activeLocale } = useI18n()
  const n = useNamespace(namespace)
  const { asPath } = useRouter()
  const { linkResolver } = useLinkResolver()

  if (typeof document === 'object') {
    document.documentElement.lang = activeLocale
  }

  const parentPageLink: NavigationItem = {
    title: organization.organizationPage.title,
    href: `/stofnanir/${organization.slug}`,
    active: false,
  }

  const items: NavigationItem[] = organization.organizationPage.menuLinks.map(
    ({ text, url }) => ({
      title: text,
      href: url,
      active: asPath === url,
    }),
  )

  const navList = [parentPageLink, ...items]

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
              <GridContainer>
                <Box marginTop={[1, 1, 3]} marginBottom={5}>
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
                </Box>
              </GridContainer>
              <Box className={styles.headerWrapper}>
                <SidebarLayout sidebarContent="">
                  <Box paddingTop={[2, 2, 0]} paddingBottom={[0, 0, 4, 4]}>
                    <Box display="flex" flexDirection="row" alignItems="center">
                      <img
                        src={organization.logo.url}
                        className={styles.headerLogo}
                        alt=""
                      />
                      <Text variant="h1" as="h1" color="white">
                        {organization.title}
                      </Text>
                    </Box>
                  </Box>
                </SidebarLayout>
                <GridContainer>
                  <Box
                    display={['block', 'block', 'none']}
                    paddingBottom={4}
                    className={styles.mobileNav}
                  >
                    <Navigation
                      baseId={'mobileNav'}
                      isMenuDialog
                      activeItemTitle={organization.title}
                      items={navList}
                      title="Efnisyfirlit"
                      titleLink={{
                        href: `/${organization.slug}`,
                        active: false,
                      }}
                    />
                  </Box>
                </GridContainer>
              </Box>
            </Header>
          </ColorSchemeContext.Provider>
        </Box>
      </Box>
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
                  href: `/${organization.slug}`,
                  active: false,
                }}
              />
            </Box>
          }
        >
          <Box className={styles.intro} paddingTop={[4, 4, 0]}>
            {organization.organizationPage.description}
          </Box>
        </SidebarLayout>
        {organization.organizationPage.slices.map((slice) => (
          <Section key={slice.id} slice={slice} organization={organization} />
        ))}
      </Main>
    </>
  )
}

interface SectionProps {
  slice: HeadingSlice | Districts | FeaturedArticles
  organization: Organization
  namespace?: GetNamespaceQuery['getNamespace']
}

const Section: FC<SectionProps> = ({ slice, organization, namespace }) => {
  console.log({ slice })
  switch (slice.__typename) {
    case 'HeadingSlice':
      return (
        <div key={slice.id} id={slice.id}>
          <Box paddingTop={[8, 6, 15]} paddingBottom={[4, 5, 10]}>
            <SidebarLayout isSticky={false} sidebarContent="">
              <Heading {...slice} />
            </SidebarLayout>
          </Box>
        </div>
      )
    case 'Districts':
      return (
        <div key={slice.id} id={slice.id}>
          <Box paddingTop={[8, 6, 15]} paddingBottom={[4, 5, 10]}>
            <SidebarLayout fullWidthContent={true} sidebarContent={null}>
              <h2>{slice.title}</h2>
              <GridContainer>
                <GridRow>
                  <GridColumn span="6/12">
                    {organization.suborganizations.map((link) => (
                      <div>
                        <a href={link.link}>{link.shortTitle}</a>
                      </div>
                    ))}
                  </GridColumn>
                  <GridColumn span="6/12">
                    <img src={slice.image.url} />
                  </GridColumn>
                </GridRow>
              </GridContainer>
            </SidebarLayout>
          </Box>
        </div>
      )
    case 'FeaturedArticles':
      return (
        <div key={slice.id} id={slice.id}>
          <Box paddingTop={[8, 6, 15]} paddingBottom={[4, 5, 10]}>
            <SidebarLayout fullWidthContent={true} sidebarContent={null}>
              <h2>{slice.title}</h2>
              {slice.articles.map((article) => (
                <div>{article.title}</div>
              ))}
            </SidebarLayout>
          </Box>
        </div>
      )
    default:
      return <div>no section match</div>
  }
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
