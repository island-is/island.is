/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useContext } from 'react'
import NextLink from 'next/link'
import {
  Box,
  Text,
  Breadcrumbs,
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
import { HeadWithSocialSharing, Main, Heading } from '@island.is/web/components'
import { useI18n } from '@island.is/web/i18n'
import {
  Query,
  QueryGetNamespaceArgs,
  ContentLanguage,
} from '@island.is/api/schema'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_QUERY,
  GET_ORGANIZATION_NEWS_QUERY,
} from '../queries'
import { Screen } from '../../types'
import { useNamespace } from '@island.is/web/hooks'
import * as styles from './Home.treat'
import {
  Districts,
  FeaturedArticles,
  GetNamespaceQuery,
  HeadingSlice,
  Organization,
  QueryGetOrganizationArgs,
  QueryGetOrganizationNewsArgs,
} from '@island.is/web/graphql/schema'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { useRouter } from 'next/router'
import Link from 'next/link'
import LatestOrganizationNewsSection from '@island.is/web/components/LatestOrganizationNewsSection/LatestOrganizationNewsSection'
import { GlobalContext } from '../../context/GlobalContext/GlobalContext'

interface HomeProps {
  organization: Query['getOrganization']
  namespace: Query['getNamespace']
  news: Query['getOrganizationNews']
}

const Home: Screen<HomeProps> = ({ organization, namespace, news }) => {
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
        <Box
          className={styles.newsBg}
          paddingTop={[4, 5, 10]}
          paddingBottom={[4, 5, 10]}
        >
          <LatestOrganizationNewsSection
            label={gn('newsAndAnnouncements')}
            labelId="latestNewsTitle"
            items={news}
            subtitle={organization.title}
            organizationSlug={organization.slug}
          />
        </Box>
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
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()

  switch (slice.__typename) {
    case 'HeadingSlice':
      return (
        <section key={slice.id}>
          <Box paddingTop={[8, 6, 15]} paddingBottom={[4, 5, 10]}>
            <SidebarLayout isSticky={false} sidebarContent="">
              <Heading {...slice} />
            </SidebarLayout>
          </Box>
        </section>
      )
    case 'Districts':
      return (
        <section key={slice.id} aria-labelledby={'sliceTitle-' + slice.id}>
          <GridContainer>
            <Box
              borderTopWidth="standard"
              borderColor="standard"
              paddingTop={[8, 6, 15]}
              paddingBottom={[4, 5, 10]}
            >
              <h2
                id={'sliceTitle-' + slice.id}
                className={styles.districtsTitle}
              >
                {slice.title}
              </h2>
              <GridRow>
                <GridColumn span={['12/12', '12/12', '7/12']}>
                  <ul className={styles.districtsList}>
                    {organization.suborganizations.map((link) => (
                      <li className={styles.districtsListItem}>
                        <Link href={link.link}>
                          <Button variant="text">{link.shortTitle}</Button>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </GridColumn>
                <GridColumn span={['12/12', '12/12', '5/12']}>
                  <img src={slice.image.url} alt="" />
                </GridColumn>
              </GridRow>
            </Box>
          </GridContainer>
        </section>
      )
    case 'FeaturedArticles':
      return (
        <section key={slice.id} aria-labelledby={'sliceTitle-' + slice.id}>
          <GridContainer>
            <Box
              borderTopWidth="standard"
              borderColor="standard"
              paddingTop={[8, 6, 10]}
              paddingBottom={[4, 5, 10]}
            >
              <GridRow>
                <GridColumn span={['12/12', '12/12', '5/12']}>
                  <Box className={styles.popularTitleWrap}>
                    <h2
                      className={styles.popularTitle}
                      id={'sliceTitle-' + slice.id}
                    >
                      {slice.title}
                    </h2>
                    <Box display={['none', 'none', 'block']}>
                      <img src={slice.image.url} alt="" />
                    </Box>
                  </Box>
                </GridColumn>
                <GridColumn span={['12/12', '12/12', '7/12']}>
                  <Stack space={2}>
                    {slice.articles.map(({ title, slug, isApplication }) => {
                      const url = linkResolver('Article' as LinkType, [slug])
                      return (
                        <FocusableBox
                          key={slug}
                          href={url.href}
                          as={url.as}
                          borderRadius="large"
                        >
                          {({ isFocused }) => (
                            <LinkCard
                              isFocused={isFocused}
                              tag={
                                !!isApplication &&
                                n('applicationProcess', 'Umsókn')
                              }
                            >
                              {title}
                            </LinkCard>
                          )}
                        </FocusableBox>
                      )
                    })}
                  </Stack>
                </GridColumn>
              </GridRow>
              <Box
                display="flex"
                justifyContent="flexEnd"
                paddingTop={4}
                paddingBottom={1}
              >
                <Text variant="h5" as="p">
                  <Link href="#">
                    <Button
                      icon="arrowForward"
                      iconType="filled"
                      type="button"
                      variant="text"
                    >
                      {n('seeAllServices', 'Sjá allt efni')}
                    </Button>
                  </Link>
                </Text>
              </Box>
            </Box>
          </GridContainer>
        </section>
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
    {
      data: { getOrganizationNews },
    },
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
    organization: getOrganization,
    namespace,
    news: getOrganizationNews,
    showSearchInHeader: false,
  }
}

export default withMainLayout(Home, {
  headerButtonColorScheme: 'negative',
  headerColorScheme: 'white',
})
