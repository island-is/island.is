import React, { useMemo, useRef } from 'react'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import slugify from '@sindresorhus/slugify'
import NextLink from 'next/link'
import {
  SectionWithImage,
  Slice as SliceType,
} from '@island.is/island-ui/contentful'
import {
  GridRow,
  GridColumn,
  Breadcrumbs,
  Text,
  Box,
  GridContainer,
  BreadCrumbItem,
  Inline,
  Tag,
  Link,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  BackgroundImage,
  Form,
  HeadWithSocialSharing,
  WatsonChatPanel,
} from '@island.is/web/components'
import {
  GET_LIFE_EVENT_QUERY,
  GET_NAMESPACE_QUERY,
} from '@island.is/web/screens/queries'
import {
  GetLifeEventQuery,
  GetNamespaceQuery,
  QueryGetLifeEventPageArgs,
  QueryGetNamespaceArgs,
} from '@island.is/web/graphql/schema'
import { LinkType, useLinkResolver, useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { useRouter } from 'next/router'
import { Locale } from 'locale'
import { useLocalLinkTypeResolver } from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { webRichText } from '@island.is/web/utils/richText'
import { useI18n } from '@island.is/web/i18n'
import { Webreader } from '@island.is/web/components'
import { watsonConfig } from '../AnchorPage/config'

interface LifeEventPageProps {
  lifeEvent: GetLifeEventQuery['getLifeEventPage']
  namespace: GetNamespaceQuery['getNamespace']
  locale: Locale
}

export const LifeEventPage: Screen<LifeEventPageProps> = ({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  lifeEvent: { id, image, title, intro, content, featuredImage, featured },
  namespace,
  locale,
}) => {
  useContentfulId(id)
  useLocalLinkTypeResolver()

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const n = useNamespace(namespace)
  const router = useRouter()
  const { activeLocale } = useI18n()
  const { linkResolver } = useLinkResolver()
  const sectionCountRef = useRef<number>(0)
  const overviewUrl = router.asPath.slice(0, router.asPath.lastIndexOf('/'))

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

  const socialImage = featuredImage ?? image

  return (
    <Box paddingBottom={[2, 2, 10]}>
      <HeadWithSocialSharing
        title={`${title} | Ísland.is`}
        description={intro}
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
            {image && (
              <BackgroundImage
                ratio="12:4"
                background="transparent"
                boxProps={{ background: 'white' }}
                image={image}
              />
            )}
          </Box>
        </GridRow>
        <GridRow>
          <GridColumn span={['12/12']}>
            <GridRow>
              <GridColumn span={['12/12']}>
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
                <Text variant="h1" as="h1">
                  <span className="rs_read" id={slugify(title)}>
                    {title}
                  </span>
                </Text>

                <Webreader
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore make web strict
                  readId={null}
                  readClass="rs_read"
                />

                {intro && (
                  <Text variant="intro" as="p" paddingTop={2}>
                    <span className="rs_read" id={slugify(intro)}>
                      {intro}
                    </span>
                  </Text>
                )}
                <Box className="rs_read" marginTop={2}>
                  <Inline space={2}>
                    {featured.map(
                      ({
                        title,
                        attention,
                        thing,
                      }: {
                        title: string
                        attention: boolean
                        thing: any
                      }) => {
                        const cardUrl = linkResolver(thing?.type as LinkType, [
                          thing?.slug,
                        ])
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
                          <Tag key={title} variant="blue" attention={attention}>
                            {title}
                          </Tag>
                        )
                      },
                    )}
                  </Inline>
                </Box>

                <Box className="rs_read" paddingTop={[3, 3, 4]}>
                  {webRichText(
                    content as SliceType[],
                    {
                      renderComponent: {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore make web strict
                        Form: (form) => (
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore make web strict
                          <Form form={form} namespace={namespace} />
                        ),
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore make web strict
                        SectionWithImage: (slice) => {
                          // Stagger section layout default <> reverse
                          sectionCountRef.current++

                          return (
                            <SectionWithImage
                              {...slice}
                              reverse={sectionCountRef.current % 2 === 0}
                              variant="even"
                              contain
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
        </GridRow>
      </GridContainer>
      {watsonConfig[locale] && ( // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        <WatsonChatPanel {...watsonConfig[locale]} />
      )}
    </Box>
  )
}

LifeEventPage.getProps = async ({ apolloClient, locale, query }) => {
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

  return { lifeEvent, namespace, locale: locale as Locale }
}

export default withMainLayout(LifeEventPage)
