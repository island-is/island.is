/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import {
  Text,
  NavigationItem,
  LinkCard,
  FocusableBox,
  Stack,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Select,
  Input,
  Inline,
  Tag,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  ContentLanguage,
  Query,
  QueryGetArticlesArgs,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
  SortField,
  Article,
} from '@island.is/web/graphql/schema'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_SERVICES_QUERY,
} from '../queries'
import { Screen } from '../../types'
import { useNamespace } from '@island.is/web/hooks'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import {
  getThemeConfig,
  OrganizationWrapper,
  Webreader,
} from '@island.is/web/components'
import { CustomNextError } from '@island.is/web/units/errors'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { useLocalLinkTypeResolver } from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { hasProcessEntries } from '@island.is/web/utils/article'

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
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()

  useContentfulId(organizationPage?.id)
  useLocalLinkTypeResolver()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const navList: NavigationItem[] = organizationPage?.menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink?.text,
      href: primaryLink?.url,
      active: primaryLink?.url === router.asPath,
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
      })),
    }),
  )

  const [parameters, setParameters] = useState({
    query: '',
    categories: [],
    groups: [],
  })

  const filterItemComparator = (a: FilterItem, b: FilterItem) =>
    a.label.localeCompare(b.label)

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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        parameters.categories.includes(x.category?.slug)) &&
      (parameters.groups.length === 0 ||
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        parameters.groups.includes(x.group?.slug)),
  )

  groups = groups.filter((x) =>
    services
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      .filter((x) => parameters.categories.includes(x.category?.slug))
      .map((x) => x.group?.slug)
      .includes(x.value),
  )

  return (
    <OrganizationWrapper
      pageTitle={n('services', 'Þjónusta')}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      organizationPage={organizationPage}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      pageFeaturedImage={organizationPage?.featuredImage}
      fullWidthContent={false}
      stickySidebar={false}
      showReadSpeaker={false}
      breadcrumbItems={[
        {
          title: 'Ísland.is',
          href: linkResolver('homepage').href,
        },
        {
          title: organizationPage?.title ?? '',
          href: linkResolver('organizationpage', [organizationPage?.slug ?? ''])
            .href,
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
            <Text variant="h1" as="h1" marginBottom={0} marginTop={1}>
              {n('allServices', 'Öll þjónusta')}
            </Text>
            <Webreader
              marginBottom={4}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              readId={null}
              readClass="rs_read"
            />
          </GridColumn>
        </GridRow>
        <GridRow marginBottom={4}>
          <GridColumn span="1/2">
            <Input
              placeholder={n('filterSearch', 'Leita')}
              name="filterInput"
              value={parameters.query}
              icon={{ name: 'search' }}
              size="md"
              onChange={(e) =>
                setParameters({ ...parameters, query: e.target.value })
              }
            />
          </GridColumn>
          <GridColumn span="1/2">
            <Select
              backgroundColor="white"
              icon="chevronDown"
              label={n('services', 'Þjónustuflokkur')}
              isSearchable
              name="category"
              value={
                categories.find(
                  (x) => x.value === parameters.categories[0],
                ) ?? {
                  label: n('allServices', 'Allir þjónustuflokkar'),
                  value: '',
                }
              }
              options={[
                {
                  label: n('allServices', 'Allir þjónustuflokkar'),
                  value: '',
                },
                ...categories,
              ]}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              onChange={({ value }: Option) => {
                setParameters({
                  ...parameters,
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore make web strict
                  categories: value ? [value] : [],
                  groups: [],
                })
              }}
              size="sm"
            />
          </GridColumn>
        </GridRow>
      </GridContainer>
      {!!parameters.categories.length && groups.length > 1 && (
        <Box marginY={4}>
          <Inline space={2} alignY="center">
            {groups.map((x) => (
              <Tag
                key={x.value}
                variant="blue"
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore make web strict
                active={parameters.groups.includes(x.value)}
                onClick={() =>
                  setParameters({
                    ...parameters,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore make web strict
                    groups: parameters.groups.includes(x.value)
                      ? []
                      : [x.value],
                  })
                }
              >
                {x.label}
              </Tag>
            ))}
          </Inline>
        </Box>
      )}
      <Stack space={2}>
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
                  {...(hasProcessEntries(article as Article) ||
                    article.processEntryButtonText
                      ? {
                          tag: n(
                            article.processEntryButtonText || 'application',
                            'Umsókn',
                          ),
                        }
                      : {})}
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

ServicesPage.getProps = async ({ apolloClient, locale, query }) => {
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
            namespace: 'OrganizationPages',
            lang: locale,
          },
        },
      })
      .then((variables) =>
        variables.data.getNamespace?.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
  ])

  const {
    data: { getArticles },
  } = await apolloClient.query<Query, QueryGetArticlesArgs>({
    query: GET_ORGANIZATION_SERVICES_QUERY,
    variables: {
      input: {
        organization:
          getOrganizationPage?.organization?.slug ?? (query.slug as string),
        lang: locale as ContentLanguage,
        sort: query.sort === 'title' ? SortField.Title : SortField.Popular,
        size: 500,
      },
    },
  })

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

    ...getThemeConfig(
      getOrganizationPage?.theme,
      getOrganizationPage?.organization,
    ),
  }
}

export default withMainLayout(ServicesPage)
