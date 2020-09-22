/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
// import cn from 'classnames'
import Head from 'next/head'
import {
  ContentBlock,
  Box,
  Typography,
  Breadcrumbs,
  ColorSchemeContext,
  Link,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import {
  Query,
  QueryGetNamespaceArgs,
  ContentLanguage,
  QueryGetOrganizationTagsArgs,
  QueryGetOrganizationArgs,
} from '@island.is/api/schema'
import { withMainLayout } from '@island.is/web/layouts/main'
import { FilteredCards } from '@island.is/web/components'
import {
  GET_ORGANIZATIONS_QUERY,
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_TAGS_QUERY,
} from '../queries'
import { ArticleLayout } from '@island.is/web/screens/Layouts/Layouts'
import { useNamespace } from '@island.is/web/hooks'
import routeNames from '@island.is/web/i18n/routeNames'
import { Screen } from '@island.is/web/types'
import { useI18n } from '@island.is/web/i18n'
import { CustomNextError } from '../../units/errors'

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
  const { activeLocale } = useI18n()
  const n = useNamespace(namespace)
  const { makePath } = routeNames(activeLocale)

  const { items: organizationsItems } = organizations
  const { items: tagsItems } = tags

  return (
    <>
      <Head>
        <title>
          {n('stofnanirHeading', 'Stofnanir Íslenska Ríkisins')} | Ísland.is
        </title>
      </Head>
      <ArticleLayout sidebar={null}>
        <GridRow>
          <GridColumn
            offset={['0', '0', '1/8']}
            span={['0', '0', '7/8']}
            paddingBottom={2}
          >
            <Breadcrumbs>
              <Link href={makePath()}>Ísland.is</Link>
              <span>{n('organizations', 'Stofnanir')}</span>
            </Breadcrumbs>
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn offset={['0', '0', '1/8']} span={['8/8', '8/8', '7/8']}>
            <Typography variant="h1" as="h1" paddingBottom={2}>
              {n('stofnanirHeading', 'Stofnanir Íslenska Ríkisins')}
            </Typography>
          </GridColumn>
        </GridRow>
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

export default withMainLayout(OrganizationPage)
