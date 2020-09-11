/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
// import cn from 'classnames'
import Head from 'next/head'
import {
  ContentBlock,
  Box,
  Typography,
  Stack,
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
import { FilteredCards } from '@island.is/web/components'
import {
  GET_ORGANIZATIONS_QUERY,
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_TAGS_QUERY,
} from '../queries'
import { ArticleLayout } from '@island.is/web/screens/Layouts/Layouts'
import { Screen } from '@island.is/web/types'
//import { useNamespace } from '@island.is/web/hooks'
import { CustomNextError } from '../../units/ErrorBoundary'

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
  //const n = useNamespace(namespace)

  const { items: organizationsItems } = organizations
  const { items: tagsItems } = tags

  return (
    <>
      <Head>
        <title>Stofnanir | Viðspyrna fyrir Ísland</title>
      </Head>
      <ArticleLayout sidebar={<Box marginBottom={10}>bla</Box>}>
        <Box marginBottom={2}>
          <Stack space={2}>
            <Breadcrumbs>
              <a>Ísland.is</a>
            </Breadcrumbs>
            <Typography variant="h1" as="h1">
              bla
            </Typography>
          </Stack>
        </Box>
      </ArticleLayout>
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
    </>
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

export default OrganizationPage
