import React, { useMemo, useRef } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { parseAsBoolean } from 'next-usequerystate'
import slugify from '@sindresorhus/slugify'

import {
  SectionWithImage,
  Slice as SliceType,
} from '@island.is/island-ui/contentful'
import {
  Box,
  BreadCrumbItem,
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
  Inline,
  Link,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import {
  AnchorNavigation,
  BackgroundImage,
  Form,
  HeadWithSocialSharing,
  Sticky,
  WatsonChatPanel,
} from '@island.is/web/components'
import { Webreader } from '@island.is/web/components'
import {
  GetLifeEventQuery,
  GetNamespaceQuery,
  QueryGetLifeEventPageArgs,
  QueryGetNamespaceArgs,
} from '@island.is/web/graphql/schema'
import { LinkType, useLinkResolver, useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { useLocalLinkTypeResolver } from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  GET_LIFE_EVENT_QUERY,
  GET_NAMESPACE_QUERY,
} from '@island.is/web/screens/queries'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { createNavigation } from '@island.is/web/utils/navigation'
import { webRichText } from '@island.is/web/utils/richText'

import { defaultWatsonConfig, watsonConfig } from './config'

interface LifeEventPageProps {
  lifeEvent: GetLifeEventQuery['getLifeEventPage']
  newLayout?: boolean
  namespace: GetNamespaceQuery['getNamespace']
  locale: Locale
}

export const LifeEventPage: Screen<LifeEventPageProps> = ({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  lifeEvent,
  newLayout = false,
  namespace,
  locale,
}) => {
  useContentfulId(lifeEvent?.id)
  useLocalLinkTypeResolver()

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const n = useNamespace(namespace)
  const router = useRouter()
  const { activeLocale } = useI18n()
  const { linkResolver } = useLinkResolver()
  const sectionCountRef = useRef<number>(0)
  const overviewUrl = router.asPath.slice(0, router.asPath.lastIndexOf('/'))

  const navigation = useMemo(() => {
    if (lifeEvent) {
      const { content, title } = lifeEvent
      return createNavigation(content, { title })
    }
  }, [lifeEvent])

  const breadcrumbItems = useMemo(() => {
    const items: BreadCrumbItem[] = [
      {
        title: 'Ísland.is',
        href: '/',
        typename: 'homepage',
      },
    ]

    items.push({
      title: n('lifeEvents', 'Lífsviðburðir'),
      href: overviewUrl,
    })

    return items
  }, [n, overviewUrl])

  const socialImage = lifeEvent?.featuredImage ?? lifeEvent?.image

  const chatConfig =
    watsonConfig[locale]?.[lifeEvent?.id as string] ||
    defaultWatsonConfig[locale]

  return (
    <Box paddingBottom={[2, 2, 10]}>
      <HeadWithSocialSharing
        title={`${lifeEvent?.title} | Ísland.is`}
        description={lifeEvent?.intro ?? ''}
        imageUrl={socialImage?.url}
        imageContentType={socialImage?.contentType}
        imageWidth={socialImage?.width?.toString()}
        imageHeight={socialImage?.height?.toString()}
      />

      <GridContainer id="main-content">
        <GridRow>
          <Box
            marginBottom={[4, 4, 4, 8]}
            display="inlineBlock"
            width="full"
            printHidden
          >
            {lifeEvent?.image && (
              <BackgroundImage
                ratio="12:4"
                background="transparent"
                boxProps={{ background: 'white' }}
                image={lifeEvent.image}
              />
            )}
          </Box>
        </GridRow>
        <GridRow>
          <GridColumn
            span={
              newLayout
                ? ['12/12']
                : ['12/12', '12/12', '12/12', '8/12', '9/12']
            }
          >
            <GridRow>
              <GridColumn
                span={
                  newLayout ? ['12/12'] : ['9/9', '9/9', '9/9', '9/9', '7/9']
                }
                offset={newLayout ? undefined : ['0', '0', '0', '0', '1/9']}
              >
                <Box paddingBottom={[2, 2, 4]}>
                  <Breadcrumbs
                    items={breadcrumbItems}
                    renderLink={(link, { href }) => {
                      return (
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore make web strict
                        <NextLink href={href} passHref legacyBehavior>
                          {link}
                        </NextLink>
                      )
                    }}
                  />
                </Box>
                <Box paddingBottom={[4, 4, 6]}>
                  <Text variant="h1" as="h1">
                    <span
                      className="rs_read"
                      id={slugify(lifeEvent?.title ?? '')}
                    >
                      {lifeEvent?.title}
                    </span>
                  </Text>

                  <Webreader
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore make web strict
                    readId={null}
                    readClass="rs_read"
                  />

                  {lifeEvent?.intro && (
                    <Text variant="intro" as="p" paddingTop={2}>
                      <span className="rs_read" id={slugify(lifeEvent.intro)}>
                        {lifeEvent.intro}
                      </span>
                    </Text>
                  )}
                  {(lifeEvent?.featured ?? []).length > 0 && (
                    <Box marginTop={[3, 3, 5]}>
                      <Text variant="eyebrow" marginBottom={2}>
                        {n('shortcuts', 'Flýtileiðir')}
                      </Text>
                      <Inline space={2}>
                        {lifeEvent?.featured.map(
                          ({ title, attention, thing }) => {
                            const cardUrl = linkResolver(
                              thing?.type as LinkType,
                              [thing?.slug ?? ''],
                              locale,
                            )
                            return cardUrl?.href && cardUrl?.href.length > 0 ? (
                              <Tag
                                key={title}
                                {...(cardUrl.href.startsWith('/')
                                  ? {
                                      CustomLink: ({ children, ...props }) => (
                                        <Link
                                          key={title}
                                          {...props}
                                          {...cardUrl}
                                          dataTestId="featured-link"
                                        >
                                          {children}
                                        </Link>
                                      ),
                                    }
                                  : { href: cardUrl.href })}
                                variant="blue"
                                attention={attention}
                              >
                                {title}
                              </Tag>
                            ) : (
                              <Tag
                                key={title}
                                variant="blue"
                                attention={attention}
                              >
                                {title}
                              </Tag>
                            )
                          },
                        )}
                      </Inline>
                    </Box>
                  )}
                </Box>
                <Box
                  className="rs_read"
                  paddingTop={[6, 8, 10]}
                  borderTopWidth="standard"
                  borderColor="blue200"
                >
                  {webRichText(
                    lifeEvent?.content as SliceType[],
                    {
                      renderComponent: {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore make web strict
                        SectionWithImage: (slice) => {
                          // Stagger section layout default <> reverse
                          sectionCountRef.current++

                          return (
                            <SectionWithImage
                              {...slice}
                              reverse={
                                sectionCountRef.current % 2 === 0 && newLayout
                              }
                              variant={newLayout ? 'even' : 'default'}
                              contain={newLayout}
                            />
                          )
                        },
                      },
                    },
                    activeLocale,
                  )}
                </Box>
              </GridColumn>
            </GridRow>
          </GridColumn>
          {!newLayout && navigation && (
            <GridColumn hiddenBelow="lg" span={['0', '0', '0', '4/12', '3/12']}>
              <Box printHidden height="full" marginTop={10} paddingLeft={4}>
                <Sticky>
                  <AnchorNavigation
                    title={n('categoryOverview', 'Á þessari síðu')}
                    navigation={navigation}
                    position="right"
                  />
                </Sticky>
              </Box>
            </GridColumn>
          )}
        </GridRow>
      </GridContainer>
      {chatConfig && <WatsonChatPanel {...chatConfig} />}
    </Box>
  )
}

LifeEventPage.getProps = async ({ apolloClient, locale, query }) => {
  const newLayout = parseAsBoolean
    .withDefault(false)
    .parseServerSide(query.newLayout)
  const [
    {
      data: { getLifeEventPage: lifeEvent },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<GetLifeEventQuery, QueryGetLifeEventPageArgs>({
      query: GET_LIFE_EVENT_QUERY,
      fetchPolicy: 'no-cache',
      variables: {
        input: { lang: locale, slug: String(query.slug) },
      },
    }),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Articles',
            lang: locale,
          },
        },
      })
      // map data here to reduce data processing in component
      .then((content) =>
        content.data.getNamespace?.fields
          ? JSON.parse(content.data.getNamespace.fields)
          : {},
      ),
  ])

  if (!lifeEvent) {
    throw new CustomNextError(404, 'LifeEvent Page not found')
  }

  return { lifeEvent, newLayout, namespace, locale: locale as Locale }
}

export default withMainLayout(LifeEventPage)
