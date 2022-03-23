import { GenericTagGroup } from '@island.is/api/schema'
import {
  Box,
  Filter,
  FilterInput,
  FilterMultiChoice,
  FocusableBox,
  GridColumn,
  GridContainer,
  GridRow,
  NavigationItem,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { getThemeConfig, OrganizationWrapper } from '@island.is/web/components'
import {
  ContentLanguage,
  EnhancedAsset,
  GenericTag,
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
import React, { useEffect, useMemo, useState } from 'react'
import { Screen } from '../../../types'
import { GET_NAMESPACE_QUERY, GET_ORGANIZATION_PAGE_QUERY } from '../../queries'
import { GET_PUBLISHED_MATERIAL_QUERY } from '../../queries/PublishedMaterial'

const ASSETS_PER_PAGE = 30

interface FilterCategory {
  id: string
  label: string
  selected: string[]
  filters: {
    value: string
    label: string
  }[]
}

const getAllGenericTags = (publishedMaterial: EnhancedAsset[]) => {
  const genericTagObject: Record<string, GenericTag> = {}
  publishedMaterial.forEach(({ genericTags }) =>
    genericTags.forEach((tag) => (genericTagObject[tag.id] = tag)),
  )
  return Object.keys(genericTagObject).map((key) => genericTagObject[key])
}

const getAllGenericTagGroups = (publishedMaterial: EnhancedAsset[]) => {
  const genericTagGroupObject: Record<string, GenericTagGroup> = {}
  publishedMaterial.forEach(({ genericTags }) =>
    genericTags.forEach(
      (tag) =>
        (genericTagGroupObject[tag.genericTagGroup.id] = tag.genericTagGroup),
    ),
  )
  return Object.keys(genericTagGroupObject).map(
    (key) => genericTagGroupObject[key],
  )
}

const getFilterCategories = (
  publishedMaterial: EnhancedAsset[],
): FilterCategory[] => {
  const tagGroups = getAllGenericTagGroups(publishedMaterial)
  const tags = getAllGenericTags(publishedMaterial)

  return tagGroups.map((tagGroup) => {
    return {
      id: tagGroup.slug,
      label: tagGroup.title,
      selected: [],
      filters: tags
        .filter((tag) => tag.genericTagGroup?.id === tagGroup.id)
        .map((tag) => ({ value: tag.slug, label: tag.title })),
    }
  })
}

const getInitialParameters = (filterCategories: FilterCategory[]) => {
  const parameters: Record<string, string[]> = {}
  filterCategories.forEach(({ id }) => (parameters[id] = []))
  return parameters
}

const PublishedMaterialItem = ({ item }: { item: EnhancedAsset }) => {
  const fileEnding = item.file?.url.split('.').pop().toUpperCase()
  return (
    <FocusableBox
      width="full"
      padding={[2, 2, 3]}
      href={
        item.file.url.startsWith('//')
          ? `https:${item.file.url}`
          : item.file.url
      }
      border="standard"
      borderRadius="large"
    >
      <Box borderRadius="large" position="relative" display="flex" width="full">
        <Text variant="h4" as="span" color="blue400">
          {item.title}
        </Text>
        {fileEnding && (
          <Box marginLeft="auto" paddingLeft={2}>
            <Tag disabled={true} outlined={true}>
              {fileEnding}
            </Tag>
          </Box>
        )}
      </Box>
    </FocusableBox>
  )
}

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

  const initialFilterCategories = useMemo(
    () => getFilterCategories(publishedMaterial.items),
    [publishedMaterial],
  )

  const [filterCategories, setFilterCategories] = useState<FilterCategory[]>(
    initialFilterCategories,
  )
  const [parameters, setParameters] = useState<Record<string, string[]>>({})

  useEffect(() => {
    setParameters(getInitialParameters(initialFilterCategories))
  }, [initialFilterCategories])

  useEffect(() => {
    setFilterCategories((prev) =>
      prev.map((category) => ({
        ...category,
        selected: parameters[category.id] ?? category.selected,
      })),
    )
  }, [parameters])

  const pageTitle = n('pageTitle', 'Útgefið efni')

  const isMobile = width < theme.breakpoints.md

  const isAnyFilterSelected = !Object.keys(parameters).every(
    (key) => parameters[key]?.length === 0,
  )

  const filteredItems = publishedMaterial.items.filter(
    (item) =>
      item.file?.url &&
      item.title.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1 &&
      (!isAnyFilterSelected ||
        item.genericTags.some((tag) =>
          filterCategories.some((category) =>
            category.selected.includes(tag.slug),
          ),
        )),
  )

  console.log(publishedMaterial)

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
              setParameters(getInitialParameters(filterCategories))
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
                <PublishedMaterialItem item={item} />
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
          page: 1,
          size: 10,
          searchString: 'a',
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
    publishedMaterial: getPublishedMaterial,
    namespace,
    ...getThemeConfig(getOrganizationPage.theme),
  }
}

export default withMainLayout(PublishedMaterial)
