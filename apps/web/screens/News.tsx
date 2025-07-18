/* eslint-disable jsx-a11y/anchor-is-valid */
import capitalize from 'lodash/capitalize'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import {
  Box,
  BreadCrumbItem,
  Breadcrumbs,
  Button,
  Divider,
  Hidden,
  Link,
  Navigation,
  NavigationItem,
  Pagination,
  ResponsiveSpace,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import {
  DigitalIcelandNewsCard,
  HeadWithSocialSharing,
  NewsArticle,
  Webreader,
} from '@island.is/web/components'
import { FRONTPAGE_NEWS_TAG_SLUG } from '@island.is/web/constants'
import { useNamespace } from '@island.is/web/hooks'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { withMainLayout } from '@island.is/web/layouts/main'

import {
  ContentLanguage,
  GenericTag,
  GetNamespaceQuery,
  GetNewsDatesQuery,
  GetNewsQuery,
  GetSingleNewsItemQuery,
  QueryGetNamespaceArgs,
  QueryGetNewsArgs,
  QueryGetNewsDatesArgs,
  QueryGetSingleNewsArgs,
} from '../graphql/schema'
import useContentfulId from '../hooks/useContentfulId'
import { LinkType, useLinkResolver } from '../hooks/useLinkResolver'
import { Screen } from '../types'
import { CustomNextError } from '../units/errors'
import { getIntParam } from '../utils/queryParams'
import { SidebarLayout } from './Layouts/SidebarLayout'
import {
  GET_NAMESPACE_QUERY,
  GET_NEWS_DATES_QUERY,
  GET_NEWS_QUERY,
  GET_SINGLE_NEWS_ITEM_QUERY,
} from './queries'

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
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error make web strict
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error make web strict
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error make web strict
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error make web strict
        renderLink={(link, { href }) => {
          return (
            <NextLink href={href} legacyBehavior>
              {link}
            </NextLink>
          )
        }}
      />
    </Stack>
  )

  const newsItemDate =
    newsItem?.date && format(new Date(newsItem.date), 'do MMMM yyyy')

  const metaTitle = `${newsItem?.title ?? n('pageTitle')} | Ísland.is`

  const socialImage = newsItem?.featuredImage ?? newsItem?.image

  const newsItemMeta = !!newsItem && {
    description: newsItem.intro,
    imageUrl: socialImage?.url,
    imageWidth: socialImage?.width?.toString(),
    imageHeight: socialImage?.height?.toString(),
  }

  const indexableBySearchEngine =
    newsItem?.organization?.canPagesBeFoundInSearchResults ?? true

  return (
    <>
      {/**
       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
       // @ts-expect-error make web strict */}
      <HeadWithSocialSharing
        title={metaTitle}
        {...(newsItemMeta && { ...newsItemMeta })}
      >
        {!indexableBySearchEngine && (
          <meta name="robots" content="noindex, nofollow" />
        )}
      </HeadWithSocialSharing>
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
                <NextLink {...linkProps} passHref legacyBehavior>
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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error make web strict
            renderLink={(link, { href }) => {
              return (
                <NextLink href={href} legacyBehavior>
                  {link}
                </NextLink>
              )
            }}
            isMenuDialog
          />
        </Hidden>
        {!newsItem && !newsList.length && (
          <Text variant="h4">
            {n('newsListEmptyMonth', 'Engar fréttir fundust í þessum mánuði.')}
          </Text>
        )}
        {!newsItem && (
          <Webreader
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error make web strict
            readId={null}
            readClass="rs_read"
          />
        )}
        {newsItem && (
          <Stack space={3}>
            <Box display={['none', 'none', 'block']} width="full">
              <Divider />
            </Box>
            <Box
              display={['block', 'block', 'block', 'none']}
              width="full"
              paddingTop={[2, 2, 0]}
            >
              <Text variant="eyebrow">{newsItemDate}</Text>
            </Box>
            <NewsArticle newsItem={newsItem} showDate={false} />
          </Stack>
        )}
        {!!newsList.length && (
          <Box className="rs_read" marginTop={spacing}>
            {newsList.map(
              ({ title, intro, image, slug, date, genericTags }, index) => {
                const mini =
                  selectedPage > 1 || (selectedPage === 1 && index > 2)

                return (
                  <Box marginBottom={mini ? spacingMini : spacing}>
                    <DigitalIcelandNewsCard
                      key={slug}
                      title={title}
                      description={intro}
                      imageSrc={image?.url ?? ''}
                      tags={genericTags.map((tag) => tag.title)}
                      href={linkResolver('news', [slug]).href}
                      date={date}
                      mini={mini}
                      titleAs="h2"
                    />
                  </Box>
                )
              },
            )}
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

const createDatesMap = (datesList: string[]) => {
  return datesList.reduce(
    (datesMap: Record<string, number[]>, date: string) => {
      const [year, month] = date.split('-')
      if (datesMap[year]) {
        datesMap[year].push(parseInt(month)) // we can assume each month only appears once
      } else {
        datesMap[year] = [parseInt(month)]
      }
      return datesMap
    },
    {},
  )
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error make web strict
NewsListNew.getProps = async ({ apolloClient, locale, query }) => {
  const slug = query.slug as string
  const year = getIntParam(query.y, { minValue: 1000, maxValue: 9999 })
  const month = year && getIntParam(query.m, { minValue: 1, maxValue: 12 })
  const selectedPage = getIntParam(query.page, { minValue: 1 }) ?? 1
  const tag = (query.tag as string) ?? FRONTPAGE_NEWS_TAG_SLUG
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
          tags: [tag],
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
      // map data here to reduce data processing in component
      .then((variables) => {
        return JSON.parse(variables?.data?.getNamespace?.fields || '{}')
      }),
  ])

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error make web strict
  const newsItem = getSingleNewsResult?.data?.getSingleNews ?? null
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error make web strict
  const newsList = getNewsResults?.data?.getNews?.items ?? []
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error make web strict
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

  const filterOutFrontpageTag = (tag: GenericTag) =>
    tag?.slug !== FRONTPAGE_NEWS_TAG_SLUG

  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error make web strict
    newsList: newsList.map((item) => ({
      ...item,
      genericTags: item?.genericTags?.filter(filterOutFrontpageTag) ?? [],
    })),
    newsItem: newsItem
      ? {
          ...newsItem,
          genericTags:
            newsItem?.genericTags?.filter(filterOutFrontpageTag) ?? [],
        }
      : newsItem,
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
