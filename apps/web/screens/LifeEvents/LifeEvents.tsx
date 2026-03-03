import { useMemo, useState } from 'react'
import Head from 'next/head'

import {
  Box,
  Breadcrumbs,
  FilterInput,
  GridColumn,
  GridContainer,
  GridRow,
  Inline,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'
import { CardWithFeaturedItems, GridItems } from '@island.is/web/components'
import {
  ContentLanguage,
  type GetLifeEventsForOverviewQuery,
  type GetNamespaceQuery,
  QueryGetLifeEventsForOverviewArgs,
  type QueryGetNamespaceArgs,
} from '@island.is/web/graphql/schema'
import {
  LinkType,
  useLinkResolver,
  useNamespaceStrict as useNamespace,
} from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'

import type { Screen } from '../../types'
import {
  GET_LIFE_EVENTS_FOR_OVERVIEW_QUERY,
  GET_NAMESPACE_QUERY,
} from '../queries'
import { ApplicationsTexts } from './LifeEvents.types'

type LifeEvents = GetLifeEventsForOverviewQuery['getLifeEventsForOverview']
interface Props {
  lifeEvents: LifeEvents
  namespace: ApplicationsTexts
}

type SortOption = 'a-z' | 'z-a'

const LifeEvents: Screen<Props> = ({ lifeEvents, namespace }) => {
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const [searchValue, setSearchValue] = useState('')
  const [sort, setSort] = useState<SortOption>('a-z')

  const filteredLifeEvents = useMemo(() => {
    const query = searchValue.toLowerCase()
    const items = lifeEvents?.filter((event) => {
      const title = (event.shortTitle ?? event.title).toLowerCase()
      return title.includes(query)
    })

    if (items) {
      return [...items].sort((a, b) => {
        const titleA = (a.shortTitle ?? a.title).toLowerCase()
        const titleB = (b.shortTitle ?? b.title).toLowerCase()
        return sort === 'a-z'
          ? titleA.localeCompare(titleB, 'is')
          : titleB.localeCompare(titleA, 'is')
      })
    }

    return items
  }, [lifeEvents, searchValue, sort])

  return (
    <>
      <Head>
        <title>{n('pageTitle', 'Lífsviðburðir')} | Ísland.is</title>
      </Head>
      <Box background="white">
        <GridContainer>
          <GridRow>
            <GridColumn
              span={['12/12', '12/12', '11/12', '11/12', '11/12']}
              offset={['0', '0', '1/12', '1/12', '1/12']}
            >
              <Breadcrumbs
                items={[
                  {
                    title: 'Ísland.is',
                    href: '/',
                  },
                  {
                    title: 'Lífsviðburðir',
                  },
                ]}
              />
              <Text variant="h1" as="h1" marginTop={5} marginBottom={2}>
                {n('pageTitle', 'Lífsviðburðir')}
              </Text>
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn
              span={['12/12', '12/12', '9/12', '9/12', '6/12']}
              offset={['0', '0', '1/12', '1/12']}
            >
              <Text variant="intro" as="p" paddingBottom={4}>
                {n(
                  'pageBody',
                  'Samantekt yfir helstu þjónustu sem fólk þarf á tilteknum tímamótum í lífinu, til að mynda að eignast barn, fara í nám, stofna fyrirtæki og að undirbúa starfslok og efri árin.',
                )}
              </Text>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
      <Box background="purple100">
        <GridContainer>
          <Box
            paddingTop={5}
            paddingBottom={3}
            display="flex"
            justifyContent="spaceBetween"
            alignItems="center"
            flexWrap="wrap"
            rowGap={2}
          >
            <Box>
              <FilterInput
                name="life-events-search"
                placeholder={n('searchPlaceholder', 'Leita að lífsviðburði')}
                value={searchValue}
                onChange={setSearchValue}
                backgroundColor="white"
              />
            </Box>
            <Box>
              <Inline space={3} alignY="center">
                <RadioButton
                  name="life-events-sort"
                  id="sort-a-z"
                  label={n('sortAZ', 'A–Ö')}
                  value="a-z"
                  checked={sort === 'a-z'}
                  onChange={() => setSort('a-z')}
                />
                <RadioButton
                  name="life-events-sort"
                  id="sort-z-a"
                  label={n('sortZA', 'Ö–A')}
                  value="z-a"
                  checked={sort === 'z-a'}
                  onChange={() => setSort('z-a')}
                />
              </Inline>
            </Box>
          </Box>
        </GridContainer>
        <GridItems
          mobileItemWidth={215}
          mobileItemsRows={5}
          insideGridContainer
          paddingTop={5}
          paddingBottom={2}
          third
        >
          {filteredLifeEvents?.map(
            ({
              __typename: typename,
              shortTitle,
              title,
              slug,
              tinyThumbnail,
              featured,
              seeMoreText,
              id,
            }) => {
              return (
                <CardWithFeaturedItems
                  key={id}
                  heading={shortTitle ?? title}
                  imgSrc={tinyThumbnail?.url ?? ''}
                  dataTestId={'lifeevent-card-with-featured-items'}
                  href={linkResolver(typename as LinkType, [slug]).href}
                  featuredItems={featured ?? []}
                  white
                  buttonTitle={
                    seeMoreText && seeMoreText !== ''
                      ? seeMoreText
                      : n('cardsButtonTitle', 'Skoða lífsviðburð')
                  }
                />
              )
            },
          )}
        </GridItems>
      </Box>
    </>
  )
}

LifeEvents.getProps = async ({ apolloClient, locale }) => {
  const [
    {
      data: { getLifeEventsForOverview: lifeEvents },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<
      GetLifeEventsForOverviewQuery,
      QueryGetLifeEventsForOverviewArgs
    >({
      query: GET_LIFE_EVENTS_FOR_OVERVIEW_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'LifeEventsOverview',
            lang: locale,
          },
        },
      })
      .then((variables) => {
        return JSON.parse(variables?.data?.getNamespace?.fields || '{}')
      }),
  ])

  return {
    lifeEvents,
    namespace,
  }
}

export default withMainLayout(LifeEvents, {
  showFooterIllustration: true,
})
