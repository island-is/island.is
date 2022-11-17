/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import capitalize from 'lodash/capitalize'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { Screen } from '../types'
import {
  Image,
  richText,
  Slice as SliceType,
} from '@island.is/island-ui/contentful'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import {
  Box,
  Text,
  Stack,
  Breadcrumbs,
  BreadCrumbItem,
  Pagination,
  Hidden,
  Link,
  Navigation,
  NavigationItem,
  ResponsiveSpace,
  Button,
  Tag,
  Divider,
  LinkContext,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  GET_NAMESPACE_QUERY,
  GET_NEWS_DATES_QUERY,
  GET_NEWS_QUERY,
  GET_SINGLE_NEWS_ITEM_QUERY,
} from './queries'
import { SidebarLayout } from './Layouts/SidebarLayout'
import {
  GetNewsDatesQuery,
  QueryGetNewsDatesArgs,
  GetNewsQuery,
  QueryGetNewsArgs,
  ContentLanguage,
  QueryGetNamespaceArgs,
  GetNamespaceQuery,
  GetSingleNewsItemQuery,
  QueryGetSingleNewsArgs,
  GenericTag,
} from '../graphql/schema'
import {
  NewsCard,
  HeadWithSocialSharing,
  TableSlice,
} from '@island.is/web/components'
import { useNamespace } from '@island.is/web/hooks'
import { LinkType, useLinkResolver } from '../hooks/useLinkResolver'
import { FRONTPAGE_NEWS_TAG_ID } from '@island.is/web/constants'
import { CustomNextError } from '../units/errors'
import useContentfulId from '../hooks/useContentfulId'

const PERPAGE = 10

interface NewsListProps {
  newsItem: GetSingleNewsItemQuery['getSingleNews']
  newsList: GetNewsQuery['getNews']['items']
  total: number
  datesMap: { [year: string]: number[] }
  selectedYear: number
  selectedMonth: number
  selectedPage: number
  selectedTagSlug: string
  namespace: GetNamespaceQuery['getNamespace']
}

const spacing: ResponsiveSpace = [3, 3, 4]
const spacingMini: ResponsiveSpace = [0, 0, 4]

const NewsListNew: Screen<NewsListProps> = ({
  newsItem,
  newsList,
  total,
  datesMap,
  selectedYear,
  selectedMonth,
  selectedPage,
  selectedTagSlug,
  namespace,
}) => {
  const Router = useRouter()
  const { linkResolver } = useLinkResolver()
  const { format, getMonthByIndex } = useDateUtils()
  const n = useNamespace(namespace)
  useContentfulId(newsItem?.id)

  const years = Object.keys(datesMap)
    .map((x) => parseInt(x, 10))
    .sort((a, b) => b - a)
  const months = (datesMap[selectedYear] ?? []).sort((a, b) => b - a)

  const allYearsString = n('allYears', 'Allar fréttir')

  const getMonthString = (month: number) => {
    return capitalize(getMonthByIndex(month - 1))
  }

  const href = linkResolver('newsoverview').href

  const navItems: NavigationItem[] = [
    {
      title: allYearsString,
      active: !selectedYear,
      href,
    },
    ...years.map((year) => ({
      title: year.toString(),
      active: selectedYear === year,
      href: `${href}?y=${year}${
        selectedTagSlug ? '&tag=' + selectedTagSlug : ''
      }`,
      items: months.map((month) => ({
        title: getMonthString(month),
        active: selectedMonth === month,
        href: `${href}?y=${year}&m=${month}${
          selectedTagSlug ? '&tag=' + selectedTagSlug : ''
        }`,
      })),
    })),
  ]

  let selectedTag: GenericTag | undefined

  for (const item of newsList) {
    const tag = item.genericTags.find((t) => t.slug === selectedTagSlug)

    if (tag) {
      selectedTag = tag
      break
    }
  }

  const breadCrumbs: BreadCrumbItem[] = [
    {
      title: 'Ísland.is',
      typename: 'homepage',
      href: '/',
    },
    {
      title: n('newsTitle', 'Fréttir og tilkynningar'),
      typename: 'newsoverview',
      href: '/',
    },
  ]

  const breadCrumbTags: BreadCrumbItem | BreadCrumbItem[] = newsItem
    ?.genericTags?.length
    ? newsItem.genericTags
        .filter((t) => t.title && t.slug)
        .map(({ title, slug }) => {
          return {
            isTag: true,
            title: title,
            typename: 'newsoverview',
            href: slug,
          }
        })
    : !!selectedTag && {
        isTag: true,
        title: selectedTag.title,
        typename: 'newsoverview',
      }

  const selectedString = selectedMonth
    ? `${getMonthString(selectedMonth)} ${selectedYear}`
    : selectedYear
    ? selectedYear
    : allYearsString

  const navTitle = n('newsTitle', 'Fréttir og tilkynningar')
  const navTitleMobile = `${navTitle}: ${selectedString}`

  const backButton = newsList.length ? (
    <BackButton title="Ísland.is" href="/" />
  ) : (
    <BackButton
      title={n('newsOverview')}
      href={linkResolver('newsoverview').href}
    />
  )

  const sidebar = (
    <Stack space={3}>
      <Box display={['none', 'none', 'block']} printHidden>
        {backButton}
      </Box>
      <Navigation
        baseId="newsNav"
        title={navTitle}
        items={navItems}
        renderLink={(link, { href }) => {
          return <NextLink href={href}>{link}</NextLink>
        }}
      />
    </Stack>
  )

  const newsItemDate =
    newsItem?.date && format(new Date(newsItem.date), 'do MMMM yyyy')

  const newsItemContent = !!newsItem && (
    <>
      <Box display={['none', 'none', 'block']} width="full">
        <Divider />
      </Box>
      <Box
        display={['block', 'block', 'block', 'none']}
        paddingTop={5}
        width="full"
      >
        <Text variant="eyebrow">{newsItemDate}</Text>
      </Box>
      <Text variant="h1" as="h1" paddingTop={[3, 3, 3, 5]} paddingBottom={2}>
        {newsItem.title}
      </Text>
      <Text variant="intro" as="p" paddingBottom={2}>
        {newsItem.intro}
      </Text>
      {Boolean(newsItem.image) && (
        <Box paddingY={2}>
          <Image
            {...newsItem.image}
            url={newsItem.image.url + '?w=774&fm=webp&q=80'}
            thumbnail={newsItem.image.url + '?w=50&fm=webp&q=80'}
          />
        </Box>
      )}
      <Box paddingBottom={4} width="full">
        {richText(newsItem.content as SliceType[], {
          renderComponent: {
            TableSlice: (slice) => <TableSlice slice={slice} />,
          },
        })}
      </Box>
    </>
  )

  const metaTitle = `${newsItem?.title ?? n('pageTitle')} | Ísland.is`

  const newsItemMeta = !!newsItem && {
    description: newsItem.intro,
    imageUrl: newsItem.image?.url,
    imageWidth: newsItem.image?.width?.toString(),
    imageHeight: newsItem.image?.height?.toString(),
  }

  return (
    <>
      <HeadWithSocialSharing
        title={metaTitle}
        {...(newsItemMeta && { ...newsItemMeta })}
      />
      <SidebarLayout sidebarContent={sidebar}>
        <Box
          display={['none', 'none', 'flex']}
          width="full"
          flexDirection="row"
          flexWrap="wrap"
          alignItems="center"
          justifyContent="spaceBetween"
          marginBottom={spacing}
          printHidden
        >
          <Breadcrumbs
            items={
              breadCrumbTags ? breadCrumbs.concat(breadCrumbTags) : breadCrumbs
            }
            renderLink={(link, { typename, href, isTag, slug }) => {
              const linkProps = isTag
                ? {
                    href: {
                      pathname: linkResolver('newsoverview').href,
                      query: { tag: href },
                    },
                  }
                : linkResolver(typename as LinkType, slug)

              return (
                <NextLink {...linkProps} passHref>
                  {link}
                </NextLink>
              )
            }}
          />
          {!!newsItemDate && (
            <Box display={['none', 'none', 'none', 'block']}>
              <Text variant="eyebrow">{newsItemDate}</Text>
            </Box>
          )}
        </Box>
        <Box
          display={['flex', 'flex', 'none']}
          marginBottom={spacing}
          justifyContent="spaceBetween"
          alignItems="center"
          style={{ minHeight: 32 }}
          printHidden
        >
          <Box flexGrow={1} marginRight={6} overflow={'hidden'}>
            {backButton}
          </Box>
          {selectedTag && (
            <Box minWidth={0}>
              <Link href={`/frett?tag=${selectedTag.slug}`} skipTab>
                <Tag truncate>{selectedTag.title}</Tag>
              </Link>
            </Box>
          )}
        </Box>
        {!newsItem && selectedYear && (
          <Hidden below="lg">
            <Text variant="h1" as="h1">
              {selectedYear}
            </Text>
          </Hidden>
        )}
        <Hidden above="sm">
          <Navigation
            baseId="newsNav"
            title={navTitleMobile}
            items={navItems}
            renderLink={(link, { href }) => {
              return <NextLink href={href}>{link}</NextLink>
            }}
            isMenuDialog
          />
        </Hidden>
        {!newsItem && !newsList.length && (
          <Text variant="h4">
            {n('newsListEmptyMonth', 'Engar fréttir fundust í þessum mánuði.')}
          </Text>
        )}
        {newsItemContent && <Box width="full">{newsItemContent}</Box>}
        {!!newsList.length && (
          <Box marginTop={spacing}>
            {newsList.map(({ title, intro, image, slug, date }, index) => {
              const mini = index > 2

              return (
                <Box marginBottom={mini ? spacingMini : spacing}>
                  <NewsCard
                    key={index}
                    title={title}
                    introduction={intro}
                    image={image}
                    titleAs="h2"
                    href={linkResolver('news', [slug]).href}
                    date={date}
                    readMoreText={n('readMore', 'Lesa nánar')}
                    mini={mini}
                  />
                </Box>
              )
            })}
            {!!newsList.length && (
              <Box marginTop={[4, 4, 8]}>
                <Pagination
                  totalPages={Math.ceil(total / PERPAGE)}
                  page={selectedPage}
                  renderLink={(page, className, children) => (
                    <Link
                      href={{
                        pathname: href,
                        query: { ...Router.query, page },
                      }}
                    >
                      <span className={className}>{children}</span>
                    </Link>
                  )}
                />
              </Box>
            )}
          </Box>
        )}
      </SidebarLayout>
    </>
  )
}

const createDatesMap = (datesList) => {
  return datesList.reduce((datesMap, date) => {
    const [year, month] = date.split('-')
    if (datesMap[year]) {
      datesMap[year].push(parseInt(month)) // we can assume each month only appears once
    } else {
      datesMap[year] = [parseInt(month)]
    }
    return datesMap
  }, {})
}

const getIntParam = (s: string | string[]) => {
  const i = parseInt(Array.isArray(s) ? s[0] : s, 10)
  if (!isNaN(i)) return i
}

NewsListNew.getInitialProps = async ({ apolloClient, locale, query }) => {
  const slug = query.slug as string
  const year = getIntParam(query.y)
  const month = year && getIntParam(query.m)
  const selectedPage = getIntParam(query.page) ?? 1
  const tag = (query.tag as string) ?? FRONTPAGE_NEWS_TAG_ID

  const [
    {
      data: { getNewsDates: newsDatesList },
    },
    getSingleNewsResult,
    getNewsResults,
    namespace,
  ] = await Promise.all([
    apolloClient.query<GetNewsDatesQuery, QueryGetNewsDatesArgs>({
      query: GET_NEWS_DATES_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
          tag,
        },
      },
    }),
    !!slug &&
      apolloClient.query<GetSingleNewsItemQuery, QueryGetSingleNewsArgs>({
        query: GET_SINGLE_NEWS_ITEM_QUERY,
        variables: {
          input: {
            slug: query.slug as string,
            lang: locale as ContentLanguage,
          },
        },
      }),
    !slug &&
      apolloClient.query<GetNewsQuery, QueryGetNewsArgs>({
        query: GET_NEWS_QUERY,
        variables: {
          input: {
            lang: locale as ContentLanguage,
            size: PERPAGE,
            page: selectedPage,
            year,
            month,
            tags: [tag],
          },
        },
      }),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            lang: locale as ContentLanguage,
            namespace: 'NewsList',
          },
        },
      })
      .then((variables) => {
        // map data here to reduce data processing in component
        return JSON.parse(variables.data.getNamespace.fields)
      }),
  ])

  const newsItem = getSingleNewsResult?.data?.getSingleNews ?? null
  const newsList = getNewsResults?.data?.getNews?.items ?? []
  const total = getNewsResults?.data?.getNews?.total ?? 0

  const selectedYear = newsItem?.date
    ? parseInt(newsItem.date?.slice(0, 4), 10)
    : year
  const selectedMonth = newsItem?.date
    ? parseInt(newsItem.date?.slice(5, 7), 10)
    : month

  if (slug && !newsItem) {
    throw new CustomNextError(404, 'News not found')
  }

  return {
    newsList,
    newsItem,
    total,
    selectedYear,
    selectedMonth,
    selectedTagSlug: tag,
    datesMap: createDatesMap(newsDatesList),
    selectedPage,
    namespace,
  }
}

const BackButton = ({ title, href }: { title: string; href: string }) => (
  <Link href={href} skipTab>
    <Button
      as="span"
      preTextIcon="arrowBack"
      preTextIconType="filled"
      size="small"
      type="button"
      variant="text"
      truncate
    >
      {title}
    </Button>
  </Link>
)

export default withMainLayout(NewsListNew)
