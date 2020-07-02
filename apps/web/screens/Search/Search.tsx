/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useRef, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { withApollo } from '../../graphql'
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
} from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'
import { useNamespace } from '@island.is/web/hooks'
import {
  ContentLanguage,
  QueryGetNamespaceArgs,
  Query,
  QuerySearchResultsArgs,
} from '@island.is/api/schema'
import {
  GET_NAMESPACE_QUERY,
  GET_SEARCH_RESULTS_QUERY_DETAILED,
} from '../queries'
import { CategoryLayout } from '../Layouts/Layouts'
import useRouteNames from '@island.is/web/i18n/useRouteNames'
import { Locale } from '@island.is/web/i18n/I18n'

interface CategoryProps {
  q: string
  searchResults: Query['searchResults']
  namespace: Query['getNamespace']
}

const Search: Screen<CategoryProps> = ({ q, searchResults, namespace }) => {
  const { activeLocale } = useI18n()
  const searchRef = useRef<HTMLInputElement | null>(null)
  const Router = useRouter()
  const n = useNamespace(namespace)
  const { makePath } = useRouteNames(activeLocale as Locale)

  const filters = {
    category: Router.query.category,
  }

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus()
    }
  }, [searchRef])

  const sidebarCategories = searchResults.items.reduce((all, cur) => {
    const key = cur.categorySlug

    const item = all.find((x) => x.key === key)

    if (!item) {
      all.push({
        key,
        total: 1,
        title: cur.category || '',
      })
    } else {
      item.total += 1
    }

    return all
  }, [])

  const items = searchResults.items.map((item) => {
    return {
      title: item.title,
      description: item.content,
      href: makePath('article', '[slug]'),
      as: makePath('article', item.slug),
      categorySlug: item.categorySlug,
      category: item.category,
      group: item.group,
    }
  })

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
    ?.category

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
        <title>Leitarniðurstöður | Ísland.is</title>
      </Head>
      <CategoryLayout
        sidebar={
          <Sidebar title={n('submenuTitle')}>
            <Filter
              selected={!filters.category}
              onClick={() => onSelectCategory(null)}
              text={`Allir flokkar (${searchResults.total})`}
            />
            <Divider weight="alternate" />
            <SidebarAccordion
              id="sidebar_accordion_categories"
              label="Sjá flokka"
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
        topContent={
          <Stack space={[3, 3, 4]}>
            <Breadcrumbs>
              <Link href="/">
                <a>Ísland.is</a>
              </Link>
            </Breadcrumbs>
            <SearchInput
              ref={searchRef}
              size="large"
              activeLocale={activeLocale}
              initialInputValue={q}
            />
            <Hidden above="md">
              <Select
                label="Leitarflokkar"
                placeholder="Flokkar"
                defaultValue={defaultSelectedCategory}
                options={categorySelectOptions}
                onChange={onChangeSelectCategoryOptions}
                name="content-overview"
              />
            </Hidden>
            <Typography variant="intro" as="p">
              {filteredItems.length === 0 ? (
                <span>
                  Ekkert fannst við leit á <strong>{q}</strong>
                </span>
              ) : (
                <span>
                  {filteredItems.length} leitarniðurstöður{' '}
                  {filters.category && (
                    <>
                      í flokki
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
        }
        bottomContent={
          <Stack space={2}>
            {filteredItems.map((item, index) => {
              const tags = [] as Array<CardTagsProps>

              if (item.group) {
                tags.push({
                  title: item.group,
                  tagProps: {
                    label: true,
                  },
                })
              }

              return <Card key={index} icon="article" tags={tags} {...item} />
            })}
          </Stack>
        }
      />
    </>
  )
}

Search.getInitialProps = async ({ apolloClient, locale, query }) => {
  const queryString = (query.q as string) || ''

  const [
    {
      data: { searchResults },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QuerySearchResultsArgs>({
      query: GET_SEARCH_RESULTS_QUERY_DETAILED,
      variables: {
        query: {
          queryString: queryString ? `${queryString}*` : '',
          language: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Articles',
            lang: locale,
          },
        },
      })
      .then((variables) => {
        // map data here to reduce data processing in component
        return JSON.parse(variables.data.getNamespace.fields)
      }),
  ])

  return {
    q: queryString,
    searchResults,
    namespace,
    showSearchInHeader: false,
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
export default withApollo(Search)
