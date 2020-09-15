/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useRef, useEffect } from 'react'
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
  Typography,
  Stack,
  Breadcrumbs,
  Hidden,
  Select,
  Divider,
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
} from '../queries'
import { CategoryLayout } from '../Layouts/Layouts'
import useRouteNames from '@island.is/web/i18n/useRouteNames'
import { CustomNextError } from '@island.is/web/units/errors'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  GetSearchResultsDetailedQuery,
  QuerySearchResultsArgs,
  ContentLanguage,
  QueryGetNamespaceArgs,
  GetNamespaceQuery,
  Article,
} from '../../graphql/schema'

const PerPage = 10

interface CategoryProps {
  q: string
  page: number
  searchResults: GetSearchResultsDetailedQuery['searchResults']
  namespace: GetNamespaceQuery['getNamespace']
}

const Search: Screen<CategoryProps> = ({
  q,
  page,
  searchResults,
  namespace,
}) => {
  const { activeLocale } = useI18n()
  const searchRef = useRef<HTMLInputElement | null>(null)
  const Router = useRouter()
  const n = useNamespace(namespace)
  const { makePath } = useRouteNames(activeLocale)

  const filters = {
    category: Router.query.category,
  }

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus()
    }
  }, [searchRef])

  const sidebarCategories = (searchResults.items as Article[]).reduce(
    (all, cur) => {
      const key = cur.category.slug
      const item = all.find((x) => x.key === key)

      if (!item) {
        all.push({
          key,
          total: 1,
          title: cur.category.title ?? '',
        })
      } else {
        item.total += 1
      }

      return all
    },
    [],
  )

  const items = (searchResults.items as Article[]).map((item) => ({
    title: item.title,
    description: item.content,
    href: makePath('article', '[slug]'),
    as: makePath('article', item.slug),
    categorySlug: item.category.slug,
    category: item.category,
    group: item.group,
  }))

  const onSelectCategory = (key: string) => {
    Router.replace({
      pathname: makePath('search'),
      query: { q, category: key },
    })
  }

  const byCategory = (item) =>
    !filters.category || filters.category === item.categorySlug

  const filteredItems = items.filter(byCategory)

  const categoryTitle = items.find((x) => x.categorySlug === filters.category)
    ?.category.title

  const categorySlug = items.find((x) => x.categorySlug === filters.category)
    ?.categorySlug

  const categorySelectOptions = sidebarCategories.map(
    ({ title, total, key }) => ({
      label: `${title} (${total})`,
      value: key,
    }),
  )

  categorySelectOptions.unshift({ label: 'Allir flokkar', value: '' })

  const onChangeSelectCategoryOptions = ({ value }: Option) => {
    onSelectCategory(value as string)
  }

  const defaultSelectedCategory = categoryTitle
    ? { label: categoryTitle, value: categorySlug }
    : { label: 'Allir flokkar', value: '' }

  return (
    <>
      <Head>
        <title>{n('searchResults', 'Leitarniðurstöður')} | Ísland.is</title>
      </Head>
      <CategoryLayout
        sidebar={
          <Sidebar title={n('sidebarHeader')}>
            <Filter
              selected={!filters.category}
              onClick={() => onSelectCategory(null)}
              text={`${n('allCategories', 'Allir flokkar')} (${
                searchResults.total
              })`}
            />
            <Divider weight="alternate" />
            <SidebarAccordion
              id="sidebar_accordion_categories"
              label={n('seeCategories', 'Sjá flokka')}
            >
              <Stack space={[1, 1, 2]}>
                {sidebarCategories.map((c, index) => {
                  const selected = c.key === filters.category
                  const text = `${c.title} (${c.total})`

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
          </Sidebar>
        }
        belowContent={
          <Stack space={2}>
            {filteredItems.map((item, index) => {
              const tags: Array<CardTagsProps> = []

              if (item.group) {
                tags.push({
                  title: item.group.title,
                  tagProps: {
                    label: true,
                  },
                })
              }

              return <Card key={index} icon="article" tags={tags} {...item} />
            })}
            <Box paddingTop={8}>
              <Pagination
                page={page}
                totalPages={Math.ceil(searchResults.total / PerPage)}
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
          </Stack>
        }
      >
        <Stack space={[3, 3, 4]}>
          <Breadcrumbs>
            <Link href="/">Ísland.is</Link>
          </Breadcrumbs>
          <SearchInput
            id="search_input_search_page"
            ref={searchRef}
            size="large"
            activeLocale={activeLocale}
            initialInputValue={q}
          />
          <Hidden above="md">
            <Select
              label={n('searchResult', 'Leitarflokkar')}
              placeholder={n('categories', 'Flokkar')}
              defaultValue={defaultSelectedCategory}
              options={categorySelectOptions}
              onChange={onChangeSelectCategoryOptions}
              name="content-overview"
            />
          </Hidden>
          <Typography variant="intro" as="p">
            {filteredItems.length === 0 ? (
              <span>
                {n('nothingFoundWhenSearchingFor', 'Ekkert fannst við leit á')}{' '}
                <strong>{q}</strong>
              </span>
            ) : (
              <span>
                {filteredItems.length}{' '}
                {filteredItems.length === 1
                  ? n('searchResult', 'leitarniðurstaða')
                  : n('searchResults', 'leitarniðurstöður')}
                {filters.category && (
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
              </span>
            )}
          </Typography>
        </Stack>
      </CategoryLayout>
    </>
  )
}

const single = <T,>(x: T | T[]): T => (Array.isArray(x) ? x[0] : x)

Search.getInitialProps = async ({ apolloClient, locale, query }) => {
  const queryString = single(query.q) || ''
  const page = Number(single(query.page)) || 1

  const [
    {
      data: { searchResults },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<GetSearchResultsDetailedQuery, QuerySearchResultsArgs>({
      query: GET_SEARCH_RESULTS_QUERY_DETAILED,
      variables: {
        query: {
          language: locale as ContentLanguage,
          queryString,
          types: ['article'],
          size: PerPage,
          page,
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
    namespace,
    showSearchInHeader: false,
    page,
  }
}

const Filter = ({ selected, text, onClick, ...props }) => {
  return (
    <Box
      component="button"
      type="button"
      textAlign="left"
      outline="none"
      onClick={onClick}
      {...props}
    >
      <Typography variant="p" as="span">
        {selected ? <strong>{text}</strong> : text}
      </Typography>
    </Box>
  )
}

export default withMainLayout(Search)
