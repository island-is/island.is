/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import {
  Text,
  NavigationItem,
  LinkCard,
  FocusableBox,
  Stack,
  Box,
  Filter,
  FilterInput,
  FilterMultiChoice,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  ContentLanguage,
  Query,
  QueryGetArticlesArgs,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_SERVICES_QUERY,
} from '../queries'
import { Screen } from '../../types'
import { useNamespace } from '@island.is/web/hooks'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { OrganizationWrapper } from '@island.is/web/components'
import { CustomNextError } from '@island.is/web/units/errors'

interface ServicesPageProps {
  organizationPage: Query['getOrganizationPage']
  services: Query['getArticles']
  namespace: Query['getNamespace']
}

type FilterItem = {
  value: string
  label: string
}

const ServicesPage: Screen<ServicesPageProps> = ({
  organizationPage,
  services,
  namespace,
}) => {
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()

  const navList: NavigationItem[] = organizationPage.menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink.text,
      href: primaryLink.url,
      active: primaryLink.url === '/stofnanir/syslumenn/thjonusta',
    }),
  )

  const [parameters, setParameters] = useState({
    query: '',
    categories: [],
    groups: [],
  })

  console.log(parameters)

  const categories: FilterItem[] = []
  const groups: FilterItem[] = []

  for (const service of services) {
    if (
      !!service.category &&
      categories.every((x) => x.value !== service.category?.slug)
    ) {
      categories.push({
        value: service.category?.slug,
        label: service.category?.title,
      })
    }
    if (
      !!service.group &&
      groups.every((x) => x.value !== service.group?.slug)
    ) {
      groups.push({ value: service.group?.slug, label: service.group?.title })
    }
  }

  const filterItemComparator = (a, b) => a.label.localeCompare(b.label)

  categories.sort(filterItemComparator)
  groups.sort(filterItemComparator)

  const matches = services.filter(
    (x) =>
      x.title.toLowerCase().includes(parameters.query) &&
      (parameters.categories.length === 0 ||
        parameters.categories.includes(x.category?.slug)) &&
      (parameters.groups.length === 0 ||
        parameters.groups.includes(x.group?.slug)),
  )
  console.log(matches)

  return (
    <OrganizationWrapper
      pageTitle={'Þjónusta'}
      organizationPage={organizationPage}
      pageFeaturedImage={organizationPage.featuredImage}
      fullWidthContent={false}
      sidebarContent={
        <Box paddingTop={8}>
          <Filter
            labelClear={'Hreinsa'}
            labelOpen={'openFilterButton'}
            labelClose={'closeFilter'}
            labelResult={'mobileResult'}
            labelTitle={'mobileTitle'}
            resultCount={4}
            onFilterClear={() =>
              setParameters({ query: '', categories: [], groups: [] })
            }
          >
            <FilterInput
              placeholder={'Leita'}
              name="filterInput"
              value={parameters.query}
              onChange={(value) =>
                setParameters({ ...parameters, query: value })
              }
            />
            <FilterMultiChoice
              labelClear={'Hreinsa'}
              onChange={({ categoryId, selected }) => {
                console.log({ categoryId, selected })
                setParameters({
                  ...parameters,
                  [categoryId]: selected,
                })
              }}
              onClear={(categoryId) =>
                setParameters({
                  ...parameters,
                  [categoryId]: [],
                })
              }
              categories={[
                {
                  id: 'categories',
                  label: 'Þjónstuflokkar',
                  selected: parameters.categories,
                  filters: categories,
                },
              ]}
            />
            <FilterMultiChoice
              labelClear={'Hreinsa'}
              onChange={({ categoryId, selected }) => {
                setParameters({
                  ...parameters,
                  [categoryId]: selected,
                })
              }}
              onClear={(categoryId) =>
                setParameters({
                  ...parameters,
                  [categoryId]: [],
                })
              }
              categories={[
                {
                  id: 'groups',
                  label: 'Málefni',
                  selected: parameters.groups,
                  filters: groups,
                },
              ]}
            />
          </Filter>
        </Box>
      }
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
      <Text variant="h1" as="h1" marginBottom={4}>
        Öll þjónusta
      </Text>
      <Stack space={4}>
        {matches.map((article) => {
          const url = linkResolver('Article' as LinkType, [article.slug])
          return (
            <FocusableBox
              key={article.slug}
              href={url.href}
              borderRadius="large"
            >
              {({ isFocused }) => (
                <LinkCard
                  isFocused={isFocused}
                  tag={
                    !!article.processEntry && n('applicationProcess', 'Umsókn')
                  }
                >
                  {article.title}
                </LinkCard>
              )}
            </FocusableBox>
          )
        })}
      </Stack>
    </OrganizationWrapper>
  )
}

ServicesPage.getInitialProps = async ({ apolloClient, locale, query }) => {
  const [
    {
      data: { getOrganizationPage },
    },
    {
      data: { getArticles },
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
    apolloClient.query<Query, QueryGetArticlesArgs>({
      query: GET_ORGANIZATION_SERVICES_QUERY,
      variables: {
        input: {
          organization: 'syslumenn',
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

  if (!getArticles) {
    throw new CustomNextError(404, 'Organization services page not found')
  }

  return {
    organizationPage: getOrganizationPage,
    services: getArticles,
    namespace,
    showSearchInHeader: false,
  }
}

export default withMainLayout(ServicesPage, {
  headerButtonColorScheme: 'negative',
  headerColorScheme: 'white',
})
