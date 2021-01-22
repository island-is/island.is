/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { Box, Text, NavigationItem } from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  Query,
  QueryGetNamespaceArgs,
  ContentLanguage,
  QueryGetOrganizationSubpageArgs,
} from '@island.is/api/schema'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_SUBPAGE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
} from '../queries'
import { Screen } from '../../types'
import { useNamespace } from '@island.is/web/hooks'
import * as styles from './Home.treat'
import { QueryGetOrganizationPageArgs } from '@island.is/web/graphql/schema'
import OrganizationWrapper from '@island.is/web/components/Organization/Wrapper/OrganizationWrapper'
import { CustomNextError } from '@island.is/web/units/errors'
import OrganizationSlice from '@island.is/web/components/Organization/Slice/OrganizationSlice'
import Markdown from 'markdown-to-jsx'

interface SubPageProps {
  organizationPage: Query['getOrganizationPage']
  subpage: Query['getOrganizationSubpage']
  namespace: Query['getNamespace']
}

const SubPage: Screen<SubPageProps> = ({
  organizationPage,
  subpage,
  namespace,
}) => {
  const n = useNamespace(namespace)

  const navList: NavigationItem[] = organizationPage.menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink.text,
      href: primaryLink.url,
      active:
        subpage.menuItem.url === primaryLink.url ||
        childrenLinks.some((link) => link.url === subpage.menuItem.url),
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
        active: url === subpage.menuItem.url,
      })),
    }),
  )

  return (
    <>
      <OrganizationWrapper
        pageTitle={subpage.title}
        pageDescription={subpage.description}
        organization={organizationPage.organization}
        pageFeaturedImage={subpage.featuredImage}
        breadcrumbItems={[
          {
            title: 'Ísland.is',
            href: '/',
          },
          {
            title: n('organizations', 'Stofnanir'),
          },
          {
            title: organizationPage.title,
          },
        ]}
        navigationData={{
          title: n('navigationTitle', 'Efnisyfirlit'),
          items: navList,
          titleLink: {
            href: `/${organizationPage.slug}`,
            active: false,
          },
        }}
        mainContent={
          <Box className={styles.intro} paddingTop={[4, 4, 0]}>
            <Text variant="h2" as="h2">
              {subpage.title}
            </Text>
            <Markdown>{subpage.description}</Markdown>
          </Box>
        }
      >
        {subpage.slices.map((slice) => (
          <OrganizationSlice
            key={slice.id}
            slice={slice}
            organization={organizationPage.organization}
            namespace={namespace}
          />
        ))}
      </OrganizationWrapper>
    </>
  )
}

SubPage.getInitialProps = async ({ apolloClient, locale, query }) => {
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
            namespace: 'Syslumenn',
            lang: locale,
          },
        },
      })
      .then((variables) => variables.data.getNamespace.fields ? JSON.parse(variables.data.getNamespace.fields) : {}),
  ])

  if (!getOrganizationSubpage) {
    throw new CustomNextError(404, 'Organization subpage not found')
  }

  return {
    organizationPage: getOrganizationPage,
    subpage: getOrganizationSubpage,
    namespace,
    showSearchInHeader: false,
  }
}

export default withMainLayout(SubPage, {
  headerButtonColorScheme: 'negative',
  headerColorScheme: 'white',
})
