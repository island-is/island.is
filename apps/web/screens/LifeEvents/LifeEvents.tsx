import Head from 'next/head'
import NextLink from 'next/link'

import {
  Box,
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
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
import { LifeEventCard } from './LifeEventCard'
import { ApplicationsTexts } from './LifeEvents.types'
import * as styles from './LifeEvents.css'

type LifeEvents = GetLifeEventsForOverviewQuery['getLifeEventsForOverview']
interface Props {
  lifeEvents: LifeEvents
  namespace: ApplicationsTexts
}

const LifeEvents: Screen<Props> = ({ lifeEvents, namespace }) => {
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()

  return (
    <>
      <Head>
        <title>{n('pageTitle', 'Lífsviðburðir')} | Ísland.is</title>
      </Head>
      <Box paddingTop={[2, 2, 2, 8]} paddingBottom={[4, 4, 4, 8]}>
        <GridContainer className={styles.listContainer}>
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
                      title: n('pageTitle', 'Lífsviðburðir'),
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
                <Text variant="h1" as="h1" className={styles.heading}>
                  {n('pageTitle', 'Lífsviðburðir')}
                </Text>
                <Text variant="intro" className={styles.description}>
                  {n(
                    'pageBody',
                    'Samantekt yfir helstu þjónustu sem fólk þarf á tilteknum tímamótum í lífinu, til að mynda að eignast barn, fara í nám, stofna fyrirtæki og að undirbúa starfslok og efri árin.',
                  )}
                </Text>
              </Stack>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>

      <Box background="purple100" display="inlineBlock" width="full">
        <GridContainer className={styles.listContainer}>
          <Box paddingTop={[4, 4, 8]} paddingBottom={[3, 3, 6]}>
            <GridRow>
              {lifeEvents?.map(
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
                    <GridColumn
                      key={id}
                      span={['12/12', '6/12', '6/12', '4/12']}
                      paddingBottom={3}
                    >
                      <LifeEventCard
                        heading={shortTitle ?? title}
                        imgSrc={tinyThumbnail?.url}
                        dataTestId={'lifeevent-card-with-featured-items'}
                        href={linkResolver(typename as LinkType, [slug]).href}
                        featuredItems={featured ?? []}
                        buttonTitle={
                          seeMoreText && seeMoreText !== ''
                            ? seeMoreText
                            : n('cardsButtonTitle', 'Skoða lífsviðburð')
                        }
                      />
                    </GridColumn>
                  )
                },
              )}
            </GridRow>
          </Box>
        </GridContainer>
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
