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
  GridColumn,
  GridContainer,
  GridRow,
  Select,
  Option,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  ContentLanguage,
  Query,
  QueryGetArticlesArgs,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
  SortField,
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
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import getConfig from 'next/config'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { useRouter } from 'next/router'

const { publicRuntimeConfig } = getConfig()

interface ServicesPageProps {
  organizationPage: Query['getOrganizationPage']
  services: Query['getArticles']
  categories: FilterItem[]
  groups: FilterItem[]
  sort: string
  namespace: Query['getNamespace']
}

type FilterItem = {
  value: string
  label: string
}

const ServicesPage: Screen<ServicesPageProps> = ({
  organizationPage,
  services,
  categories,
  groups,
  sort,
  namespace,
}) => {
  const { disableSyslumennPage: disablePage } = publicRuntimeConfig
  if (disablePage === 'true') {
    throw new CustomNextError(404, 'Not found')
  }

  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const Router = useRouter()
  useContentfulId(organizationPage.id)

  const navList: NavigationItem[] = organizationPage.menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink.text,
      href: primaryLink.url,
      active:
        primaryLink.url === `/stofnanir/${organizationPage.slug}/thjonusta`,
    }),
  )

  const [parameters, setParameters] = useState({
    query: '',
    categories: [],
    groups: [],
  })

  const filterItemComparator = (a, b) => a.label.localeCompare(b.label)

  categories.sort(filterItemComparator)
  groups.sort(filterItemComparator)

  const sortOptions = [
    {
      label: n('sortByPopular', 'Vinsælast'),
      value: 'popular',
    },
    {
      label: n('sortByTitle', 'Stafrófsröð'),
      value: 'title',
    },
  ]

  const matches = services.filter(
    (x) =>
      x.title.toLowerCase().includes(parameters.query.toLowerCase()) &&
      (parameters.categories.length === 0 ||
        parameters.categories.includes(x.category?.slug)) &&
      (parameters.groups.length === 0 ||
        parameters.groups.includes(x.group?.slug)),
  )

  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md

  return (
    <OrganizationWrapper
      pageTitle={n('services', 'Þjónusta')}
      organizationPage={organizationPage}
      pageFeaturedImage={organizationPage.featuredImage}
      fullWidthContent={false}
      stickySidebar={false}
      sidebarContent={
        <Box marginTop={[3, 3, 8]}>
          <Filter
            labelClear={n('filterClear', 'Hreinsa')}
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
              placeholder={n('filterSearch', 'Leita')}
              name="filterInput"
              value={parameters.query}
              onChange={(value) =>
                setParameters({ ...parameters, query: value })
              }
            />
            <Box
              borderRadius="large"
              borderColor="blue200"
              borderWidth="standard"
            >
              <FilterMultiChoice
                labelClear={n('filterClear', 'Hreinsa')}
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
                    id: 'categories',
                    label: n('filterCategories', 'Þjónustuflokkar'),
                    selected: parameters.categories,
                    filters: categories,
                  },
                  {
                    id: 'groups',
                    label: n('filterGroups', 'Málefni'),
                    selected: parameters.groups,
                    filters: groups,
                  },
                ]}
              />
            </Box>
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
      }}
    >
      <GridContainer>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/12', '6/12', '8/12']}>
            <Text variant="h1" as="h1" marginBottom={4} marginTop={1}>
              {n('allServices', 'Öll þjónusta')}
            </Text>
          </GridColumn>
          <GridColumn
            span={['12/12', '12/12', '6/12', '6/12', '4/12']}
            paddingBottom={[4, 4, 0]}
          >
            <Select
              backgroundColor="white"
              icon="chevronDown"
              isSearchable
              label={n('order', 'Röðun')}
              name="sort"
              value={sortOptions.find((x) => x.value === sort)}
              options={sortOptions}
              onChange={({ value }: Option) => {
                Router.push({
                  pathname: linkResolver('organizationservices', [
                    organizationPage.slug,
                  ]).href,
                  query: { sort: value },
                })
              }}
              size="sm"
            />
          </GridColumn>
        </GridRow>
      </GridContainer>
      <Stack space={2}>
        {matches.map((article) => {
          const url = linkResolver('Article' as LinkType, [article.slug])
          return (
            <FocusableBox
              key={article.slug}
              href={url.href}
              target={isMobile ? '' : '_blank'}
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
          slug: query.slug as string,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetArticlesArgs>({
      query: GET_ORGANIZATION_SERVICES_QUERY,
      variables: {
        input: {
          organization: query.slug as string,
          lang: locale as ContentLanguage,
          sort: query.sort === 'title' ? SortField.Title : SortField.Popular,
          size: 500,
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

  const categories: FilterItem[] = []
  const groups: FilterItem[] = []

  for (const service of getArticles) {
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

  return {
    organizationPage: getOrganizationPage,
    services: getArticles,
    namespace,
    categories,
    groups,
    sort: (query.sort as string) ?? 'popular',
    showSearchInHeader: false,
  }
}

export default withMainLayout(ServicesPage, {
  headerButtonColorScheme: 'negative',
  headerColorScheme: 'white',
})
