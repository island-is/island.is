/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  NavigationItem,
  Text,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  ContentLanguage,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import { GET_NAMESPACE_QUERY, GET_ORGANIZATION_PAGE_QUERY } from '../queries'
import { Screen } from '../../types'
import { useNamespace } from '@island.is/web/hooks'
import {
  OrganizationSlice,
  OrganizationWrapper,
} from '@island.is/web/components'
import { CustomNextError } from '@island.is/web/units/errors'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import getConfig from 'next/config'
import useContentfulId from '@island.is/web/hooks/useContentfulId'

const { publicRuntimeConfig } = getConfig()

interface HomeProps {
  organizationPage: Query['getOrganizationPage']
  namespace: Query['getNamespace']
}

const Home: Screen<HomeProps> = ({ organizationPage, namespace }) => {
  const { disableSyslumennPage: disablePage } = publicRuntimeConfig
  if (disablePage === 'true') {
    throw new CustomNextError(404, 'Not found')
  }

  const n = useNamespace(namespace)
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
        titleLink: {
          href: linkResolver('organizationpage', [organizationPage.slug]).href,
          active: false,
        },
      }}
      mainContent={
        <Box paddingTop={2}>
          <Text variant="intro">{organizationPage.description}</Text>
        </Box>
      }
    >
      <GridContainer>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '12/12', '11/12']}>
            {organizationPage.slices.map((slice) => (
              <OrganizationSlice
                key={slice.id}
                slice={slice}
                namespace={namespace}
              />
            ))}
          </GridColumn>
        </GridRow>
      </GridContainer>
    </OrganizationWrapper>
  )
}

Home.getInitialProps = async ({ apolloClient, locale }) => {
  const [
    {
      data: { getOrganizationPage },
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
    organizationPage: getOrganizationPage,
    namespace,
    showSearchInHeader: false,
  }
}

export default withMainLayout(Home, {
  headerButtonColorScheme: 'negative',
  headerColorScheme: 'white',
})
