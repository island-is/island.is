/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from 'react'
import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Link,
  NavigationItem,
  Text,
} from '@island.is/island-ui/core'
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
  OrganizationSlice,
  OrganizationWrapper,
  Section,
} from '@island.is/web/components'
import { CustomNextError } from '@island.is/web/units/errors'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import getConfig from 'next/config'
import { QueryGetNewsArgs } from '@island.is/api/schema'
import { GlobalContext } from '../../context/GlobalContext/GlobalContext'
import { SYSLUMENN_NEWS_TAG_ID } from '@island.is/web/constants'
import useContentfulId from '@island.is/web/hooks/useContentfulId'

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
  const { globalNamespace } = useContext(GlobalContext)

  const n = useNamespace(namespace)
  const gn = useNamespace(globalNamespace)
  const { linkResolver } = useLinkResolver()
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
      breadcrumbItems={[
        {
          title: 'Ísland.is',
          href: linkResolver('homepage').href,
        },
        {
          title: n('organizations', 'Stofnanir'),
          href: linkResolver('organizations').href,
        },
      ]}
      navigationData={{
        title: n('navigationTitle', 'Efnisyfirlit'),
        items: navList,
      }}
      mainContent={organizationPage.slices.map((slice) => (
        <OrganizationSlice key={slice.id} slice={slice} namespace={namespace} />
      ))}
      sidebarContent={
        <Box marginTop={4} border="standard" borderRadius="large" padding={4}>
          <GridContainer>
            <GridRow>
              <GridColumn span={['3/12', '3/12', '12/12']}>
                <Box
                  display="flex"
                  justifyContent={'center'}
                  alignItems={'center'}
                  paddingBottom={3}
                >
                  <img
                    src={
                      'https://images.ctfassets.net/8k0h54kbe6bj/2c9RXjtApgqkUWeKh0s1xP/820afa7b351e638473bff013277929ea/Vector.svg'
                    }
                  ></img>
                </Box>
              </GridColumn>
              <GridColumn
                offset={['1/12', '1/12', '0']}
                span={['8/12', '8/12', '12/12']}
              >
                <Text variant="small">
                  Vegna smithættu af völdum COVID 19 hvetja sýslumenn alla
                  viðskiptavini sína til að forðast að koma í afgreiðslur
                  embættanna sé þess nokkur kostur.
                </Text>
                <Box display="flex" justifyContent="flexEnd" paddingTop={2}>
                  <Link href={'#'}>
                    <Button
                      icon="arrowForward"
                      iconType="filled"
                      type="button"
                      variant="text"
                      size="small"
                    >
                      {n('seeAllServices', 'Sjá allt efni')}
                    </Button>
                  </Link>
                </Box>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      }
    >
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
          tag: SYSLUMENN_NEWS_TAG_ID,
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

  return {
    news,
    organizationPage: getOrganizationPage,
    namespace,
    showSearchInHeader: false,
  }
}

export default withMainLayout(Home, {
  headerButtonColorScheme: 'negative',
  headerColorScheme: 'white',
})
