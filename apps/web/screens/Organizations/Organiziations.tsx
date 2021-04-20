/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import {
  ContentBlock,
  Box,
  Text,
  Breadcrumbs,
  ColorSchemeContext,
} from '@island.is/island-ui/core'
import {
  Query,
  QueryGetNamespaceArgs,
  ContentLanguage,
  QueryGetOrganizationTagsArgs,
  QueryGetOrganizationArgs,
} from '@island.is/api/schema'
import { withMainLayout } from '@island.is/web/layouts/main'
import { FilteredCards, Main } from '@island.is/web/components'
import {
  GET_ORGANIZATIONS_QUERY,
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_TAGS_QUERY,
} from '../queries'
import { SidebarLayout } from '@island.is/web/screens/Layouts/SidebarLayout'
import { useNamespace } from '@island.is/web/hooks'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '../../units/errors'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

interface OrganizationProps {
  organizations: Query['getOrganizations']
  tags: Query['getOrganizationTags']
  namespace: Query['getNamespace']
}

const OrganizationPage: Screen<OrganizationProps> = ({
  organizations,
  tags,
  namespace,
}) => {
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()

  const { items: organizationsItems } = organizations
  const { items: tagsItems } = tags

  return (
    <Main>
      <Head>
        <title>
          {n('stofnanirHeading', 'Stofnanir Íslenska Ríkisins')} | Ísland.is
        </title>
      </Head>
      <SidebarLayout
        fullWidthContent
        sidebarContent={null}
        addMainLandmark={false}
      >
        <Box paddingBottom={[2, 2, 4]}>
          <Breadcrumbs
            items={[
              {
                title: 'Ísland.is',
                href: '/',
              },
              {
                title: n('organizations', 'Stofnanir'),
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

        <Text variant="h1" as="h1" paddingBottom={2}>
          {n('stofnanirHeading', 'Stofnanir Íslenska Ríkisins')}
        </Text>
      </SidebarLayout>
      <Box background="blue100">
        <ContentBlock width="large">
          <ColorSchemeContext.Provider value={{ colorScheme: 'blue' }}>
            <FilteredCards
              tags={tagsItems}
              items={organizationsItems}
              namespace={namespace}
            />
          </ColorSchemeContext.Provider>
        </ContentBlock>
      </Box>
    </Main>
  )
}

OrganizationPage.getInitialProps = async ({ apolloClient, query, locale }) => {
  // const slug = query.slug as string
  const [
    {
      data: { getOrganizations },
    },
    {
      data: { getOrganizationTags },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationArgs>({
      query: GET_ORGANIZATIONS_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationTagsArgs>({
      query: GET_ORGANIZATION_TAGS_QUERY,
      variables: {
        input: {
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
      .then((content) => JSON.parse(content.data.getNamespace.fields)),
  ])

  // we assume 404 if no Organization is found
  if (!getOrganizations) {
    throw new CustomNextError(404, 'Þessi síða fannst ekki!')
  }

  return {
    organizations: getOrganizations,
    tags: getOrganizationTags,
    namespace,
  }
}

export default withMainLayout(OrganizationPage)
