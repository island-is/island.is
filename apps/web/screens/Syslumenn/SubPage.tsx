/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Link,
  NavigationItem,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  ContentLanguage,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
  QueryGetOrganizationSubpageArgs,
} from '@island.is/web/graphql/schema'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_SUBPAGE_QUERY,
} from '../queries'
import { Screen } from '../../types'
import { useNamespace } from '@island.is/web/hooks'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import * as styles from './SubPage.treat'
import {
  OrganizationSlice,
  OrganizationWrapper,
  MarkdownText,
} from '@island.is/web/components'
import { CustomNextError } from '@island.is/web/units/errors'

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
  const { linkResolver } = useLinkResolver()

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
    <OrganizationWrapper
      pageTitle={subpage.title}
      pageDescription={subpage.description}
      organizationPage={organizationPage}
      pageFeaturedImage={subpage.featuredImage}
      fullWidthContent={true}
      breadcrumbItems={[
        {
          title: 'Ísland.is',
          href: linkResolver('homepage').href,
        },
        {
          title: n('organizations', 'Stofnanir'),
          href: linkResolver('organizations').href,
        },
        {
          title: organizationPage.title,
          href: linkResolver('organizationpage', [organizationPage.slug]).href,
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
    >
      <GridContainer>
        <Box paddingTop={[4, 4, 0]} paddingBottom={[4, 4, 6]}>
          <GridRow>
            <GridColumn
              span={['12/12', '12/12', subpage.links.length ? '7/12' : '12/12']}
            >
              <Box marginBottom={6}>
                <Text variant="h1" as="h2">
                  {subpage.title}
                </Text>
              </Box>
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn
              span={['12/12', '12/12', subpage.links.length ? '7/12' : '12/12']}
            >
              <MarkdownText variant={subpage.slices.length ? 'h3' : 'default'}>
                {subpage.description}
              </MarkdownText>
            </GridColumn>
            {subpage.links.length > 0 && (
              <GridColumn
                span={['12/12', '12/12', '4/12']}
                offset={[null, null, '1/12']}
              >
                <Stack space={2}>
                  {subpage.links.map((link) => (
                    <Text fontWeight="light" color="blue400">
                      <Link href={link.url} underline="small">
                        {link.text}
                      </Link>
                    </Text>
                  ))}
                </Stack>
              </GridColumn>
            )}
          </GridRow>
        </Box>
      </GridContainer>
      {subpage.slices.map((slice) => (
        <OrganizationSlice
          key={slice.id}
          slice={slice}
          organization={organizationPage.organization}
          namespace={namespace}
        />
      ))}
    </OrganizationWrapper>
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
      .then((variables) =>
        variables.data.getNamespace.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
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
