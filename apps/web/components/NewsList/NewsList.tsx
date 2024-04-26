import {
  Stack,
  Hidden,
  GridColumn,
  Pagination,
  Text,
  Select,
  Option,
  Box,
  Link,
  Inline,
  Tag,
  LinkV2,
} from '@island.is/island-ui/core'
import { LinkType, useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { NewsCard, Webreader } from '@island.is/web/components'
import { useRouter } from 'next/router'
import { GenericTag, GetNewsQuery } from '@island.is/web/graphql/schema'
import { makeHref } from './utils'

interface NewsListProps {
  title: string
  namespace: Record<string, string>
  newsList: GetNewsQuery['getNews']['items']
  total: number
  selectedYear: number
  selectedMonth: number
  selectedPage: number
  selectedTag: string | string[]
  newsOverviewUrl: string
  newsItemLinkType: LinkType
  parentPageSlug: string
  yearOptions: { label: any; value: any }[]
  monthOptions: { label: any; value: any }[]
  newsPerPage?: number
  newsTags?: GenericTag[]
}

export const NewsList = ({
  title,
  newsList,
  total,
  selectedYear,
  selectedMonth,
  selectedPage,
  selectedTag,
  namespace,
  newsOverviewUrl,
  newsItemLinkType,
  parentPageSlug,
  yearOptions,
  newsPerPage = 10,
  monthOptions,
  newsTags,
}: NewsListProps) => {
  const router = useRouter()
  const n = useNamespace(namespace)

  const { linkResolver } = useLinkResolver()

  const allYearsString = n('allYears', 'Allar fréttir')
  const yearString = n('year', 'Ár')
  const monthString = n('month', 'Mánuður')

  const filteredNewsTags = newsTags?.filter(
    (tag) => !!tag?.title && !!tag?.slug,
  )

  return (
    <Stack space={[3, 3, 4]}>
      <Text variant="h1" as="h1" marginBottom={0}>
        {filteredNewsTags?.find((tag) => tag.slug === router?.query?.tag)
          ?.title || title}
      </Text>

      <Webreader
        marginTop={0}
        marginBottom={0}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        readId={null}
        readClass="rs_read"
      />

      {filteredNewsTags && filteredNewsTags?.length > 0 && (
        <Inline space={1}>
          <LinkV2
            href={
              linkResolver('organizationnewsoverview', [parentPageSlug]).href
            }
          >
            <Tag variant="blue" active={!router?.query?.tag}>
              {n('showAllResults', 'Sýna allt')}
            </Tag>
          </LinkV2>
          {filteredNewsTags?.map((tag, index) => (
            <LinkV2
              key={index}
              href={
                linkResolver('organizationnewsoverview', [parentPageSlug])
                  .href +
                '?tag=' +
                tag.slug
              }
            >
              <Tag
                key={index}
                variant="blue"
                active={router?.query?.tag === tag.slug}
              >
                {tag.title}
              </Tag>
            </LinkV2>
          ))}
        </Inline>
      )}

      {selectedYear && (
        <Hidden below="lg">
          <Text variant="h2" as="h2">
            {selectedYear}
          </Text>
        </Hidden>
      )}
      <GridColumn hiddenAbove="sm" paddingTop={4} paddingBottom={1}>
        <Select
          label={yearString}
          placeholder={yearString}
          isSearchable={false}
          value={yearOptions.find(
            (option) =>
              option.value ===
              (selectedYear ? selectedYear.toString() : allYearsString),
          )}
          options={yearOptions}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          onChange={({ value }: Option) => {
            router.push(
              makeHref(
                selectedTag,
                newsOverviewUrl,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore make web strict
                value === allYearsString ? null : value,
              ),
            )
          }}
          name="year"
        />
      </GridColumn>
      {selectedYear && (
        <GridColumn hiddenAbove="sm">
          <Select
            label={monthString}
            placeholder={monthString}
            value={monthOptions.find((o) => o.value === selectedMonth)}
            options={monthOptions}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            onChange={({ value }: Option) =>
              router.push(
                makeHref(selectedTag, newsOverviewUrl, selectedYear, value),
              )
            }
            name="month"
          />
        </GridColumn>
      )}
      {!newsList.length && (
        <Text variant="h4">
          {n('newsListEmptyMonth', 'Engar fréttir fundust í þessum mánuði.')}
        </Text>
      )}
      <Box className="rs_read">
        <Stack space={[3, 3, 4]}>
          {newsList.map((newsItem, index) => (
            <NewsCard
              key={index}
              title={newsItem.title}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              introduction={newsItem.intro}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              image={newsItem.image}
              titleAs="h2"
              href={
                linkResolver(newsItemLinkType, [parentPageSlug, newsItem.slug])
                  .href
              }
              date={newsItem.date}
              readMoreText={n('readMore', 'Lesa nánar')}
            />
          ))}
        </Stack>
      </Box>
      {newsList.length > 0 && (
        <Box paddingTop={[4, 4, 8]}>
          <Pagination
            totalPages={Math.ceil(total / newsPerPage)}
            page={selectedPage}
            renderLink={(page, className, children) => (
              <Link
                href={{
                  pathname: newsOverviewUrl,
                  query: { ...router.query, page },
                }}
              >
                <span className={className}>{children}</span>
              </Link>
            )}
          />
        </Box>
      )}
    </Stack>
  )
}
