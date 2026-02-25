import { useEffect, useMemo, useState } from 'react'
import { useWindowSize } from 'react-use'
import NextLink from 'next/link'

import {
  Box,
  Breadcrumbs,
  CategoryCard,
  ColorSchemeContext,
  GridColumn,
  GridContainer,
  GridRow,
  Pagination,
  ResponsiveSpace,
  Select,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { helperStyles, theme } from '@island.is/island-ui/theme'
import { sortAlpha } from '@island.is/shared/utils'
import { HeadWithSocialSharing } from '@island.is/web/components'
import {
  ContentLanguage,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationsArgs,
  QueryGetOrganizationTagsArgs,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'
import { getOrganizationLink } from '@island.is/web/utils/organization'

import { CustomNextError } from '../../units/errors'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_TAGS_QUERY,
  GET_ORGANIZATIONS_QUERY,
} from '../queries'
import {
  CategoriesProps,
  FilterLabels,
  FilterMenu,
  FilterOptions,
} from './FilterMenu'
import * as styles from './Organizations.css'

const CARDS_PER_PAGE = 12

interface TitleSortOption {
  label: string
  value: 'asc' | 'desc'
}

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
      setIsMobile(true)
      return
    }
    setIsMobile(false)
  }, [width])
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const n = useNamespace(namespace)
  const [page, setPage] = useState<number>(1)
  const { linkResolver } = useLinkResolver()
  const { activeLocale } = useI18n()

  const [filter, setFilter] = useState<FilterOptions>({
    raduneyti: [],
    input: '',
  })

  const titleSortOptions = useMemo<TitleSortOption[]>(
    () => [
      { label: n('sortByTitleAscending', 'Heiti (a-ö)'), value: 'asc' },
      { label: n('sortByTitleDescending', 'Heiti (ö-a)'), value: 'desc' },
    ],
    [],
  )

  const [selectedTitleSortOption, setSelectedTitleSortOption] =
    useState<TitleSortOption>(titleSortOptions[0])

  const organizationsItems = useMemo(() => {
    const items = [...organizations.items]
    if (selectedTitleSortOption.value === 'asc') {
      items.sort(sortAlpha('title'))
    } else {
      items.sort((a, b) => sortAlpha('title')(b, a))
    }
    return items
  }, [organizations, selectedTitleSortOption])

  const tagsItems = useMemo(
    () => tags?.items.filter((x) => x.title).sort(sortAlpha('title')),
    [tags],
  )

  const categories: CategoriesProps[] = [
    {
      id: 'raduneyti',
      label: n('ministries', 'Ráðuneyti'),
      selected: filter.raduneyti,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      filters: tagsItems.map((f) => ({
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
                      <NextLink
                        {...linkResolver('homepage')}
                        passHref
                        legacyBehavior
                      >
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
              <Box className={styles.orderByContainer}>
                <Select
                  label={n('orderBy', 'Raða eftir')}
                  name="sort-option-select"
                  size="xs"
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore make web strict
                  onChange={(option) => {
                    setSelectedTitleSortOption(option as TitleSortOption)
                  }}
                  value={selectedTitleSortOption}
                  options={titleSortOptions}
                />
              </Box>
            </Box>

            <GridRow>
              {visibleItems.map((organization, index) => {
                const tags =
                  organization?.tag &&
                  organization.tag.map((x) => ({
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
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore make web strict
                      href={getOrganizationLink(organization, activeLocale)}
                      key={index}
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore make web strict
                      // we do not want to show text on the card here, but the component requires it
                      text={undefined}
                      heading={organization?.title}
                      hyphenate
                      {...(tags?.length && { tags })}
                      tagOptions={{
                        hyphenate: true,
                        textLeft: true,
                        truncate: true,
                      }}
                      {...(organization?.logo?.url && {
                        src: organization.logo.url,
                        alt: organization.logo.title,
                        autoStack: true,
                      })}
                    />
                  </GridColumn>
                )
              })}
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

OrganizationPage.getProps = async ({ apolloClient, locale }) => {
  const [
    {
      data: { getOrganizations },
    },
    {
      data: { getOrganizationTags },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationsArgs>({
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
      .then((content) =>
        content.data.getNamespace?.fields
          ? JSON.parse(content.data.getNamespace.fields)
          : {},
      ),
  ])

  // we assume 404 if no Organization is found
  if (!getOrganizations) {
    throw new CustomNextError(404, 'Þessi síða fannst ekki!')
  }

  return {
    organizations: {
      __typename: getOrganizations.__typename,
      items: getOrganizations.items.filter(
        (o) => o.showsUpOnTheOrganizationsPage,
      ),
    },
    tags: getOrganizationTags,
    namespace,
  }
}

export default withMainLayout(OrganizationPage)
