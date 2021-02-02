/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  NavigationItem,
  Select,
  Option,
  Text,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  ContentLanguage,
  OneColumnText,
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
import {
  OrganizationSlice,
  OrganizationWrapper,
} from '@island.is/web/components'
import { CustomNextError } from '@island.is/web/units/errors'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

interface StefnuvottarPageProps {
  organizationPage: Query['getOrganizationPage']
  subpage: Query['getOrganizationSubpage']
  namespace: Query['getNamespace']
}

const StefnuvottarPage: Screen<StefnuvottarPageProps> = ({
  organizationPage,
  subpage,
  namespace,
}) => {
  const { disableSyslumennPage: disablePage } = publicRuntimeConfig
  if (disablePage === 'true') {
    throw new CustomNextError(404, 'Not found')
  }

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

  const [selected, setSelected] = useState(null)

  const options = []

  for (const slice of subpage.slices) {
    if (slice.__typename === 'OneColumnText') {
      options.push({ label: slice.title, value: slice.id })
    }
  }

  const selectedSlice = subpage.slices.find((x) => x.id === selected)

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
      <Box paddingTop={[4, 4, 0]} paddingBottom={[4, 4, 6]}>
        <Text variant="h1" as="h2">
          {subpage.title}
        </Text>
      </Box>
      <GridContainer>
        <GridRow>
          <GridColumn
            paddingTop={[4, 4, 0]}
            paddingBottom={[4, 4, 6]}
            span={['12/12', '12/12', '12/12', '12/12', '6/12']}
          >
            <Select
              backgroundColor="white"
              icon="chevronDown"
              size="sm"
              isSearchable
              label="Embætti"
              name="select1"
              noOptionsMessage="Enginn valmöguleiki"
              options={options}
              value={options.find((x) => x.value === selected)}
              onChange={({ value }: Option) => setSelected(value)}
              placeholder="Veldu embætti"
            />
          </GridColumn>
        </GridRow>
      </GridContainer>
      {!!selectedSlice && (
        <OrganizationSlice
          key={selectedSlice.id}
          slice={selectedSlice}
          organization={organizationPage.organization}
          namespace={namespace}
        />
      )}
    </OrganizationWrapper>
  )
}

StefnuvottarPage.getInitialProps = async ({ apolloClient, locale, query }) => {
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
          slug: 'stefnuvottar',
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

export default withMainLayout(StefnuvottarPage, {
  headerButtonColorScheme: 'negative',
  headerColorScheme: 'white',
})
