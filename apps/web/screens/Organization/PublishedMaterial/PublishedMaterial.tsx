import {
  Filter,
  FilterInput,
  FilterMultiChoice,
  FocusableBox,
  GridColumn,
  GridContainer,
  GridRow,
  LinkCard,
  NavigationItem,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { getThemeConfig, OrganizationWrapper } from '@island.is/web/components'
import {
  ContentLanguage,
  GetNamespaceQuery,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
  QueryGetPublishedMaterialArgs,
} from '@island.is/web/graphql/schema'
import { linkResolver, useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Screen } from '../../../types'
import { GET_NAMESPACE_QUERY, GET_ORGANIZATION_PAGE_QUERY } from '../../queries'
import { GET_PUBLISHED_MATERIAL_QUERY } from '../../queries/PublishedMaterial'

interface PublishedMaterialProps {
  organizationPage: Query['getOrganizationPage']
  publishedMaterial: Query['getPublishedMaterial']
  namespace: Record<string, string>
}

const PublishedMaterial: Screen<PublishedMaterialProps> = ({
  organizationPage,
  publishedMaterial,
  namespace,
}) => {
  const router = useRouter()
  const { width } = useWindowSize()
  const [searchValue, setSearchValue] = useState('')
  const n = useNamespace(namespace)

  useContentfulId(organizationPage.id)
  useLocalLinkTypeResolver()

  const pageUrl = `${organizationPage.slug}/${router.asPath.split('/').pop()}`

  const navList: NavigationItem[] = organizationPage.menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink.text,
      href: primaryLink.url,
      active:
        primaryLink.url.includes(pageUrl) ||
        childrenLinks.some((link) => link.url.includes(pageUrl)),
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
        active: url.includes(pageUrl),
      })),
    }),
  )

  const [parameters, setParameters] = useState({
    tegundutgafu: [],
  })

  const filterCategories = [
    {
      id: 'tegundutgafu',
      label: 'Tegund útgáfu',
      selected: parameters.tegundutgafu,
      filters: [
        {
          value: 'arsskyrslur',
          label: 'Ársskýrslur',
        },
        {
          value: 'skyrslur',
          label: 'Skýrslur',
        },
        {
          value: 'greinar',
          label: 'Greinar',
        },
      ],
    },
  ]

  const pageTitle = n('pageTitle', 'Útgefið efni')

  const isMobile = width < theme.breakpoints.md

  const filteredItems = publishedMaterial.filter(
    (item) =>
      item.title.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1,
  )

  return (
    <OrganizationWrapper
      pageTitle={pageTitle}
      organizationPage={organizationPage}
      breadcrumbItems={[
        {
          title: 'Ísland.is',
          href: linkResolver('homepage').href,
        },
        {
          title: organizationPage.title,
          href: linkResolver('organizationpage', [organizationPage.slug]).href,
        },
      ]}
      navigationData={{
        title: n('sidebarTitle', 'Efnisyfirlit'),
        items: navList,
      }}
    >
      <GridContainer>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/12', '6/12', '8/12']}>
            <Text variant="h1" as="h1" marginBottom={4} marginTop={1}>
              {pageTitle}
            </Text>
          </GridColumn>
        </GridRow>
        <GridRow>
          <Filter
            variant={isMobile ? 'dialog' : 'popover'}
            align="right"
            labelClear={n('clearFilter', 'Hreinsa síu')}
            labelClearAll={n('clearAllFilters', 'Hreinsa allar síu')}
            labelOpen={n('openFilter', 'Opna síu')}
            labelClose={n('closeFilter', 'Loka síu')}
            labelResult={n('viewResults', 'Skoða niðurstöður')}
            labelTitle={n('filterMenuTitle', 'Sía útgefið efni')}
            filterInput={
              <FilterInput
                placeholder={n(
                  'filterSearchPlaceholder',
                  'Sía eftir leitarorði',
                )}
                name="filterInput"
                value={searchValue}
                onChange={setSearchValue}
              />
            }
            onFilterClear={() => {
              setParameters((prevParameters) => {
                const newParameters = { ...prevParameters }
                for (const key in newParameters) newParameters[key] = []
                return newParameters
              })
              setSearchValue('')
            }}
          >
            <FilterMultiChoice
              labelClear={n('clearSelection', 'Hreinsa val')}
              onChange={({ categoryId, selected }) =>
                setParameters((prevParameters) => ({
                  ...prevParameters,
                  [categoryId]: selected,
                }))
              }
              onClear={(categoryId) =>
                setParameters((prevParameters) => ({
                  ...prevParameters,
                  [categoryId]: [],
                }))
              }
              categories={filterCategories}
            ></FilterMultiChoice>
          </Filter>
        </GridRow>

        <GridContainer>
          {filteredItems.map((item, index) => {
            return (
              <GridRow
                key={item.id}
                marginTop={index === 0 ? 6 : 2}
                marginBottom={2}
              >
                <FocusableBox
                  width="full"
                  href={item.file?.url}
                  border="standard"
                  borderRadius="large"
                >
                  <LinkCard
                    color="black"
                    background="white"
                    tag={item.file?.url.split('.').pop().toUpperCase()}
                  >
                    {item.title}
                  </LinkCard>
                </FocusableBox>
              </GridRow>
            )
          })}
        </GridContainer>
      </GridContainer>
    </OrganizationWrapper>
  )
}

PublishedMaterial.getInitialProps = async ({ apolloClient, locale, query }) => {
  const [
    {
      data: { getOrganizationPage },
    },
    {
      data: { getPublishedMaterial },
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
    apolloClient.query<Query, QueryGetPublishedMaterialArgs>({
      query: GET_PUBLISHED_MATERIAL_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
          organizationSlug: query.slug as string,
        },
      },
    }),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            lang: locale as ContentLanguage,
            namespace: 'OrganizationPublishedMaterial',
          },
        },
      })
      .then((variables) => {
        // map data here to reduce data processing in component
        return JSON.parse(variables?.data?.getNamespace?.fields ?? '{}')
      }),
  ])

  if (!getOrganizationPage) {
    throw new CustomNextError(404, 'Organization page not found')
  }

  return {
    organizationPage: getOrganizationPage,
    publishedMaterial: getPublishedMaterial ?? [],
    namespace,
    ...getThemeConfig(getOrganizationPage.theme),
  }
}

export default withMainLayout(PublishedMaterial)
