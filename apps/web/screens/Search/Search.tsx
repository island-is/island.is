/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useRef, useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
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
} from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'
import { useNamespace } from '@island.is/web/hooks'
import {
  GET_NAMESPACE_QUERY,
  GET_SEARCH_RESULTS_QUERY_DETAILED,
  GET_SEARCH_RESULTS_NEWS_QUERY,
  GET_SEARCH_COUNT_TAGS_QUERY,
} from '../queries'
import { CategoryLayout } from '../Layouts/Layouts'
import routeNames from '@island.is/web/i18n/routeNames'
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
  AboutPage,
  News,
  SearchableContentTypes,
  SearchableTags,
} from '../../graphql/schema'
import { Image } from '@island.is/web/graphql/schema'

const PERPAGE = 10

type SearchQueryFilters = {
  category: string | string[]
  showNews: boolean
}

interface CategoryProps {
  q: string
  page: number
  searchResults: GetSearchResultsDetailedQuery['searchResults']
  newsResults: GetSearchResultsNewsQuery['searchResults']
  countTags: GetSearchCountTagsQuery['searchResults']
  namespace: GetNamespaceQuery['getNamespace']
}

const Search: Screen<CategoryProps> = ({
  q,
  page,
  searchResults,
  newsResults,
  countTags,
  namespace,
}) => {
  const { activeLocale } = useI18n()
  const searchRef = useRef<HTMLInputElement | null>(null)
  const Router = useRouter()
  const n = useNamespace(namespace)
  const [sidebarCategories, setSidebarCategories] = useState([])
  const [
    grandTotalSearchResultCount,
    setGrandTotalSearchResultCount,
  ] = useState(10)
  const { makePath } = routeNames(activeLocale)

  const filters: SearchQueryFilters = {
    category: Router.query.category,
    showNews: Router.query.showNews ? true : false,
  }

  useEffect(() => {
    // we only update the tagCount results when we get new tag count results
    const newTagCountResults = countTags.tagCounts.map(
      ({ key, count: total, value: title }) => ({
        key,
        total,
        title,
      }),
    )
    setSidebarCategories(newTagCountResults)
    setGrandTotalSearchResultCount(countTags.total)
  }, [])

  const getLabels = (item) => {
    const labels = []

    switch (
      item.__typename as LifeEventPage['__typename'] &
        News['__typename'] &
        AboutPage['__typename']
    ) {
      case 'LifeEventPage':
        labels.push(n('lifeEvent'))
        break
      case 'AboutPage':
        labels.push(n('aboutPageTitle'))
        break
      case 'News':
        labels.push(n('newsTitle'))
        break
      default:
        break
    }

    if (item.containsApplicationForm) {
      labels.push(n('applicationForm'))
    }

    if (item.group) {
      labels.push(item.group.title)
    }

    if (item.organization?.length) {
      labels.push(item.organization[0].title)
    }

    return labels
  }

  const searchResultsItems = (searchResults.items as Array<
    Article & LifeEventPage & AboutPage
  >).map((item) => ({
    title: item.title,
    description: item.intro ?? item.seoDescription,
    href:
      item.__typename === 'AboutPage'
        ? item.slug
        : makePath(item.__typename, '[slug]'),
    as: makePath(item.__typename, item.slug),
    categorySlug: item.category?.slug,
    category: item.category,
    group: item.group,
    ...(item.image && { image: item.image as Image }),
    ...(item.thumbnail && { thumbnail: item.thumbnail as Image }),
    labels: getLabels(item),
  }))

  const newsItems = (newsResults.items as Array<News>).map((item) => ({
    title: item.title,
    description: item.intro,
    href: makePath(item.__typename, '[slug]'),
    as: makePath(item.__typename, item.slug),
    label: n('newsTitle'),
  }))

  const onRemoveFilters = () => {
    Router.replace({
      pathname: makePath('search'),
      query: { q },
    })
  }

  const onSelectCategory = (key: string) => {
    Router.replace({
      pathname: makePath('search'),
      query: { q, category: key },
    })
  }

  const onSelectNews = () => {
    Router.replace({
      pathname: makePath('search'),
      query: { q, showNews: true },
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
  const totalNews = newsResults.total

  const totalResultsOnPage = filters.showNews ? totalNews : totalSearchResults

  const totalPages = Math.ceil(totalResultsOnPage / PERPAGE)

  const categoryTitle = filters.showNews
    ? n('newsTitle')
    : searchResultsItems.find((x) => x.categorySlug === filters.category)
        ?.category?.title

  const categorySlug = filters.showNews
    ? 'showNews'
    : searchResultsItems.find((x) => x.categorySlug === filters.category)
        ?.categorySlug

  const categorySelectOptions = sidebarCategories.map(
    ({ title, total, key }) => ({
      label: `${title} (${total})`,
      value: key,
    }),
  )

  categorySelectOptions.unshift({
    label: n('allCategories', 'Allir flokkar'),
    value: '',
  })

  totalNews > 0 &&
    categorySelectOptions.push({
      label: `${n('newsTitle')} (${totalNews})`,
      value: 'showNews',
    })

  const onChangeSelectCategoryOptions = ({ value }: Option) => {
    value === 'showNews' ? onSelectNews() : onSelectCategory(value as string)
  }

  const defaultSelectedCategory = categoryTitle
    ? { label: categoryTitle, value: categorySlug }
    : { label: n('allCategories', 'Allir flokkar'), value: '' }

  return (
    <>
      <Head>
        <title>{n('searchResults', 'Leitarniðurstöður')} | Ísland.is</title>
      </Head>
      <CategoryLayout
        sidebar={
          <Stack space={3}>
            <Sidebar title={n('sidebarHeader')}>
              <div
                style={{
                  position: 'relative',
                }}
              >
                {totalSearchResults > 0 && (
                  <>
                    <div
                      style={{
                        right: 40,
                        position: 'absolute',
                        left: '0',
                        top: '12px',
                        zIndex: 10, // to accommodate for being absolute
                      }}
                    >
                      <Filter
                        truncate
                        selected={!filters.category && !filters.showNews}
                        onClick={() => onRemoveFilters()}
                        text={`${n(
                          'allCategories',
                          'Allir flokkar',
                        )} (${grandTotalSearchResultCount})`}
                      />
                    </div>
                    <SidebarAccordion
                      id="sidebar_accordion_categories"
                      label={''}
                    >
                      <Stack space={[1, 1, 2]}>
                        {sidebarCategories.map((c, index) => {
                          const selected = c.key === filters.category
                          const text = `${c.title} (${c.total})`

                          if (c.key === 'uncategorized') {
                            return null
                          }

                          return (
                            <Filter
                              key={index}
                              selected={selected}
                              onClick={() => onSelectCategory(c.key)}
                              text={text}
                            />
                          )
                        })}
                      </Stack>
                    </SidebarAccordion>
                  </>
                )}
              </div>
            </Sidebar>
            {totalNews > 0 && (
              <Sidebar bullet="none" title={n('oterCategories')}>
                <Stack space={[1, 1, 2]}>
                  <Filter
                    selected={filters.showNews}
                    onClick={() => onSelectNews()}
                    text={`${n('newsTitle')} (${totalNews})`}
                  />
                </Stack>
              </Sidebar>
            )}
          </Stack>
        }
        belowContent={
          <Stack space={2}>
            {filters.showNews
              ? newsItems.map(({ label, ...rest }, index) => {
                  const tags: Array<CardTagsProps> = []

                  tags.push({
                    title: label,
                    tagProps: {
                      label: true,
                    },
                  })

                  return <Card key={index} tags={tags} {...rest} />
                })
              : filteredItems.map(
                  ({ image, thumbnail, labels, ...rest }, index) => {
                    const tags: Array<CardTagsProps> = []

                    labels.forEach((label) => {
                      tags.push({
                        title: label,
                        tagProps: {
                          label: true,
                        },
                      })
                    })

                    return (
                      <Card
                        key={index}
                        tags={tags}
                        image={thumbnail ? thumbnail : image}
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
                        pathname: makePath('search'),
                        query: { ...Router.query, page },
                      }}
                    >
                      <span className={className}>{children}</span>
                    </Link>
                  )}
                />
              </Box>
            )}
          </Stack>
        }
      >
        <Stack space={[3, 3, 4]}>
          <Breadcrumbs>
            <Link href={makePath()}>Ísland.is</Link>
          </Breadcrumbs>
          <SearchInput
            id="search_input_search_page"
            ref={searchRef}
            size="large"
            activeLocale={activeLocale}
            initialInputValue={q}
          />
          <Hidden above="md">
            {totalSearchResults > 0 && (
              <Select
                label={n('sidebarHeader')}
                placeholder={n('sidebarHeader', 'Flokkar')}
                defaultValue={defaultSelectedCategory}
                options={categorySelectOptions}
                onChange={onChangeSelectCategoryOptions}
                name="content-overview"
                isSearchable={false}
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
            </>
          ) : (
            <Text variant="intro" as="p">
              {totalResultsOnPage}{' '}
              {totalResultsOnPage === 1
                ? n('searchResult', 'leitarniðurstaða')
                : n('searchResults', 'leitarniðurstöður')}
              {(filters.category || filters.showNews) && (
                <>
                  {' '}
                  {n('inCategory', 'í flokki')}
                  {categoryTitle ? (
                    <>
                      : <strong>{categoryTitle}</strong>
                    </>
                  ) : (
                    '.'
                  )}
                </>
              )}
            </Text>
          )}
        </Stack>
      </CategoryLayout>
    </>
  )
}

const single = <T,>(x: T | T[]): T => (Array.isArray(x) ? x[0] : x)

Search.getInitialProps = async ({ apolloClient, locale, query }) => {
  const queryString = single(query.q) || ''
  const category = single(query.category) || ''
  const page = Number(single(query.page)) || 1

  let tags = {}
  let countTag = {}
  if (category) {
    tags = { tags: [{ key: category, type: 'category' as SearchableTags }] }
  } else {
    countTag = { countTag: 'category' as SearchableTags }
  }

  const [
    {
      data: { searchResults },
    },
    {
      data: { searchResults: news },
    },
    {
      data: { searchResults: countTags },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<GetSearchResultsDetailedQuery, QuerySearchResultsArgs>({
      query: GET_SEARCH_RESULTS_QUERY_DETAILED,
      variables: {
        query: {
          language: locale as ContentLanguage,
          queryString,
          types: [
            'webArticle' as SearchableContentTypes,
            'webLifeEventPage' as SearchableContentTypes,
            'webAboutPage' as SearchableContentTypes,
          ],
          size: PERPAGE,
          ...tags,
          ...countTag,
          page,
        },
      },
    }),
    apolloClient.query<GetSearchResultsNewsQuery, QuerySearchResultsArgs>({
      query: GET_SEARCH_RESULTS_NEWS_QUERY,
      variables: {
        query: {
          language: locale as ContentLanguage,
          queryString,
          types: ['webNews' as SearchableContentTypes],
          size: PERPAGE,
          page,
        },
      },
    }),
    apolloClient.query<GetSearchResultsNewsQuery, QuerySearchResultsArgs>({
      query: GET_SEARCH_COUNT_TAGS_QUERY,
      variables: {
        query: {
          language: locale as ContentLanguage,
          queryString,
          countTag: 'category' as SearchableTags,
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
    newsResults: news,
    countTags: countTags,
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

export default withMainLayout(Search, { showSearchInHeader: false })
