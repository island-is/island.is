import React, { useRef, useEffect, useState, FC, useMemo } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { Screen } from '../../types'
import {
  Sidebar,
  SearchInput,
  Card,
  CardTagsProps,
} from '@island.is/web/components'
import {
  Box,
  Text,
  Stack,
  Breadcrumbs,
  Hidden,
  Select,
  Option,
  SidebarAccordion,
  Pagination,
  Link,
  LinkContext,
} from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'
import { useNamespace } from '@island.is/web/hooks'
import {
  GET_NAMESPACE_QUERY,
  GET_SEARCH_RESULTS_QUERY_DETAILED,
  GET_SEARCH_COUNT_QUERY,
  GET_SEARCH_RESULTS_TOTAL,
} from '../queries'
import { SidebarLayout } from '../Layouts/SidebarLayout'
import { CustomNextError } from '@island.is/web/units/errors'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  GetSearchResultsDetailedQuery,
  GetSearchResultsNewsQuery,
  GetSearchCountTagsQuery,
  QuerySearchResultsArgs,
  ContentLanguage,
  QueryGetNamespaceArgs,
  GetNamespaceQuery,
  Article,
  LifeEventPage,
  News,
  SearchableContentTypes,
  SearchableTags,
  AdgerdirPage,
  SubArticle,
  GetSearchResultsTotalQuery,
  OrganizationSubpage,
} from '../../graphql/schema'
import { Image } from '@island.is/web/graphql/schema'
import * as styles from './Search.css'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useLazyQuery } from '@apollo/client'

const PERPAGE = 10

type SearchQueryFilters = {
  category: string
  type: string
}

interface CategoryProps {
  q: string
  page: number
  searchResults: GetSearchResultsDetailedQuery['searchResults']
  countResults: GetSearchCountTagsQuery['searchResults']
  namespace: GetNamespaceQuery['getNamespace']
}

interface SidebarTagMap {
  [key: string]: {
    title: string
    total: number
  }
}

interface SidebarData {
  totalTagCount: number
  tags: SidebarTagMap
  types: SidebarTagMap
}

const Search: Screen<CategoryProps> = ({
  q,
  page,
  searchResults,
  countResults,
  namespace,
}) => {
  const { activeLocale } = useI18n()
  const searchRef = useRef<HTMLInputElement | null>(null)
  const Router = useRouter()
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const [sidebarData, setSidebarData] = useState<SidebarData>({
    totalTagCount: 0,
    tags: {},
    types: {},
  })

  const filters: SearchQueryFilters = {
    category: Router.query.category as string,
    type: Router.query.type as string,
  }

  useEffect(() => {
    // we get the tag count manually since the total includes uncategorised data and the type count
    let totalTagCount = 0
    // create a map of sidebar tag data for easier lookup later
    const tagCountResults = countResults.tagCounts.reduce(
      (tagList: SidebarTagMap, { key, count: total, value: title }) => {
        // in some rare cases a tag might be empty we skip counting and rendering it
        if (key && title) {
          totalTagCount = totalTagCount + total

          tagList[key] = {
            title,
            total,
          }
        }

        return tagList
      },
      {},
    )

    // create a map of sidebar type data for easier lookup later
    const typeNames = {
      webNews: n('newsTitle'),
      webOrganizationSubpage: n('organizationsTitle', 'Opinberir aðilar'),
    }
    const typeCountResults = countResults.typesCount.reduce(
      (typeList: SidebarTagMap, { key, count: total }) => {
        if (Object.keys(typeNames).includes(key)) {
          typeList[key] = {
            title: typeNames[key],
            total,
          }
        }
        return typeList
      },
      {},
    )
    setSidebarData({
      totalTagCount,
      tags: tagCountResults,
      types: typeCountResults,
    })
  }, [countResults])

  const getLabels = (item) => {
    const labels = []
    switch (
      item.__typename as LifeEventPage['__typename'] & News['__typename']
    ) {
      case 'LifeEventPage':
        labels.push(n('lifeEvent'))
        break
      case 'News':
        labels.push(n('newsTitle'))
        break
      case 'AdgerdirPage':
        labels.push(n('adgerdirTitle'))
        break
      default:
        break
    }

    if (item.processEntry) {
      labels.push(n('applicationForm'))
    }

    if (item.group) {
      labels.push(item.group.title)
    }

    if (item.organization?.length) {
      labels.push(item.organization[0].title)
    }

    if (item.parent) {
      if (item.parent.group) {
        labels.push(item.parent.group.title)
      }

      if (item.parent.organization?.length) {
        labels.push(item.parent.organization[0].title)
      }
    }

    return labels
  }

  const searchResultsItems = (
    searchResults.items as Array<
      Article &
        LifeEventPage &
        News &
        AdgerdirPage &
        SubArticle &
        OrganizationSubpage
    >
  ).map((item) => ({
    title: item.title,
    parentTitle: item.parent?.title,
    description: item.intro ?? item.description ?? item.parent?.intro,
    link: linkResolver(item.__typename, item?.url ?? item.slug.split('/')),
    categorySlug: item.category?.slug,
    category: item.category,
    group: item.group,
    ...(item.image && { image: item.image as Image }),
    ...(item.thumbnail && { thumbnail: item.thumbnail as Image }),
    labels: getLabels(item),
  }))

  const onRemoveFilters = () => {
    Router.replace({
      pathname: linkResolver('search').href,
      query: { q },
    })
  }

  const onSelectSidebarTag = (type: 'category' | 'type', key: string) => {
    Router.push({
      pathname: linkResolver('search').href,
      query: { q, [type]: key },
    })
  }

  const byCategory = (item) => {
    if (!item.category && filters.category === 'uncategorized') {
      return true
    }

    return !filters.category || filters.category === item.categorySlug
  }

  const filteredItems = searchResultsItems.filter(byCategory)
  const totalSearchResults = searchResults.total
  const totalPages = Math.ceil(totalSearchResults / PERPAGE)
  const sidebarDataTypes = Object.entries(sidebarData.types)
  const sidebarDataTags = Object.entries(sidebarData.tags)

  const categorySelectOptions = sidebarDataTags.map(
    ([key, { title, total }]) => ({
      label: `${title} (${total})`,
      value: key,
    }),
  )

  categorySelectOptions.unshift({
    label: n('allCategories', 'Allir flokkar'),
    value: '',
  })

  const defaultSelectedCategory = {
    label:
      sidebarData.tags[filters.category]?.title ??
      n('allCategories', 'Allir flokkar'),
    value: filters.category ?? '',
  }

  const isServer = typeof window === 'undefined'

  return (
    <>
      <Head>
        <title>{n('searchResults', 'Leitarniðurstöður')} | Ísland.is</title>
      </Head>
      <SidebarLayout
        sidebarContent={
          <Stack space={3}>
            {!!sidebarDataTags.length && (
              <Sidebar title={n('sidebarHeader')}>
                <Box width="full" position="relative" paddingTop={2}>
                  {totalSearchResults > 0 && (
                    <>
                      <Filter
                        truncate
                        selected={!filters.category && !filters.type}
                        onClick={() => onRemoveFilters()}
                        text={`${n('allCategories', 'Allir flokkar')} (${
                          sidebarData.totalTagCount
                        })`}
                        className={styles.allCategoriesLink}
                      />
                      <SidebarAccordion
                        id="sidebar_accordion_categories"
                        label={''}
                      >
                        <Stack space={[1, 1, 2]}>
                          {sidebarDataTags.map(([key, { title, total }]) => {
                            const selected = key === filters.category
                            const text = `${title} (${total})`

                            if (key === 'uncategorized') {
                              return null
                            }

                            return (
                              <Filter
                                key={key}
                                selected={selected}
                                onClick={() =>
                                  onSelectSidebarTag('category', key)
                                }
                                text={text}
                              />
                            )
                          })}
                        </Stack>
                      </SidebarAccordion>
                    </>
                  )}
                </Box>
              </Sidebar>
            )}
            {!!sidebarDataTypes.length && (
              <Sidebar title={n('otherCategories')}>
                <Stack space={[1, 1, 2]}>
                  {sidebarDataTypes.map(([key, { title, total }]) => (
                    <Filter
                      key={key}
                      selected={filters.type === key}
                      onClick={() => onSelectSidebarTag('type', key)}
                      text={`${title} (${total})`}
                    />
                  ))}
                </Stack>
              </Sidebar>
            )}
          </Stack>
        }
      >
        <Stack space={[3, 3, 4]}>
          <Breadcrumbs
            items={[
              {
                title: 'Ísland.is',
                href: '/',
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

          <SearchInput
            id="search_input_search_page"
            ref={searchRef}
            size="large"
            quickContentLabel={n('quickContentLabel', 'Beint að efninu')}
            activeLocale={activeLocale}
            initialInputValue={q}
          />
          <Hidden above="sm">
            {totalSearchResults > 0 && (
              <Select
                label={n('sidebarHeader')}
                placeholder={n('sidebarHeader', 'Flokkar')}
                defaultValue={defaultSelectedCategory}
                options={categorySelectOptions}
                name="results-by-category"
                isSearchable={false}
                onChange={({ value }: Option) => {
                  onSelectSidebarTag('category', value as string)
                }}
              />
            )}
          </Hidden>

          {filteredItems.length === 0 ? (
            <>
              <Text variant="intro" as="p">
                {n('nothingFoundWhenSearchingFor', 'Ekkert fannst við leit á')}{' '}
                <strong>{q}</strong>
              </Text>

              <Text variant="intro" as="p">
                {n('nothingFoundExtendedExplanation')}
              </Text>

              {q.length &&
              searchResultsItems.length === 0 &&
              activeLocale === 'is' ? (
                <EnglishResultsLink q={q} />
              ) : null}
            </>
          ) : (
            <Box marginBottom={2}>
              <Text variant="intro" as="p">
                {totalSearchResults}{' '}
                {totalSearchResults === 1
                  ? n('searchResult', 'leitarniðurstaða')
                  : n('searchResults', 'leitarniðurstöður')}{' '}
                {(filters.category || filters.type) && (
                  <>
                    {n('inCategory', 'í flokki')}
                    {
                      <>
                        {': '}
                        <strong>
                          {sidebarData.tags[filters.category]?.title ??
                            sidebarData.types[filters.type]?.title}
                        </strong>
                      </>
                    }
                  </>
                )}
              </Text>
            </Box>
          )}
        </Stack>
        <Stack space={2}>
          {filteredItems.map(
            ({ image, thumbnail, labels, parentTitle, ...rest }, index) => {
              const tags: Array<CardTagsProps> = []

              labels.forEach((label) => {
                tags.push({
                  title: label,
                  tagProps: {
                    outlined: true,
                  },
                })
              })

              return (
                <Card
                  key={index}
                  tags={tags}
                  image={thumbnail ? thumbnail : image}
                  subTitle={parentTitle}
                  {...rest}
                />
              )
            },
          )}{' '}
          {totalSearchResults > 0 && (
            <Box paddingTop={8}>
              <Pagination
                page={page}
                totalPages={totalPages}
                renderLink={(page, className, children) => (
                  <Link
                    href={{
                      pathname: linkResolver('search').href,
                      query: { ...Router.query, page },
                    }}
                  >
                    <span className={className}>{children}</span>
                  </Link>
                )}
              />
            </Box>
          )}
          <Hidden above="sm">
            <Box paddingTop={4}>
              <Sidebar title={n('otherCategories')}>
                <Stack space={[1, 1, 2]}>
                  {sidebarDataTypes.map(([key, { title, total }]) => (
                    <Filter
                      key={key}
                      selected={filters.type === key}
                      onClick={() => {
                        onSelectSidebarTag('type', key)
                        !isServer && window.scrollTo(0, 0)
                      }}
                      text={`${title} (${total})`}
                    />
                  ))}
                </Stack>
              </Sidebar>
            </Box>
          </Hidden>
        </Stack>
      </SidebarLayout>
    </>
  )
}

const single = <T,>(x: T | T[]): T => (Array.isArray(x) ? x[0] : x)

Search.getInitialProps = async ({ apolloClient, locale, query }) => {
  const queryString = single(query.q) || ''
  const category = single(query.category) || ''
  const type = single(query.type) || ''
  const page = Number(single(query.page)) || 1

  let tags = {}
  let countTag = {}
  if (category) {
    tags = { tags: [{ key: category, type: 'category' as SearchableTags }] }
  } else {
    countTag = { countTag: 'category' as SearchableTags }
  }

  let types
  if (type) {
    types = [type as SearchableContentTypes]
  } else {
    types = [
      'webArticle' as SearchableContentTypes,
      'webLifeEventPage' as SearchableContentTypes,
      'webAdgerdirPage' as SearchableContentTypes,
      'webSubArticle' as SearchableContentTypes,
    ]
  }

  const [
    {
      data: { searchResults },
    },
    {
      data: { searchResults: countResults },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<GetSearchResultsDetailedQuery, QuerySearchResultsArgs>({
      query: GET_SEARCH_RESULTS_QUERY_DETAILED,
      variables: {
        query: {
          language: locale as ContentLanguage,
          queryString,
          types,
          ...tags,
          ...countTag,
          size: PERPAGE,
          page,
        },
      },
    }),
    apolloClient.query<GetSearchResultsNewsQuery, QuerySearchResultsArgs>({
      query: GET_SEARCH_COUNT_QUERY,
      variables: {
        query: {
          language: locale as ContentLanguage,
          queryString,
          countTag: 'category' as SearchableTags,
          countTypes: true,
        },
      },
    }),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Search',
            lang: locale,
          },
        },
      })
      .then((variables) => {
        // map data here to reduce data processing in component
        return JSON.parse(variables.data.getNamespace.fields)
      }),
  ])

  if (searchResults.items.length === 0 && page > 1) {
    throw new CustomNextError(404)
  }

  return {
    q: queryString,
    searchResults,
    countResults,
    namespace,
    showSearchInHeader: false,
    page,
  }
}

const Filter = ({ selected, text, onClick, truncate = false, ...props }) => {
  return (
    <Box
      display="inlineBlock"
      component="button"
      type="button"
      textAlign="left"
      outline="none"
      width="full"
      onClick={onClick}
      {...props}
    >
      <Text as="div" truncate={truncate}>
        {selected ? <strong>{text}</strong> : text}
      </Text>
    </Box>
  )
}

interface EnglishResultsLinkProps {
  q: string
}

const EnglishResultsLink: FC<EnglishResultsLinkProps> = ({ q }) => {
  const { linkResolver } = useLinkResolver()
  const [getCount, { data }] = useLazyQuery<
    GetSearchResultsTotalQuery,
    QuerySearchResultsArgs
  >(GET_SEARCH_RESULTS_TOTAL)

  useMemo(() => {
    getCount({
      variables: {
        query: {
          queryString: q,
          language: 'en' as ContentLanguage,
        },
      },
    })
  }, [q])

  const total = data?.searchResults?.total ?? 0

  if (total > 0) {
    return (
      <LinkContext.Provider
        value={{
          linkRenderer: (href, children) => (
            <Link color="blue600" underline="normal" href={href}>
              {children}
            </Link>
          ),
        }}
      >
        <Text variant="intro" as="p">
          <a href={linkResolver('search', [], 'en').href + `?q=${q}`}>
            {total} niðurstöður
          </a>{' '}
          fundust á ensku.
        </Text>
      </LinkContext.Provider>
    )
  }

  return null
}

export default withMainLayout(Search, { showSearchInHeader: false })
