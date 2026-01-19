import Head from 'next/head'

import {
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
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

const LifeEvents: Screen<Props> = ({ lifeEvents, namespace }) => {
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  return (
    <>
      <Head>
        <title>{n('pageTitle', 'Lífsviðburðir')} | Ísland.is</title>
      </Head>
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
            <Text variant="intro" as="p">
              {n(
                'pageBody',
                'Samantekt yfir helstu þjónustu sem fólk þarf á tilteknum tímamótum í lífinu, til að mynda að eignast barn, fara í nám, stofna fyrirtæki og að undirbúa starfslok og efri árin.',
              )}
            </Text>
          </GridColumn>
        </GridRow>
      </GridContainer>
      <GridItems
        mobileItemWidth={250}
        mobileItemsRows={4}
        insideGridContainer
        paddingTop={5}
        showGradients
        paddingBottom={2}
        third
      >
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
              <CardWithFeaturedItems
                key={id}
                heading={shortTitle ?? title}
                imgSrc={tinyThumbnail?.url ?? ''}
                dataTestId={'lifeevent-card-with-featured-items'}
                href={linkResolver(typename as LinkType, [slug]).href}
                featuredItems={featured ?? []}
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
