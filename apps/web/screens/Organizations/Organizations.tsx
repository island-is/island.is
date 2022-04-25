import React, { useEffect, useState } from 'react'
import NextLink from 'next/link'
import { useWindowSize } from 'react-use'
import {
  Box,
  Text,
  Breadcrumbs,
  ColorSchemeContext,
  GridColumn,
  GridContainer,
  GridRow,
  ResponsiveSpace,
  Pagination,
  CategoryCard,
  Stack,
} from '@island.is/island-ui/core'
import { helperStyles, theme } from '@island.is/island-ui/theme'
import {
  Query,
  QueryGetNamespaceArgs,
  ContentLanguage,
  QueryGetOrganizationTagsArgs,
  QueryGetOrganizationArgs,
} from '@island.is/api/schema'
import { withMainLayout } from '@island.is/web/layouts/main'
import { HeadWithSocialSharing } from '@island.is/web/components'
import {
  GET_ORGANIZATIONS_QUERY,
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_TAGS_QUERY,
} from '../queries'
import { useNamespace } from '@island.is/web/hooks'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '../../units/errors'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import {
  FilterMenu,
  CategoriesProps,
  FilterOptions,
  FilterLabels,
} from './FilterMenu'

const CARDS_PER_PAGE = 12

interface OrganizationProps {
  organizations: Query['getOrganizations']
  tags: Query['getOrganizationTags']
  namespace: Query['getNamespace']
}

const verticalSpacing: ResponsiveSpace = 3

const OrganizationPage: Screen<OrganizationProps> = ({
  organizations,
  tags,
  namespace,
}) => {
  const [isMobile, setIsMobile] = useState(false)
  const { width } = useWindowSize()
  useEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])
  const n = useNamespace(namespace)
  const [page, setPage] = useState<number>(1)
  const { linkResolver } = useLinkResolver()

  const [filter, setFilter] = useState<FilterOptions>({
    raduneyti: [],
    input: '',
  })

  const { items: organizationsItems } = organizations
  const { items: tagsItems } = tags

  const categories: CategoriesProps[] = [
    {
      id: 'raduneyti',
      label: n('ministries', 'Ráðuneyti'),
      selected: filter.raduneyti,
      filters: tagsItems
        .filter((x) => x.title)
        .map((f) => ({
          value: f.title,
          label: f.title,
        })),
    },
  ]

  const hasFilters = filter.raduneyti.length || filter.input
  const filteredItems = hasFilters
    ? organizationsItems.filter(
        (x) =>
          (filter.input &&
            x.title
              .trim()
              .toLowerCase()
              .includes(filter.input.trim().toLowerCase())) ||
          filter.raduneyti.some((title) =>
            x.tag.find((t) => t.title === title),
          ),
      )
    : organizationsItems

  const count = filteredItems.length
  const totalPages = Math.ceil(count / CARDS_PER_PAGE)
  const base = page === 1 ? 0 : (page - 1) * CARDS_PER_PAGE
  const visibleItems = filteredItems.slice(base, page * CARDS_PER_PAGE)

  const goToPage = (page = 1, scrollTop = true) => {
    setPage(page)

    if (scrollTop) {
      window.scrollTo(0, 0)
    }
  }

  const metaTitle = `${n(
    'stofnanirHeading',
    'Stofnanir Íslenska Ríkisins',
  )} | Ísland.is`

  const filterLabels: FilterLabels = {
    labelClearAll: n('filterClearAll', 'Hreinsa allar síur'),
    labelClear: n('filterClear', 'Hreinsa síu'),
    labelOpen: n('filterOpen', 'Sía niðurstöður'),
    labelClose: n('filterClose', 'Loka síu'),
    labelTitle: n('filterOrganization', 'Sía stofnanir'),
    labelResult: n('showResults', 'Sýna niðurstöður'),
    inputPlaceholder: n('filterBySearchQuery', 'Sía eftir leitarorði'),
  }

  return (
    <>
      <HeadWithSocialSharing title={metaTitle} />
      <Box paddingTop={[2, 2, 2, 10]} paddingBottom={[4, 4, 4, 10]}>
        <GridContainer>
          <GridRow>
            <GridColumn
              offset={['0', '0', '0', '1/12']}
              span={['12/12', '12/12', '12/12', '10/12']}
            >
              <Stack space={2}>
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
                <Text variant="h1" as="h1">
                  {n('stofnanirHeading', 'Stofnanir Íslenska Ríkisins')}
                </Text>
              </Stack>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>

      <Box background="blue100" display="inlineBlock" width="full">
        <ColorSchemeContext.Provider value={{ colorScheme: 'blue' }}>
          <GridContainer id="organizations-list">
            <Box marginY={[3, 3, 6]}>
              <FilterMenu
                {...filterLabels}
                categories={categories}
                filter={filter}
                setFilter={setFilter}
                resultCount={filteredItems.length}
                onBeforeUpdate={() => goToPage(1, false)}
                align="right"
                variant={isMobile ? 'dialog' : 'popover'}
              />
            </Box>
            <GridRow>
              {visibleItems.map(
                ({ title, description, tag, link, logo }, index) => {
                  const tags =
                    tag &&
                    tag.map((x) => ({
                      title: x.title,
                      label: x.title,
                    }))

                  return (
                    <GridColumn
                      key={index}
                      span={['12/12', '6/12', '6/12', '4/12']}
                      paddingBottom={verticalSpacing}
                    >
                      <CategoryCard
                        href={link}
                        key={index}
                        text={description}
                        heading={title}
                        hyphenate
                        {...(tags?.length && { tags })}
                        tagOptions={{
                          hyphenate: true,
                          textLeft: true,
                        }}
                        {...(logo?.url && {
                          src: logo.url,
                          alt: logo.title,
                          autoStack: true,
                        })}
                      />
                    </GridColumn>
                  )
                },
              )}
            </GridRow>
            {totalPages > 1 && (
              <GridRow>
                <GridColumn span="12/12">
                  <Box paddingTop={8}>
                    <Pagination
                      page={page}
                      totalPages={totalPages}
                      variant="blue"
                      renderLink={(page, className, children) => (
                        <button
                          onClick={() => {
                            goToPage(page)
                          }}
                        >
                          <span className={helperStyles.srOnly}>
                            {n('page', 'Síða')}
                          </span>
                          <span className={className}>{children}</span>
                        </button>
                      )}
                    />
                  </Box>
                </GridColumn>
              </GridRow>
            )}
          </GridContainer>
        </ColorSchemeContext.Provider>
      </Box>
    </>
  )
}

OrganizationPage.getInitialProps = async ({ apolloClient, locale }) => {
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
