import Head from 'next/head'
import {
  Text,
  GridContainer,
  GridRow,
  GridColumn,
  Breadcrumbs,
} from '@island.is/island-ui/core'
import {
  LinkType,
  linkResolver,
  useNamespaceStrict as useNamespace,
} from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  type QueryGetNamespaceArgs,
  type GetNamespaceQuery,
  GetLifeEventsQuery,
} from '@island.is/web/graphql/schema'
import type { Screen } from '../../types'
import { CardWithFeaturedItems, GridItems } from '@island.is/web/components'
import { ContentLanguage, QueryGetLifeEventsArgs } from '@island.is/api/schema'
import { GET_LIFE_EVENTS_QUERY, GET_NAMESPACE_QUERY } from '../queries'
import { ApplicationsTexts } from './LifeEvents.types'

interface Props {
  lifeEvents: any
  namespace: ApplicationsTexts
}

const LifeEvents: Screen<Props> = ({ lifeEvents, namespace }) => {
  const n = useNamespace(namespace)
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
        mobileItemWidth={215}
        mobileItemsRows={5}
        insideGridContainer
        paddingTop={5}
        paddingBottom={2}
        third
      >
        {lifeEvents?.map((event: any, index: number) => {
          return (
            <CardWithFeaturedItems
              key={index}
              heading={event.shortTitle || event.title}
              imgSrc={event.tinyThumbnail?.url ?? ''}
              alt={event.tinyThumbnail?.title ?? ''}
              dataTestId={'lifeevent-card-with-featured-items'}
              href={
                linkResolver(event.__typename as LinkType, [event.slug]).href
              }
              featuredItems={event.featured ?? []}
              buttonTitle={
                event.seeMoreText && event.seeMoreText !== ''
                  ? event.seeMoreText
                  : 'Skoða lífsviðburð'
              }
            />
          )
        })}
      </GridItems>
    </>
  )
}

LifeEvents.getProps = async ({ apolloClient, locale }) => {
  const [
    {
      data: { getLifeEvents: lifeEvents },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<GetLifeEventsQuery, QueryGetLifeEventsArgs>({
      query: GET_LIFE_EVENTS_QUERY,
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
            namespace: 'LifeEvents',
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
