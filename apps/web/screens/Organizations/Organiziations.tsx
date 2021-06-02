import React, { useState } from 'react'
import NextLink from 'next/link'
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
} from '@island.is/island-ui/core'
import {
  Query,
  QueryGetNamespaceArgs,
  ContentLanguage,
  QueryGetOrganizationTagsArgs,
  QueryGetOrganizationArgs,
} from '@island.is/api/schema'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Card, HeadWithSocialSharing } from '@island.is/web/components'
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
import { FilterMenu, CategoriesProps, FilterProps } from './FilterMenu'

import * as styles from './Organizations.treat'

const CARDS_PER_PAGE = 10

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
  const n = useNamespace(namespace)
  const [page, setPage] = useState<number>(1)
  const { linkResolver } = useLinkResolver()

  const [filter, setFilter] = useState<FilterProps>({
    raduneyti: [],
    input: '',
  })

  const { items: organizationsItems } = organizations
  const { items: tagsItems } = tags

  const categories: CategoriesProps[] = [
    {
      id: 'raduneyti',
      label: 'Ráðuneyti',
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

  const resetPagination = () => {
    setPage(1)
    window.scrollTo(0, 0)
  }

  const metaTitle = `${n(
    'stofnanirHeading',
    'Stofnanir Íslenska Ríkisins',
  )} | Ísland.is`

  return (
    <>
      <HeadWithSocialSharing title={metaTitle} />
      <SidebarLayout sidebarContent={null}>
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
      <Box
        background="blue100"
        display="inlineBlock"
        width="full"
        paddingTop={[verticalSpacing, 0]}
      >
        <ColorSchemeContext.Provider value={{ colorScheme: 'blue' }}>
          <SidebarLayout
            contentId="organizations-list"
            sidebarContent={
              <FilterMenu
                categories={categories}
                filter={filter}
                setFilter={setFilter}
                resultCount={filteredItems.length}
                onBeforeUpdate={resetPagination}
              />
            }
            hiddenOnTablet
          >
            <GridContainer>
              <GridRow>
                <GridColumn
                  hiddenAbove="md"
                  span="12/12"
                  paddingBottom={verticalSpacing}
                >
                  <FilterMenu
                    categories={categories}
                    filter={filter}
                    setFilter={setFilter}
                    resultCount={filteredItems.length}
                    onBeforeUpdate={resetPagination}
                    asDialog={true}
                  />
                </GridColumn>
              </GridRow>
              <GridRow>
                {visibleItems.map(
                  ({ title, description, tag, link }, index) => {
                    const tags =
                      (tag &&
                        tag.map((x) => ({
                          title: x.title,
                          tagProps: {
                            outlined: true,
                          },
                        }))) ||
                      []

                    return (
                      <GridColumn
                        key={index}
                        span={['12/12', '6/12', '6/12', '12/12', '6/12']}
                        paddingBottom={verticalSpacing}
                      >
                        <Card
                          link={{ href: link }}
                          key={index}
                          description={description}
                          title={title}
                          tags={tags}
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
                        renderLink={(page, className, children) => (
                          <button
                            onClick={() => {
                              setPage(page)
                              window.scrollTo(0, 0)
                            }}
                          >
                            <span className={styles.srOnly}>
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
          </SidebarLayout>
        </ColorSchemeContext.Provider>
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
